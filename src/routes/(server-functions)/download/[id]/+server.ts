import { prisma } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import JSZip from 'jszip';
import { download } from '$lib/storage';

const BLACKLISTED_PROPERIES = [
	'id',
	'user_id',
	'album_url',
	'song_url',
	'chart_url',
	'date_added',
	'tag'
];

export const GET: RequestHandler = async ({ params }) => {
	const id = params.id;
	const chartMetadata = await prisma.chart.findUnique({ where: { id } });
	if (!chartMetadata) throw error(StatusCodes.NOT_FOUND);

	let songIni = '[Song]\n';
	for (const key in chartMetadata) {
		if (BLACKLISTED_PROPERIES.includes(key)) continue;

		songIni += `${key} = ${chartMetadata[key]}\n`;
	}

	const album = await download(`/charts/${id}/album.jpg`);
	const chart = await download(`/charts/${id}/notes.chart`);
	const song = await download(`/charts/${id}/song.ogg`);

	const zip = new JSZip();
	zip.file(`${chartMetadata.artist} - ${chartMetadata.name}/song.ini`, songIni);
	zip.file(`${chartMetadata.artist} - ${chartMetadata.name}/album.jpg`, album);
	zip.file(`${chartMetadata.artist} - ${chartMetadata.name}/notes.chart`, chart);
	zip.file(`${chartMetadata.artist} - ${chartMetadata.name}/song.ogg`, song);

	const file = await zip.generateAsync({ type: 'uint8array' });

	return new Response(file, {
		headers: {
			'Content-Disposition': `attachment; filename=${chartMetadata.artist} - ${chartMetadata.name}.zip`
		}
	});
};
