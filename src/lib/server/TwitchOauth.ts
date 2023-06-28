import { URL_HOSTNAME, TWITCH_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_CDN_ENDPOINT, PUBLIC_TWITCH_CLIENT_ID } from '$env/static/public';
import { randomBytes } from 'crypto';
import { TwitchAPI } from 'twitch-api-typescript';
import { error } from '@sveltejs/kit';
import { prisma } from './prisma';
import { StatusCodes } from '../StatusCodes';
import { upload } from './storage';

const AUTH_URL = 'https://id.twitch.tv/oauth2/authorize';
const TOKEN_URL = 'https://id.twitch.tv/oauth2/token';

export const generateUrl = (scope: string, state: string) => {
	const params = new URLSearchParams();
	params.set('client_id', PUBLIC_TWITCH_CLIENT_ID);
	params.set('redirect_uri', `${URL_HOSTNAME}/auth/callback/twitch`);
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
	params.set('redirect_uri', `${URL_HOSTNAME}/auth/callback/twitch`);

	const tokenRequestUrl = `${TOKEN_URL}?${params.toString()}`;
	const tokenRequest = await fetch(tokenRequestUrl, {
		method: 'POST'
	});
	const token = await tokenRequest.json();

	const twitchClient = new TwitchAPI({
		clientId: PUBLIC_TWITCH_CLIENT_ID,
		clientSecret: TWITCH_CLIENT_SECRET,
		tokens: {
			userToken: token.access_token
		},
		options: {
			refreshAppToken: false,
			refreshUserToken: false
		}
	});
	await twitchClient.init();

	const userData = (await twitchClient.getUsers())[0];

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

	const user = await prisma.user.upsert({
		where: {
			twitch_id: userData.id
		},
		create: {
			username: userData.displayName,
			twitch_id: userData.id,
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

	// Upload avatar to cdn
	if (!userData.profileImageURL || user.avatar_url) return;

	const avatarId = randomBytes(8).toString('hex');
	const avatarRequest = await fetch(userData.profileImageURL);
	const avatar = await avatarRequest.arrayBuffer();
	await upload(avatar, `/a/${user.id}/${avatarId}.png`);
	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			avatar_url: `${PUBLIC_CDN_ENDPOINT}/a/${user.id}/${avatarId}.png`
		}
	});
};
