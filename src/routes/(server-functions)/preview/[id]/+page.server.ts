import { prisma } from '$lib/prisma';
import { error, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ params }) => {
	const chart = await prisma.chart.findUnique({
		where: {
			id: params.id
		}
	});

	if (!chart) throw error(404, 'Chart ID not found');

	return { chart };
};
