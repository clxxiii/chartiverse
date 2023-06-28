import { prisma } from '$lib/server/prisma';
import { error, redirect, type ServerLoad } from '@sveltejs/kit';
import type { Actions } from './$types';
import { StatusCodes } from '$lib/StatusCodes';

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

	if (!user) throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');

	return;
};

export const actions: Actions = {
	save: async ({ request, cookies }) => {
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

		if (!user) throw error(StatusCodes.UNAUTHORIZED);

		const data = await request.json();

		if (data.username) {
			await prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					username: data.username
				}
			});
		}
	},
	'change-theme': async ({ request, cookies }) => {
		const data = await request.json();
		const theme = data.id;

		if (theme) {
			cookies.set('colortheme', theme, {
				path: '/',
				maxAge: 60 * 60 * 24 * 31
			});
		}
	}
};
