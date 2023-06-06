import { StatusCodes } from '$lib/StatusCodes';
import { prisma } from '$lib/prisma';
import { upload } from '$lib/storage';
import { error, json, redirect, type RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ request, url, cookies }) => {
	const data = await request.json();
	const id = url.searchParams.get('id');

	if (!id) throw error(StatusCodes.BAD_REQUEST);

	upload(Buffer.from(data.album, 'base64'), `${id}/album.jpg`);
	upload(Buffer.from(data.song, 'base64'), `${id}/song.ogg`);
	upload(Buffer.from(data.chart, 'base64'), `${id}/notes.chart`);

	const chart = await prisma.chart.findUnique({ where: { id } });
	return json({ chart });
};
