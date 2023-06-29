import { prisma } from '$lib/server/prisma';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	let theme: string | null = null;

	const cookieTheme = event.cookies.get('colortheme');

	if (cookieTheme) {
		theme = cookieTheme;
	}

	const sessionId = event.cookies.get('chartiverse_session');

	if (sessionId)
		event.locals.user = await prisma.user.findFirst({
			where: {
				sessions: {
					some: {
						id: sessionId
					}
				}
			}
		});

	if (theme) {
		return await resolve(event, {
			transformPageChunk: ({ html }) =>
				html.replace('data-theme="catppuccin-mocha"', `data-theme="${theme}"`)
		});
	}

	return await resolve(event);
};
