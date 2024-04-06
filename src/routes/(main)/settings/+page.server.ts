import { prisma } from '$lib/server/prisma';
import { error, redirect, type ServerLoad } from '@sveltejs/kit';
import type { Actions } from './$types';
import { StatusCodes } from '$lib/StatusCodes';
import { validateDriveId } from '$lib/server/GoogleDrive';

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
	},
	'change-drive-id': async ({ request, locals }) => {
		const user = locals.user;
		const data = await request.formData();

		const driveId = data.get('id');
		if (driveId && typeof driveId == 'string') {
			const { can_read, valid_id } = await validateDriveId(driveId);
			if (!valid_id) {
				throw error(StatusCodes.BAD_REQUEST, "Not a valid Google Drive ID")
			}
			if (!can_read) {
				throw error(StatusCodes.BAD_REQUEST, "This folder isn't public")
			}
		}
	},
};
