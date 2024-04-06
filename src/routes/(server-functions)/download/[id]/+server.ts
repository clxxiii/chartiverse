import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import JSZip from 'jszip';
import { downloadFromUrl } from '$lib/server/storage';

const BLACKLISTED_PROPERIES = [
	'id',
	'user_id',
	'album_url',
	'song_url',
	'chart_url',
	'visibility',
	'status',
	'date_added',
	'last_updated',
	'tags',
	'background_url',
	'drive_id',
	'audio_type',
	'album_type',
	'background_type',
	'icon_type',
	'username'
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

	const album = await downloadFromUrl(chartMetadata.album_url);
	const chart = await downloadFromUrl(chartMetadata.chart_url);
	const song = await downloadFromUrl(chartMetadata.song_url);

	const zip = new JSZip();
	zip.file(`${chartMetadata.artist} - ${chartMetadata.name}/song.ini`, songIni);
	zip.file(
		`${chartMetadata.artist} - ${chartMetadata.name}/album.${chartMetadata.album_type}`,
		album
	);
	zip.file(`${chartMetadata.artist} - ${chartMetadata.name}/notes.chart`, chart);
	zip.file(
		`${chartMetadata.artist} - ${chartMetadata.name}/song.${chartMetadata.audio_type}`,
		song
	);

	if (chartMetadata.background_url) {
		const background = downloadFromUrl(chartMetadata.background_url);
		zip.file(
			`${chartMetadata.artist} - ${chartMetadata.name}/background.${chartMetadata.background_type}`,
			background
		);
	}

	const file = await zip.generateAsync({ type: 'uint8array' });

	// Remove problematic characters
	const filename = `${chartMetadata.artist} - ${chartMetadata.name}.zip`
		.replaceAll('\\', '')
		.replaceAll('/', '')
		.replaceAll(':', '')
		.replaceAll('*', '')
		.replaceAll('?', '')
		.replaceAll('"', '')
		.replaceAll('>', '')
		.replaceAll('<', '')
		.replaceAll('|', '')
		.replaceAll(',', '');

	return new Response(file, {
		headers: {
			'Content-Disposition': `attachment; filename=${filename}`
		}
	});
};
