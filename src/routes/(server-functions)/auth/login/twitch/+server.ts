import { redirect, type RequestHandler } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import { StatusCodes } from '$lib/StatusCodes';
import { generateUrl } from '$lib/server/TwitchOauth';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async ({ url }) => {
	const id = randomBytes(4).toString('hex');
	const href = url.searchParams.get('from') ?? '/';
	const user = url.searchParams.get('user') ?? undefined;

	await prisma.loginProcess.create({
		data: {
			id,
			href,
			linked_to_id: user
		}
	});

	throw redirect(StatusCodes.TEMPORARY_REDIRECT, generateUrl('user:read:email', id));
};
