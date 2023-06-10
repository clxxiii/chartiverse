import { redirect, type RequestHandler } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import { StatusCodes } from '$lib/StatusCodes';
import { generateUrl } from '$lib/DiscordOauth';
import { prisma } from '$lib/prisma';

export const GET: RequestHandler = async ({ cookies }) => {
	const state = randomBytes(4).toString('hex');

	const session = await prisma.session.create({
		data: {
			state
		}
	});
	cookies.set('chartiverse_session', session.id, { path: '/' });

	throw redirect(StatusCodes.TEMPORARY_REDIRECT, generateUrl('identify', state));
};
