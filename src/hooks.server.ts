import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	let theme: string | null = null;

	const cookieTheme = event.cookies.get('colortheme');

	if (cookieTheme) {
		theme = cookieTheme;
	}

	if (theme) {
		return await resolve(event, {
			transformPageChunk: ({ html }) =>
				html.replace('data-theme="catppuccin-mocha"', `data-theme="${theme}"`)
		});
	}

	return await resolve(event);
};
