<script lang="ts">
	import ChartCard from '$lib/components/ChartCard.svelte';
	import type { Chart as ChartType } from '@prisma/client';

	export let data: { charts: ChartType[] };

	type AudioPreview = {
		reset: () => void;
		play: () => void;
		pause: () => void;
		init: () => void;
		song_url: string;
		preview_start_time: number;
		audio: HTMLAudioElement;
		playing: boolean;
	};

	let charts = data.charts;
	let currentSongPreview: AudioPreview;

	let previewFunction = (preview: AudioPreview) => {
		if (currentSongPreview?.song_url == preview.song_url) {
			preview.playing ? preview.pause() : preview.play();
			preview.playing = !preview.playing;
			return;
		}

		if (currentSongPreview) currentSongPreview.reset();
		preview.init();
		preview.play();
		currentSongPreview = preview;
	};
</script>

<svelte:head>
	<title>Chart Listing | Chartiverse</title>
</svelte:head>

<div class="charts">
	<div class="chart-list">
		{#each charts as chart}
			<ChartCard link {chart} {previewFunction} />
		{/each}
	</div>
</div>

<style>
	.chart-list {
		display: flex;
		padding: 10px;
		justify-content: center;
		gap: 15px;
		flex-wrap: wrap;
	}
	.charts {
		width: 100%;
		max-width: 1100px;
		min-height: calc(100vh - 50px);
		margin: auto;
		background-color: var(--bg500);
	}
</style>
