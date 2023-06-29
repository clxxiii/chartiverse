import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import { exchangeCode, getUserInfo, isError } from '$lib/server/TwitchOauth';
import {
	createSession,
	deleteState,
	getOauthUser,
	getState,
	keyExists,
	newOauthUser
} from '$lib/server/auth';
import type { User } from '@prisma/client';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code'),
		stateId = url.searchParams.get('state'),
		scope = url.searchParams.get('scope');

	if (!code || !stateId || !scope) throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');

	// Check state
	const state = await getState(stateId);

	if (!state) throw error(StatusCodes.UNAUTHORIZED);

	const token = await exchangeCode(code);
	if (isError(token)) {
		console.log(token.message);
		throw error(StatusCodes.INTERNAL_SERVER_ERROR, token.message);
	}
	const twitchUserData = await getUserInfo(token.access_token);

	let user: User | null;
	if (await keyExists(`twitch:${twitchUserData.id}`)) {
		user = await getOauthUser('twitch', token, twitchUserData);
	} else {
		user = await newOauthUser('twitch', token, twitchUserData);
	}

	if (!user) throw error(StatusCodes.INTERNAL_SERVER_ERROR);

	const session = await createSession(user);
	if (!session) throw error(StatusCodes.INTERNAL_SERVER_ERROR);

	cookies.set('chartiverse_session', session.id, {
		path: '/',
		maxAge: 60 * 60 * 24 * 365
	});

	await deleteState(stateId);
	throw redirect(StatusCodes.TEMPORARY_REDIRECT, state.href);
};
