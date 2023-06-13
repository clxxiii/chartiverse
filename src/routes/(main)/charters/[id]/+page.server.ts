import { StatusCodes } from '$lib/StatusCodes';
import { prisma } from '$lib/prisma';
import { error, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ params }) => {
	const id = params.id;

	const charter = await prisma.user.findUnique({
		where: {
			id
		},
		include: {
			_count: true,
			charts: {
				
				take: 30,
				orderBy: {
					date_added: 'desc'
				}
			}
		}
	});
	console.log(charter)

	if (!charter) {
		throw error(StatusCodes.NOT_FOUND, 'Charter not found');
	}

	return { charter };
};
