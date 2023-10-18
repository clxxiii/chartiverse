import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { StatusCodes } from '$lib/StatusCodes';
import { getFilesInFolder } from '$lib/server/GoogleDrive';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');

	if (typeof id != 'string') {
		throw error(StatusCodes.BAD_REQUEST);
	}

	const folder = await getFilesInFolder(id);
	return json(folder);
};
