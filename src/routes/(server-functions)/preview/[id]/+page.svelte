<script lang="ts">
	import { parse } from '$lib/ChartParser';
	import ChartPreviewer from '$lib/components/ChartPreviewer.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

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
	<div class="canvas" transition:fade={{ duration: 200 }}>
		<ChartPreviewer
			chart={chartFile}
			audioPath={chart.song_url}
			backgroundUrl={chart.background_url}
		/>
	</div>
{:else}
	<h2>Loading Preview...</h2>
{/if}

<style>
</style>
