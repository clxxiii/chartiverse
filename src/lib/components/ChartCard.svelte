<script lang="ts">
	import type { Chart } from '@prisma/client';
	import { fade } from 'svelte/transition';
	import DownloadButton from './DownloadButton.svelte';
	import { Icon, Pause, Play } from 'svelte-hero-icons';

	export let chart: Chart;
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

	let card: HTMLDivElement;
	export let link = false;
	export let previewFunction: (arg0: AudioPreview) => void;

	const { id, name, artist, charter, album_url, song_url, preview_start_time, song_length } = chart;

	let hover = false;
	let playing = false;
	let audio: HTMLAudioElement;

	const seconds = Math.round(song_length / 1000) % 60;
	const minutes = Math.round(song_length / 1000 / 60);
	const time = `${minutes}:${seconds > 10 ? seconds : '0' + seconds}`;

	const mouseenter = () => {
		hover = true;
	};
	const mouseleave = () => {
		if (!playing) hover = false;
	};
	const resetPreview = () => {
		pause();
		hover = false;
		audio.currentTime = preview_start_time / 1000;
	};
	const init = () => {
		if (!audio) audio = new Audio(song_url);
		audio.volume = 0.3;
		audio.currentTime = preview_start_time / 1000;
	};
	const play = () => {
		audio.play();
		playing = true;
	};
	const pause = () => {
		audio.pause();
		playing = false;
	};
	const preview = () => {
		previewFunction({
			reset: resetPreview,
			play,
			pause,
			init,
			song_url,
			preview_start_time,
			audio,
			playing
		});
	};
</script>

<div class="card" bind:this={card} on:mouseenter={mouseenter} on:mouseleave={mouseleave}>
	{#if link}
		<a on:click={pause} class="chart-page" href="/charts/{id}">{artist} - {name}</a>
		<div class="download">
			<DownloadButton {id} />
		</div>
	{/if}
	<div class="album" style="background-image: url({album_url})">
		{#if hover && link}
			<div class="preview" in:fade={{ duration: 100 }} on:click={preview} on:keydown={preview}>
				{#if playing}
					<Icon src={Pause} solid width="30" />
				{:else}
					<Icon src={Play} solid width="30" />
				{/if}
			</div>
		{/if}
	</div>
	<!-- <div class="length">
		{time}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height="48"
			viewBox="0 -960 960 960"
			width="48"
			stroke="currentColor"
			fill="currentColor"
			><path
				d="M480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760v280L289-280q37 39 87 59.5T480-200Zm.033 125.978q-83.468 0-157.541-31.878-74.073-31.879-129.393-87.199-55.32-55.32-87.199-129.36-31.878-74.04-31.878-157.508 0-84.468 31.878-158.541 31.879-74.073 87.161-128.906 55.283-54.832 129.341-86.818 74.057-31.986 157.545-31.986 84.488 0 158.589 31.968 74.102 31.967 128.916 86.768 54.815 54.801 86.79 128.883Q886.218-564.516 886.218-480q0 83.501-31.986 157.57-31.986 74.069-86.818 129.36-54.833 55.291-128.873 87.17-74.04 31.878-158.508 31.878Zm-.033-68.13q141.043 0 239.446-98.752Q817.848-339.656 817.848-480q0-141.043-98.402-239.446-98.403-98.402-239.566-98.402-140.163 0-238.945 98.402-98.783 98.403-98.783 239.566 0 140.163 98.752 238.945Q339.656-142.152 480-142.152ZM480-480Z"
			/></svg
		>
	</div> -->
	<div class="title">{name}</div>
	<div class="artist">{artist}</div>
	<div class="charter">
		Charted by {charter}
	</div>
</div>

<style>
	.chart-page {
		position: absolute;
		color: transparent;
		z-index: 0;
		width: 100%;
		height: 100%;
	}
	.card {
		position: relative;
		display: grid;
		grid-template-columns: 80px 5px calc(100% - 5px - 80px - 5px - 30px) 5px 45px;
		grid-template-rows: 1.25em 5px 1.25em 5px 1.25em;
		transform-style: preserve-3d;
		padding: 10px;
		height: 80px;
		width: 300px;
		background-color: var(--bg600);
		font-family: Quicksand;
		font-size: 12px;
		font-weight: 500;
		transition: scale 200ms ease;
		z-index: 0;
	}

	.card .album {
		position: relative;
		background-size: cover;
		z-index: 1;
		width: calc(100px - 2 * 10px);
		height: calc(100px - 2 * 10px);
	}
	.download {
		position: absolute;
		bottom: 5px;
		right: 5px;
		z-index: 2;
	}
	.title,
	.artist,
	.charter {
		overflow: hidden;
		text-overflow: ellipsis;
		grid-column: 3 / 4;
	}
	.title {
		font-weight: 800;
	}
	.artist {
		grid-row: 3/4;
	}
	.charter {
		color: var(--link-color);
		grid-row: 5/6;
	}
	.preview {
		position: relative;
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(2px);
		z-index: 2;
		cursor: pointer;
	}
	/* .length {
		grid-row: 1/2;
		grid-column: 5/6;
	}
	.length svg {
		color: var(--text);
		width: 15px;
		height: 15px;
	} */
</style>
