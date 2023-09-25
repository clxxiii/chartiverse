import { StatusCodes } from '$lib/StatusCodes';
import { prisma } from '$lib/server/prisma';
import { error, type Actions, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ params }) => {
	const id = params.id;

	if (!id) throw error(StatusCodes.BAD_REQUEST)

	const chart = await prisma.chart.findUnique({
		where: {
			id
		}
	});
	if (!chart) throw error(StatusCodes.NOT_FOUND);

	const posts = getChartPosts(id, 5);

	return { chart, posts };
};


export const actions: Actions = {
	delete_post: async ({ request, locals }) => {



		const data = await request.formData();
		const id = data.get('post_id')

		if (!id || typeof id != "string") throw error(StatusCodes.BAD_REQUEST)

		const post = await prisma.post.findUnique({
			where: { id },
			include: {
				"chart": true
			}
		})

		const user = locals.user;

		if (post?.chart?.user_id != user?.id) throw error(StatusCodes.UNAUTHORIZED);

		await prisma.post.delete({
			where: { id }
		})
	},
	post: async ({ request, locals, params }) => {
		const data = await request.formData()
		const content = data.get('text'),
			timeString = data.get('time_code'),
			timeEnabled = data.get('include_time') == 'on',
			reply_to = data.get("reply_to")

		if (!content || typeof content != 'string') throw error(StatusCodes.BAD_REQUEST, "No Post Content")
		if (timeEnabled && (!timeString || typeof timeString != 'string')) throw error(StatusCodes.BAD_REQUEST, "Time code enabled but no time provided")
		if (reply_to != null && typeof reply_to != 'string') throw error(StatusCodes.BAD_REQUEST, "If you specify a parent, it must be a string")

		const user = locals.user;
		if (!user) throw error(StatusCodes.UNAUTHORIZED)

		const post = await prisma.post.create({
			data: {
				content,
				"author": {
					"connect": {
						"id": user.id
					}
				},
				"chart": {
					"connect": {
						"id": params.id
					}
				},
				"date_posted": new Date(),
			}
		})

		if (reply_to) {
			await prisma.postReplies.upsert({
				where: {
					"parent_id": reply_to
				},
				create: {
					"parent": {
						"connect": {
							"id": reply_to
						}
					},
					"replies": {
						"connect": {
							"id": post.id
						}
					}
				},
				"update": {
					"replies": {
						"connect": {
							"id": post.id
						}
					}
				}
			})
		}

		return post;
	}
}

const getChartPosts = async (id: string, replyLevels: number) => {
	type Include = {
		author: true,
		replies: true | {
			include: {
				replies: {
					include: Include
				}
			}
		}
	}

	const include: Include = {
		author: true,
		replies: true,
	}
	let currentLayer = include;
	for (let i = 1; i < replyLevels; i++) {
		currentLayer.replies = {
			include: {
				replies: {
					include: {
						replies: true,
						author: true
					}
				},
			}
		}
		currentLayer = currentLayer.replies.include.replies.include
	}

	return await prisma.post.findMany({
		where: {
			"chart_id": id,
			"reply_to_id": null
		},
		include,
		"orderBy": {
			"date_posted": 'desc'
		}
	})
}