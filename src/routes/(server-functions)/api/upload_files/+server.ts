import { PUBLIC_UPLOAD_ENABLED_USERS } from '$env/static/public';
import { StatusCodes } from '$lib/StatusCodes';
import { prisma } from '$lib/prisma';
import { upload } from '$lib/storage';
import { error, json, type RequestHandler } from '@sveltejs/kit';

const uploadUsers = JSON.parse(PUBLIC_UPLOAD_ENABLED_USERS);

export const PUT: RequestHandler = async ({ request, url, cookies }) => {
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
	if (uploadUsers.length > 0 && user && !uploadUsers.includes(user.id))
		throw error(StatusCodes.UNAUTHORIZED);

	const data = await request.json();
	const id = url.searchParams.get('id');

	if (!id) throw error(StatusCodes.BAD_REQUEST);

	upload(Buffer.from(data.album, 'base64'), `${id}/album.jpg`);
	upload(Buffer.from(data.song, 'base64'), `${id}/song.ogg`);
	upload(Buffer.from(data.chart, 'base64'), `${id}/notes.chart`);

	const chart = await prisma.chart.findUnique({ where: { id } });
	return json({ chart });
};
