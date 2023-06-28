import { prisma } from '$lib/server/prisma';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ cookies }) => {
	const sessionId = cookies.get('chartiverse_session');
	if (!sessionId) return {};
	const user = await prisma.user.findFirst({
		where: {
			sessions: {
				some: {
					id: sessionId
				}
			}
		}
	});

	return { user };
};
