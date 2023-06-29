import { URL_HOSTNAME, TWITCH_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_TWITCH_CLIENT_ID } from '$env/static/public';
import { TwitchAPI, type User } from 'twitch-api-typescript';

const AUTH_URL = 'https://id.twitch.tv/oauth2/authorize';
const TOKEN_URL = 'https://id.twitch.tv/oauth2/token';

export type TwitchToken = {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	token_type: string;
};
export type TwitchTokenError = {
	status: number;
	message: string;
};

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

export const exchangeCode = async (code: string): Promise<TwitchToken | TwitchTokenError> => {
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
	const tokenObj = await tokenRequest.json();
	const token: TwitchToken | TwitchTokenError = {
		...tokenObj,
		scope: tokenObj.scope.join(' ')
	};
	console.log(token);

	return token;
};

export const getUserInfo = async (access_token: string): Promise<User> => {
	const twitchClient = new TwitchAPI({
		clientId: PUBLIC_TWITCH_CLIENT_ID,
		clientSecret: TWITCH_CLIENT_SECRET,
		tokens: {
			userToken: access_token
		},
		options: {
			refreshAppToken: false,
			refreshUserToken: false
		}
	});
	await twitchClient.init();

	const userData = (await twitchClient.getUsers())[0];
	return userData;
};

export const isError = (token: TwitchToken | TwitchTokenError): token is TwitchTokenError => {
	return (<TwitchToken>token).access_token == undefined;
};
