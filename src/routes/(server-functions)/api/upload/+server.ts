import { prisma } from '$lib/prisma';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import { PUBLIC_CDN_ENDPOINT } from '$env/static/public';

export const POST: RequestHandler = async ({ cookies, request }) => {
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
				}
			}
		}
	});

	if (!user) throw error(StatusCodes.UNAUTHORIZED);

	const chartData: { [key: string]: string } = await request.json();

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
		data: typedChartData
	});

	chart = await prisma.chart.update({
		where: {
			id: chart.id
		},
		data: {
			album_url: `${PUBLIC_CDN_ENDPOINT}/${chart.id}/album.jpg`,
			song_url: `${PUBLIC_CDN_ENDPOINT}/${chart.id}/song.ogg`,
			chart_url: `${PUBLIC_CDN_ENDPOINT}/${chart.id}/notes.chart`
		}
	});

	return json({ id: chart.id });
};
