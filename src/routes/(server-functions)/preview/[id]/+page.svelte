<script lang="ts">
	import { parse } from '$lib/ChartParser';
	import ChartPreviewer from '$lib/components/ChartPreviewer.svelte';
	import { onMount } from 'svelte';

	export let data;
	const { chart } = data;

	let chartFile: ChartFile.Chart;
	let mounted = false;

	onMount(async () => {
		const chartReq = await fetch(chart.chart_url);
		const chartText = await chartReq.text();
		chartFile = parse(chartText);

		mounted = true;
	});
</script>

{#if mounted}
	<ChartPreviewer chart={chartFile} audioPath={chart.song_url} />
{/if}
