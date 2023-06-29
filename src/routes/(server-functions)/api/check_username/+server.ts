import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async ({ url }) => {
	const username = url.searchParams.get('u');

	if (!username) throw error(StatusCodes.BAD_REQUEST);

	const user = await prisma.user.findUnique({
		where: {
			id: username
		}
	});
	return json({
		username,
		taken: user == null
	});
};
