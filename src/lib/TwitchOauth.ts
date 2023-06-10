import { HOSTNAME, TWITCH_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_TWITCH_CLIENT_ID } from '$env/static/public';
import { error } from '@sveltejs/kit';
import { prisma } from './prisma';
import { StatusCodes } from './StatusCodes';

const AUTH_URL = 'https://id.twitch.tv/oauth2/authorize';
const TOKEN_URL = 'https://id.twitch.tv/oauth2/token';
const API_URL = 'https://api.twitch.tv/helix';

export const generateUrl = (scope: string, state: string) => {
	const params = new URLSearchParams();
	params.set('client_id', PUBLIC_TWITCH_CLIENT_ID);
	params.set('redirect_uri', `${HOSTNAME}/auth/callback/twitch`);
	params.set('scope', scope);
	params.set('state', state);
	params.set('force_verify', 'true');
	params.set('response_type', 'code');
	return `${AUTH_URL}?${params.toString()}`;
};

export const exchangeCode = async (code: string, scope: string, state: string) => {
	const params = new URLSearchParams();
	params.set('client_id', PUBLIC_TWITCH_CLIENT_ID);
	params.set('client_secret', TWITCH_CLIENT_SECRET);
	params.set('code', code);
	params.set('grant_type', 'authorization_code');
	params.set('redirect_uri', `${HOSTNAME}/auth/callback/twitch`);

	const tokenRequestUrl = `${TOKEN_URL}?${params.toString()}`;
	const tokenRequest = await fetch(tokenRequestUrl, {
		method: 'POST'
	});
	const token = await tokenRequest.json();

	const userDataRequest = await fetch(`${API_URL}/users`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token.access_token}`,
			'Client-Id': PUBLIC_TWITCH_CLIENT_ID
		}
	});
	const userData = await userDataRequest.json();
	if (userData.error) {
		throw error(
			StatusCodes.INTERNAL_SERVER_ERROR,
			`${userData.status}: ${userData.error}, ${userData.message}`
		);
	}
	const data = userData.data[0];

	const session = await prisma.session.findUnique({
		where: {
			state
		}
	});
	if (!session)
		throw error(
			StatusCodes.INTERNAL_SERVER_ERROR,
			'If you got here something incredibly wrong has happened'
		);

	await prisma.user.upsert({
		where: {
			twitch_id: data.id
		},
		create: {
			username: userData.display_name,
			avatar_url: userData.profile_image_url,
			twitch_oauth: {
				create: {
					access_token: token.access_token,
					expires_at: new Date(Date.now() + token.expires_in * 1000),
					refresh_token: token.refresh_token,
					token_type: 'Bearer',
					scope: scope
				}
			},
			sessions: {
				connectOrCreate: {
					where: {
						id: session.id
					},
					create: {
						id: session.id
					}
				}
			}
		},
		update: {
			sessions: {
				connectOrCreate: {
					where: {
						id: session.id
					},
					create: {
						id: session.id
					}
				}
			},
			twitch_oauth: {
				upsert: {
					update: {
						access_token: token.access_token,
						expires_at: new Date(Date.now() + token.expires_in * 1000),
						refresh_token: token.refresh_token,
						scope: scope
					},
					create: {
						access_token: token.access_token,
						expires_at: new Date(Date.now() + token.expires_in * 1000),
						refresh_token: token.refresh_token,
						token_type: 'Bearer',
						scope: scope
					}
				}
			}
		}
	});
};
