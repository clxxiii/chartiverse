import { prisma } from '$lib/prisma';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async () => {
	const charts = prisma.chart.findMany();
	return { charts };
};
