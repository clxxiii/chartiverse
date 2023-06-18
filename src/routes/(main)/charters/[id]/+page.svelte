<script lang="ts">
	import ChartCard from '$lib/components/ChartCard.svelte';
	import type { Chart, User } from '@prisma/client';

	export let data: {
		user?: undefined;
		charter: User & {
			charts: Chart[];
			_count: { [key: string]: number };
		};
	};
	const charter = data.charter;

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

	let currentSongPreview: AudioPreview;

	const previewFunction = (preview: AudioPreview) => {
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
	<title>{charter.username} | Chartiverse</title>

	<meta property="twitter:card" content="summary" />
	<meta property="og:title" content="{charter.username}'s Charts" />
	<meta property="og:type" content="website" />
	<meta
		property="og:description"
		content="The charter profile for{charter.username}, all on Chartiverse"
	/>
	<meta property="og:url" content="https://charts.clxxiii.dev/charters/{charter.id}" />
	<meta property="og:image" content={charter.avatar_url} />
</svelte:head>

<div class="page">
	<div class="sidebar">
		<div class="profile">
			<img class="pic" src={charter.avatar_url} alt="profile" />
			<div class="name">
				{charter.username}
			</div>
		</div>
		<hr />
		<div class="total">Total Charts Posted: {charter._count.charts}</div>
	</div>
	<div class="chart-list">
		<h1>{charter.username}'s Charts</h1>
		<div class="charts">
			{#each charter.charts as chart}
				<ChartCard {chart} {previewFunction} link />
			{/each}
		</div>
	</div>
</div>

<style>
	.page {
		max-width: 1100px;
		min-height: calc(100vh - 40px - 10px); /* height - header - padding */
		margin: auto;
		display: grid;
		grid-template-columns: 400px calc(100% - 400px);
	}
	.sidebar {
		padding: 10px;
		background-color: var(--bg600);
	}
	.profile {
		display: flex;
		gap: 5px;
		align-items: center;
	}
	.profile .name {
		font-size: 24px;
	}
	.profile .pic {
		width: 75px;
		height: 75px;
	}
	.charts {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 15px;
	}
	.chart-list {
		padding: 10px;
		background-color: var(--bg500);
	}
	@media screen and (max-width: 1100px) {
		.page {
			grid-template-columns: 200px calc(100% - 200px);
		}
	}
	@media screen and (max-width: 600px) {
		.page {
			grid-template-columns: 100%;
		}
		.sidebar {
			grid-row: 1/2;
		}
		.chart-list {
			grid-row: 2/3;
		}
	}
</style>
