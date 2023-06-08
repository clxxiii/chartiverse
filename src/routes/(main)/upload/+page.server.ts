import { PUBLIC_UPLOAD_ENABLED_USERS } from '$env/static/public';
import { StatusCodes } from '$lib/StatusCodes';
import { prisma } from '$lib/prisma';
import { error, type ServerLoad } from '@sveltejs/kit';

export const ssr = false;

const uploadUsers = JSON.parse(PUBLIC_UPLOAD_ENABLED_USERS);

export const load: ServerLoad = async ({ cookies }) => {
	const sessionId = cookies.get('chartiverse_session');
	if (!sessionId) throw error(StatusCodes.UNAUTHORIZED);
	const user = await prisma.user.findFirst({
		where: {
			sessions: {
				some: {
					id: sessionId
				}
			}
		}
	});
	if (!user) throw error(StatusCodes.UNAUTHORIZED);
	if (uploadUsers.length > 0 && user && !uploadUsers.includes(user.id)) {
		throw error(StatusCodes.UNAUTHORIZED, 'Unauthorized to upload');
	}
};
