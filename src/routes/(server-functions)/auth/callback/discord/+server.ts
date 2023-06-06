import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import { exchangeCode } from '$lib/DiscordOauth';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	if (!code) throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
	if (!state) throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
	await exchangeCode(code, 'identify', state);

	throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
};
