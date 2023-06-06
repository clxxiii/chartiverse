<script lang="ts">
	import type { Chart } from '@prisma/client';
	import Download from '$lib/assets/download.svg';

	export let chart: Chart | { [key: string]: string };

	// {
	// 	id: '',
	// 	name: 'Unknown Title',
	// 	artist: 'Unknown Artist',
	// 	charter: 'Unknown Charter',
	// 	album: 'Unknown Album',
	// 	genre: 'Unknown Genre',
	// 	year: '1920',
	// 	song_length: 0,
	// 	preview_start_time: 0,
	// 	loading_phrase: '0',
	// 	icon: '0',
	// 	modchart: 0,
	// 	album_track: 16000,
	// 	playlist_track: 16000,
	// 	diff_band: -1,
	// 	diff_guitar: -1,
	// 	diff_bass: -1,
	// 	diff_rhythm: -1,
	// 	diff_drums: -1,
	// 	diff_keys: -1,
	// 	diff_guitarghl: -1,
	// 	diff_bassghl: -1,
	// 	diff_rhythm_ghl: -1,
	// 	diff_drums_real: -1,
	// 	diff_guitar_coop_ghl: -1,
	// 	diff_guitar_coop: -1,
	// 	pro_drums: 0,
	// 	five_lane_drums: 0,
	// 	end_events: 0,
	// 	count: 0,
	// 	frets: 0
	// };
	let card: HTMLDivElement;
	export let link = false;

	const {
		id,
		name,
		artist,
		charter,
		album,
		genre,
		year,
		song_length,
		preview_start_time,
		loading_phrase,
		icon,
		modchart,
		album_track,
		playlist_track,
		diff_band,
		diff_guitar,
		diff_bass,
		diff_rhythm,
		diff_drums,
		diff_keys,
		diff_guitarghl,
		diff_bassghl,
		diff_rhythm_ghl,
		diff_drums_real,
		diff_guitar_coop_ghl,
		diff_guitar_coop,
		pro_drums,
		five_lane_drums,
		end_events,
		count,
		frets,
		album_url
	} = chart;
</script>

<div class="card" bind:this={card}>
	{#if link}
		<a class="chart-page" href="/charts/{id}">this text is invisible</a>
		<a href="/download/{id}" class="download">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="48"
				viewBox="0 -960 960 960"
				width="48"
				stroke="currentColor"
				><path
					d="m480-318.022-201.609-201.37 48.979-48.739 118.565 118.804v-367.652h68.13v367.652L632.63-568.131l48.979 48.739L480-318.022ZM148.282-148.521v-222.131h68.131v153.761h526.935v-153.761h68.131v222.131H148.282Z"
				/></svg
			>
		</a>
	{/if}
	<img class="album" src={album_url} alt="" />
	<div class="title">{name}</div>
	<div class="artist">{artist}</div>
	<div class="charter">Charted by {charter}</div>
</div>

<style>
	.chart-page {
		position: absolute;
		color: transparent;
		z-index: 1;
		width: 100%;
		height: 100%;
	}
	.card {
		position: relative;
		display: grid;
		grid-template-columns: 80px 5px calc(100% - 75px);
		grid-template-rows: 1em 5px 1em 10px 1em;
		transform-style: preserve-3d;
		padding: 10px;
		height: 80px;
		width: 300px;
		background-color: var(--ctp-mocha-surface1);
		font-family: Quicksand;
		font-size: 12px;
		font-weight: 500;
		transition: scale 200ms ease;
		z-index: 0;
	}
	.card .download svg {
		width: 15px;
		height: 15px;
		color: white;
	}

	.card .album {
		width: calc(100px - 2 * 10px);
		height: calc(100px - 2 * 10px);
	}
	.download {
		position: absolute;
		display: grid;
		place-items: center;
		appearance: none;
		border: none;
		bottom: 5px;
		right: 5px;
		width: 30px;
		height: 15px;
		z-index: 2;
	}
	.title,
	.artist,
	.charter {
		grid-column: 3 / 4;
	}
	.title {
		font-weight: 800;
	}
	.artist {
		grid-row: 3/4;
	}
	.charter {
		color: var(--ctp-mocha-lavender);
		grid-row: 5/6;
	}
</style>
