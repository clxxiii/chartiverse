import { prisma } from '$lib/server/prisma';
import { error, redirect, type ServerLoad } from '@sveltejs/kit';
import type { Actions } from './$types';
import { StatusCodes } from '$lib/StatusCodes';

export const load: ServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');

	const keys = await prisma.key.findMany({
		where: {
			"user_id": user.id
		},
		"select": {
			"id": true,
			"pretty_name": true,
		}
	})
	const sessions = await prisma.session.findMany({
		where: {
			"user_id": user.id
		},
		select: {
			"last_used": true,
			"id": true
		}
	})

	return { keys, sessions };
};

export const actions: Actions = {
	save: async ({ locals, request }) => {
		const user = locals.user;
		if (!user) throw error(StatusCodes.UNAUTHORIZED);

		const data = await request.formData();

		// Username
		const username = data.get('username');
		if (username && typeof username == 'string') {
			await prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					username
				}
			});
		}
	},
	'change-theme': async ({ request, cookies }) => {
		const data = await request.formData();
		const theme = data.get('id');

		if (theme && typeof theme == 'string') {
			cookies.set('colortheme', theme, {
				path: '/',
				maxAge: 60 * 60 * 24 * 31
			});
		}
	}
};
