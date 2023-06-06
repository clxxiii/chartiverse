import { redirect, type RequestHandler } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import { StatusCodes } from '$lib/StatusCodes';
import { generateUrl } from '$lib/DiscordOauth';
import { prisma } from '$lib/prisma';

export const GET: RequestHandler = async ({ cookies }) => {
	const state = randomBytes(4).toString('hex');
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
	if (!user) {
		const sessionId = randomBytes(16).toString('hex');
		await prisma.user.create({
			data: {
				state,
				sessions: {
					connectOrCreate: {
						where: {
							id: sessionId
						},
						create: {
							id: sessionId
						}
					}
				}
			},
			include: {
				sessions: true
			}
		});
		cookies.set('chartiverse_session', sessionId, { path: '/' });
	}

	throw redirect(StatusCodes.TEMPORARY_REDIRECT, generateUrl('identify', state));
};
