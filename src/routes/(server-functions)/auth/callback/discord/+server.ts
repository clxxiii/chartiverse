import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import { exchangeCode, getUserInfo } from '$lib/server/DiscordOauth';
import {
	createSession,
	deleteState,
	getOauthUser,
	getState,
	keyExists,
	linkOauthUser,
	newOauthUser
} from '$lib/server/auth';
import type { User } from '@prisma/client';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code'),
		stateId = url.searchParams.get('state');

	if (!code || !stateId) throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');

	// Check state
	const state = await getState(stateId);
	if (!state) throw error(StatusCodes.UNAUTHORIZED);

	const token = await exchangeCode(code, 'identify');

	const discordUserData = await getUserInfo(token.access_token);


	let user: User | null;
	if (await keyExists(`discord:${discordUserData.id}`)) {
		user = await getOauthUser('discord', token, discordUserData);
	}
	else if (state.linked_to_id) {
		user = await linkOauthUser(state.linked_to_id, 'discord', token, discordUserData)

	} else {
		user = await newOauthUser('discord', token, discordUserData);
	}

	if (!user) throw error(StatusCodes.INTERNAL_SERVER_ERROR);

	if (!state.linked_to_id) {
		const session = await createSession(user);
		if (!session || !session.token) throw error(StatusCodes.INTERNAL_SERVER_ERROR);

		cookies.set('chartiverse_session', session.token, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365
		});
	}


	await deleteState(stateId);
	throw redirect(StatusCodes.TEMPORARY_REDIRECT, state.href);
};
