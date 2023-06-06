<script lang="ts">
	import ChartCard from '$lib/components/ChartCard.svelte';
	import type { Chart as ChartType } from '@prisma/client';

	export let data: { charts: ChartType[] };
</script>

{#each data.charts as chart}
	<ChartCard link {chart} />
{/each}
