import { createHmac } from 'node:crypto';
import { prisma } from './prisma';
import type { Session, User } from '@prisma/client';
import type { TwitchToken } from './TwitchOauth';
import type { User as TwitchUser } from 'twitch-api-typescript';
import { randomBytes } from 'crypto';
import { upload } from './storage';
import type DiscordOauth2 from 'discord-oauth2';
import { PUBLIC_CDN_ENDPOINT } from '$env/static/public';
import { getAvatarUrl } from './DiscordOauth';

const hash = (s: string, salt: string): Promise<string> =>
	new Promise((resolve) => {
		const hmac = createHmac('sha512', salt);
		hmac.on('readable', () => {
			const data = hmac.read();
			if (data) {
				resolve(data.toString('hex'));
			}
		});
		hmac.write(s);
		hmac.end();
	});

export const newUser = async (e: string, u: string, p: string) => {
	const user = await prisma.user.create({
		data: {
			id: u,
			email: e,
			username: u,
			avatar_url: '/android-chrome-192x192.png'
		}
	});

	// there shouldn't be any way that a user has no salt, but a default one has been provided just in case
	const hashed_password = await hash(p, user.salt ?? 'dSkDks0mdK91nd3');

	await prisma.key.create({
		data: {
			hashed_password,
			id: `username:${u}`,
			user: {
				connect: {
					id: user.id
				}
			}
		}
	});

	return user;
};

export const newOauthUser = async (
	provider: string,
	token: TwitchToken | DiscordOauth2.TokenRequestResult,
	oauthUser: TwitchUser | DiscordOauth2.User
): Promise<User | null> => {
	let avatarUrl;
	let username;

	if (isTwitch(oauthUser)) {
		avatarUrl = oauthUser.profileImageURL ?? '/favicon-192x192.png';
		username = oauthUser.displayName;
	} else {
		if (oauthUser.avatar) avatarUrl = getAvatarUrl(oauthUser.id, oauthUser.avatar);
		else avatarUrl = '/favicon-192x192.png';
		username = oauthUser.username;
	}

	const user = await prisma.user.create({
		data: {
			id: oauthUser.id,
			username,
			avatar_url: await uploadProfilePic(oauthUser.id, avatarUrl)
		}
	});

	await prisma.key.create({
		data: {
			id: `${provider}:${oauthUser.id}`,
			token: {
				create: {
					access_token: token.access_token,
					refresh_token: token.refresh_token,
					token_type: token.token_type,
					scope: token.scope,
					expires_at: new Date(Date.now() + token.expires_in * 1000)
				}
			},
			user: {
				connect: {
					id: user.id
				}
			}
		}
	});

	return user;
};

export const getUser = async (u: string, p: string): Promise<User | null> => {
	const user = await prisma.user.findUnique({
		where: {
			id: u
		}
	});
	if (!user) return await fail();

	// there shouldn't be any way that a user has no salt, but a default one has been provided just in case
	const hashed_password = await hash(p, user.salt ?? 'dSkDks0mdK91nd3');

	const key = await prisma.key.findFirst({
		where: {
			id: `username:${u}`,
			hashed_password
		}
	});

	if (key) return user;

	return await fail();
};

export const getOauthUser = async (
	provider: string,
	token: TwitchToken | DiscordOauth2.TokenRequestResult,
	oauthUser: TwitchUser | DiscordOauth2.User
): Promise<User | null> => {
	const key = await prisma.key.findUnique({
		where: {
			id: `${provider}:${oauthUser.id}`
		}
	});

	if (!key) return null;

	await prisma.oauthToken.update({
		where: {
			key_id: key.id
		},
		data: {
			access_token: token.access_token,
			refresh_token: token.refresh_token,
			token_type: token.token_type,
			scope: token.scope,
			expires_at: new Date(Date.now() + token.expires_in * 1000)
		}
	});

	const user = await prisma.user.findFirst({
		where: {
			keys: {
				some: {
					id: key.id
				}
			}
		}
	});

	return user;
};

export const createSession = async (user: User): Promise<Session | null> => {
	const u = await prisma.user.findUnique({
		where: {
			id: user.id
		}
	});
	if (!u) return null;

	return await prisma.session.create({
		data: {
			user: {
				connect: {
					id: user.id
				}
			}
		}
	});
};

export const getState = async (state: string) =>
	await prisma.loginProcess.findUnique({
		where: {
			id: state
		}
	});

export const deleteState = async (state: string) =>
	await prisma.loginProcess.delete({
		where: {
			id: state
		}
	});

export const keyExists = async (id: string): Promise<boolean> => {
	const key = await prisma.key.findUnique({
		where: {
			id
		}
	});

	return key != null;
};

// Wait 1000 ms before giving results of login to prevent manual brute forces
const fail = async () => {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return null;
};

const uploadProfilePic = async (user_id: string, avatar_url: string): Promise<string> => {
	const avatarId = randomBytes(8).toString('hex');
	const avatarRequest = await fetch(avatar_url);
	const avatar = await avatarRequest.arrayBuffer();
	await upload(avatar, `/a/${user_id}/${avatarId}.png`);

	return `${PUBLIC_CDN_ENDPOINT}/a/${user_id}/${avatarId}.png`;
};

const isTwitch = (user: TwitchUser | DiscordOauth2.User): user is TwitchUser => {
	return (<TwitchUser>user).broadcasterType != undefined;
};

const isDiscord = (user: TwitchUser | DiscordOauth2.User): user is DiscordOauth2.User => {
	return (<DiscordOauth2.User>user).discriminator != undefined;
};
