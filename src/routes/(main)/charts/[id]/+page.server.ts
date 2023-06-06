import { StatusCodes } from '$lib/StatusCodes';
import { prisma } from '$lib/prisma';
import { error, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ params }) => {
	const id = params.id;

	const chart = await prisma.chart.findUnique({
		where: {
			id
		}
	});
	if (!chart) throw error(StatusCodes.NOT_FOUND);

	return { chart };
};
