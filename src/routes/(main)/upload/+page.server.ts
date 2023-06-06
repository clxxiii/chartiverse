import { PUBLIC_UPLOAD_ENABLED_USERS } from '$env/static/public';
import { prisma } from '$lib/prisma';
import { error, type ServerLoad } from '@sveltejs/kit';

export const ssr = false;

const uploadUsers = JSON.parse(PUBLIC_UPLOAD_ENABLED_USERS);

export const load: ServerLoad = async ({ cookies }) => {
	const sessionId = cookies.get('chartiverse_session');

	const user = await prisma.user.findFirst({
		where: {
			sessions: {
				some: {
					id: sessionId
				}
			}
		}
	});
	if (uploadUsers.length > 0 && user && !uploadUsers.includes(user.id)) {
		throw error(400, 'Unauthorized to upload');
	}
};
