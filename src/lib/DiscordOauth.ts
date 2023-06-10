import DiscordOauth2 from 'discord-oauth2';
import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';
import { DISCORD_CLIENT_SECRET, HOSTNAME } from '$env/static/private';
import { prisma } from './prisma';
import { error } from '@sveltejs/kit';

const oauth = new DiscordOauth2({
	clientId: PUBLIC_DISCORD_CLIENT_ID,
	clientSecret: DISCORD_CLIENT_SECRET,
	redirectUri: `${HOSTNAME}/auth/callback/discord`
});

export const generateUrl = (scope: string, state: string) =>
	oauth.generateAuthUrl({
		scope,
		state
	});

export const exchangeCode = async (code: string, scope: string, state: string) => {
	const token = await oauth.tokenRequest({ code, scope, grantType: 'authorization_code' });
	const user = await prisma.user.findFirst({
		where: {
			state
		}
	});
	if (!user) throw error(400);
	await prisma.discordOauth.upsert({
		where: {
			user_id: user.id
		},
		create: {
			access_token: token.access_token,
			user_id: user.id,
			token_type: token.token_type,
			expires_at: new Date(Date.now() + token.expires_in * 1000),
			refresh_token: token.refresh_token,
			scope: token.scope
		},
		update: {
			access_token: token.access_token,
			token_type: token.token_type,
			expires_at: new Date(Date.now() + token.expires_in * 1000),
			refresh_token: token.refresh_token,
			scope: token.scope
		}
	});
	const userData = await oauth.getUser(token.access_token);
	await prisma.user.upsert({
		where: {},
		data: {
			avatar_url: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
			discord_id: userData.id,
			state: ''
		}
	});
};
