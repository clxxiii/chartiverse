import { redirect, type RequestHandler } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import { StatusCodes } from '$lib/StatusCodes';
import { generateUrl } from '$lib/server/DiscordOauth';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async ({ url }) => {
	const id = randomBytes(4).toString('hex');
	const href = url.searchParams.get('from') ?? '/';

	await prisma.loginProcess.create({
		data: {
			id,
			href
		}
	});

	throw redirect(StatusCodes.TEMPORARY_REDIRECT, generateUrl('identify', id));
};
