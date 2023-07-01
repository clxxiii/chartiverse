import { StatusCodes } from '$lib/StatusCodes';
import { prisma } from '$lib/server/prisma';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies, url }) => {
	const redirectUrl = url.searchParams.get('to') ?? '/';
	const sessionId = cookies.get('chartiverse_session');
	await prisma.session.delete({
		where: {
			token: sessionId
		}
	});
	cookies.delete('chartiverse_session', { path: '/' });
	throw redirect(StatusCodes.TEMPORARY_REDIRECT, redirectUrl);
};
