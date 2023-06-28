import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import { exchangeCode } from '$lib/server/TwitchOauth';

export const GET: RequestHandler = async ({ url }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const scope = url.searchParams.get('scope');

	if (!code) throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
	if (!state) throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
	if (!scope) throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
	await exchangeCode(code, scope, state);

	throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
};
