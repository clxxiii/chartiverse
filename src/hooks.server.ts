import { JWT_SECRET } from '$env/static/private';
import { prisma } from '$lib/server/prisma';
import type { Handle } from '@sveltejs/kit';
import * as jose from "jose"

const jwt_secret = new TextEncoder().encode(JWT_SECRET)

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('chartiverse_session');

	// A lot of verification to make sure tokens aren't malformed
	if (sessionToken) {
		try {
			const { payload } = await jose.jwtVerify(sessionToken, jwt_secret)
			const userId = payload.user_id;
			const sessionId = payload.session_id;
			if (!userId || typeof userId != 'string') throw "No User Id in Token!"
			if (!sessionId || typeof sessionId != 'string') throw "No User Id in Token!"

			const user = await prisma.user.findUnique({
				where: {
					id: userId
				},
				include: {
					"sessions": {
						"select": {
							"id": true
						}
					}
				}
			})

			if (!user || !user.sessions.find(x => x.id == sessionId)) throw "Token is malformed";

			event.locals.user = await prisma.user.findFirst({
				where: {
					sessions: {
						some: {
							token: sessionToken
						}
					}
				}
			});

		}
		catch (error) {
			console.log(error)
			event.cookies.delete('chartiverse_session', { path: '/' })
		}

	}

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
