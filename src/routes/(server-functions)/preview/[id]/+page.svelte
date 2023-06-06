<script lang="ts">
	import { PUBLIC_CDN_ENDPOINT } from '$env/static/public';
	import { parse } from '$lib/ChartParser';
	import ChartPreviewer from '$lib/components/ChartPreviewer.svelte';
	import { onMount } from 'svelte';

	export let data;
	const { chart } = data;

	const audioPath = `${PUBLIC_CDN_ENDPOINT}/${chart.id}/song.ogg`;

	let chartFile: ChartFile.Chart;
	let mounted = false;

	onMount(async () => {
		const chartReq = await fetch(`${PUBLIC_CDN_ENDPOINT}/${chart.id}/notes.chart`);
		const chartText = await chartReq.text();
		chartFile = parse(chartText);

		mounted = true;
	});
</script>

{#if mounted}
	<ChartPreviewer chart={chartFile} {audioPath} />
{/if}
