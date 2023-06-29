import DiscordOauth2 from 'discord-oauth2';
import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';
import { DISCORD_CLIENT_SECRET, URL_HOSTNAME } from '$env/static/private';

const oauth = new DiscordOauth2({
	clientId: PUBLIC_DISCORD_CLIENT_ID,
	clientSecret: DISCORD_CLIENT_SECRET,
	redirectUri: `${URL_HOSTNAME}/auth/callback/discord`
});

export const generateUrl = (scope: string, state: string) =>
	oauth.generateAuthUrl({
		scope,
		state
	});

export const exchangeCode = async (
	code: string,
	scope: string
): Promise<DiscordOauth2.TokenRequestResult> => {
	const token = await oauth.tokenRequest({ code, scope, grantType: 'authorization_code' });
	return token;
};

export const getUserInfo = async (access_token: string): Promise<DiscordOauth2.User> => {
	return oauth.getUser(access_token);
};

export const getAvatarUrl = (user_id: string, avatar: string): string => {
	return `https://cdn.discordapp.com/avatars/${user_id}/${avatar}.png`;
};
