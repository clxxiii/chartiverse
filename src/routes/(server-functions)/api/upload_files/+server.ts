import { PUBLIC_CDN_ENDPOINT, PUBLIC_UPLOAD_ENABLED_USERS } from '$env/static/public';
import { StatusCodes } from '$lib/StatusCodes';
import { prisma } from '$lib/prisma';
import { upload } from '$lib/storage';
import type { Chart } from '@prisma/client';
import { error, json, type RequestHandler } from '@sveltejs/kit';

const uploadUsers = JSON.parse(PUBLIC_UPLOAD_ENABLED_USERS);

type FileTypes = {
	song: string,
	album: string,
	background: string | undefined,
}

export const PUT: RequestHandler = async ({ request, cookies }) => {

	const sessionId = cookies.get('chartiverse_session');
	const user = await prisma.user.findFirst({
		where: {
			sessions: {
				some: {
					id: sessionId
				}
			}
		},
		include: {
			charts: {
				orderBy: {
					date_added: 'desc'
				},
				take: 1
			}
		}
	});

	if (!user) throw error(StatusCodes.UNAUTHORIZED);
	if (uploadUsers.length > 0 && user && !uploadUsers.includes(user.id))
		throw error(StatusCodes.UNAUTHORIZED);

	const data = await request.json();

	const types: FileTypes = {
		song: data.files.song_type,
		album: data.files.album_type,
		background: data.files.background_type
	}
	const chart = await createChartDbObject(data.chart, types, user.id);

	await upload(Buffer.from(data.files.album, 'base64'), `/charts/${chart.id}/album.${types.album}`);
	await upload(Buffer.from(data.files.song, 'base64'), `/charts/${chart.id}/song.${types.song}`);
	await upload(Buffer.from(data.files.chart, 'base64'), `/charts/${chart.id}/notes.chart`);

	if (data.files.icon) await upload(Buffer.from(data.files.icon, 'base64'), `/charts/${chart.id}/icon.png`);
	if (data.files.background_type) await upload(Buffer.from(data.files.background, 'base64'), `/charts/${chart.id}/background.${types.background}`);

	return json({ chart });
};

const createChartDbObject = async (chartData: { [key: string]: string }, types: FileTypes, userId: string): Promise<Chart> => {
	const {
		name,
		artist,
		charter,
		album,
		genre,
		year,
		song_length,
		preview_start_time,
		loading_phrase,
		icon,
		modchart,
		album_track,
		playlist_track,
		diff_band,
		diff_guitar,
		diff_bass,
		diff_rhythm,
		diff_drums,
		diff_keys,
		diff_guitarghl,
		diff_bassghl,
		diff_rhythm_ghl,
		diff_drums_real,
		diff_guitar_coop_ghl,
		diff_guitar_coop,
		pro_drums,
		five_lane_drums,
		end_events,
		count,
		frets
	} = chartData;
	const typedChartData = {
		name,
		artist,
		charter,
		album,
		genre,
		year,
		song_length: parseInt(song_length) ?? 0,
		preview_start_time: parseInt(preview_start_time) ?? 0,
		loading_phrase,
		icon,
		modchart: parseInt(modchart) ?? 0,
		album_track: parseInt(album_track) ?? 16000,
		playlist_track: parseInt(playlist_track) ?? 16000,
		diff_band: parseInt(diff_band) ?? -1,
		diff_guitar: parseInt(diff_guitar) ?? -1,
		diff_bass: parseInt(diff_bass) ?? -1,
		diff_rhythm: parseInt(diff_rhythm) ?? -1,
		diff_drums: parseInt(diff_drums) ?? -1,
		diff_keys: parseInt(diff_keys) ?? -1,
		diff_guitarghl: parseInt(diff_guitarghl) ?? -1,
		diff_bassghl: parseInt(diff_bassghl) ?? -1,
		diff_rhythm_ghl: parseInt(diff_rhythm_ghl) ?? -1,
		diff_drums_real: parseInt(diff_drums_real) ?? -1,
		diff_guitar_coop_ghl: parseInt(diff_guitar_coop_ghl) ?? -1,
		diff_guitar_coop: parseInt(diff_guitar_coop) ?? -1,
		pro_drums: parseInt(pro_drums) ?? 0,
		five_lane_drums: parseInt(five_lane_drums) ?? 0,
		end_events: parseInt(end_events) ?? 0,
		count: parseInt(count) ?? 0,
		frets: parseInt(frets) ?? 0
	};
	for (const key in typedChartData) {
		if (typeof typedChartData[key] == 'number' && isNaN(typedChartData[key])) {
			delete typedChartData[key];
		}
	}

	let chart = await prisma.chart.create({
		data: {
			...typedChartData,
			user: {
				connect: {
					id: userId
				}
			}
		}
	});

	chart = await prisma.chart.update({
		where: {
			id: chart.id
		},
		data: {
			album_url: `${PUBLIC_CDN_ENDPOINT}/charts/${chart.id}/album.${types.album}`,
			album_type: types.album,
			song_url: `${PUBLIC_CDN_ENDPOINT}/charts/${chart.id}/song.${types.song}`,
			audio_type: types.song,
			chart_url: `${PUBLIC_CDN_ENDPOINT}/charts/${chart.id}/notes.chart`,
			background_url: types.background ? `${PUBLIC_CDN_ENDPOINT}/charts/${chart.id}/background.${types.background}` : null,
			background_type: types.background
		}
	});

	return chart;
}