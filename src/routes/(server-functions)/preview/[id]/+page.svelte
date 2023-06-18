<script lang="ts">
	import { parse } from '$lib/ChartParser';
	import ChartPreviewer from '$lib/components/ChartPreviewer.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Background from '$lib/assets/preview-load-bg.png';

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
	<div class="loading" transition:fade={{ duration: 200 }}>
		<h2>Loading Preview</h2>
		<img src={Background} alt="" />
	</div>
{/if}

<style>
	.loading {
		position: absolute;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}
	.loading h2 {
		background-color: rgba(0, 0, 0, 0.75);
		padding: 10px;
		font-size: 36px;
		font-family: 'Fira Code';
		color: white;
		z-index: 2;
	}
	.loading img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		filter: blur(5px);
	}
</style>
