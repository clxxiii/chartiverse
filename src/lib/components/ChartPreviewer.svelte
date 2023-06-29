<script lang="ts">
	import ChartPreviewer, { speedFactorMS } from '$lib/ChartPreviewerCanvas';
	import { onMount } from 'svelte';
	import { Icon, Pause, Play, SpeakerWave, SpeakerXMark } from 'svelte-hero-icons';
	import Highway from '$lib/assets/highway.png';
	import Background from '$lib/assets/background.png';

	export let chart: ChartFile.Chart;
	export let audioPath: string;
	export let backgroundUrl: string | null = null;
	export let highwayUrl = Highway;

	let height: number;
	let width: number;

	const scrollMultiplier = 20;

	let canvas: HTMLCanvasElement;
	let previewer: ChartPreviewer;
	let sections: ChartFile.Event[] = [];

	let volume = 75;
	$: previewer && (previewer.audio.volume = volume / 100);

	const playPause = () => {
		if (previewer.playing) {
			previewer.pause();
			previewer.playing = false;
		} else {
			previewer.play();
			previewer.playing = true;
		}
	};

	let percentage: number;
	let seekClicked = false;
	let seekbarHeight = 0;
	let highwayPos = 0;
	let ms = 0;
	let seconds = 0;
	let minutes = 0;

	const frameCallback = (num: number) => {
		let frame = Math.round(num * previewer.length);
		ms = frame % 1000;
		seconds = Math.floor(frame / 1000) % 60;
		minutes = Math.floor(frame / 1000 / 60);
		highwayPos = (frame / (speedFactorMS * 1.1)) * 100;
		percentage = num;
	};

	const seek = (event: MouseEvent) => {
		if (!seekClicked) return;

		let mousePosition = (seekbarHeight - event.offsetY) / seekbarHeight;
		percentage = mousePosition;
		previewer.seek(percentage);
	};
	const seekMouseDown = (event: MouseEvent) => {
		seekClicked = true;
		seek(event);
	};
	const seekMouseUp = (event: MouseEvent) => {
		seekClicked = false;
		seek(event);
	};

	const scroll = (event: WheelEvent) => {
		if (previewer.playing) return;

		const direction = -(event.deltaY / 100);

		const frame = previewer.frame + direction * scrollMultiplier;
		const percentage = frame / previewer.length;
		previewer.seek(percentage);
	};

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (ctx == null) return;
		previewer = new ChartPreviewer(ctx, chart, audioPath, height - 10);
		previewer.setFrameCallback(frameCallback);
		sections = chart.events.filter((x) => (x.type = 'section'));
	});
</script>

<div class="previewer" on:mousewheel={scroll} bind:clientHeight={height} bind:clientWidth={width}>
	{#if backgroundUrl}
		<img class="background" src={backgroundUrl} alt="background" />
	{:else}
		<img class="background" src={Background} alt="background" />
	{/if}
	<div class="highway-wrapper">
		<div class="highway">
			<canvas bind:this={canvas} />
			<div
				class="image"
				style="background-image: url({highwayUrl}); background-position-y: {highwayPos}%"
			/>
		</div>
	</div>
	<div class="top">
		<button class="play" on:click={playPause}>
			{#if previewer?.playing}
				<Icon src={Pause} solid />
			{:else}
				<Icon src={Play} solid />
			{/if}
		</button>

		<div class="volume-wrapper">
			{#if volume > 0}
				<Icon src={SpeakerWave} solid width={20} />
			{:else}
				<Icon src={SpeakerXMark} solid width={20} />
			{/if}
			<input
				type="range"
				style="--value: {volume}%"
				bind:value={volume}
				min="0"
				max="100"
				class="volume"
			/>
		</div>
		<div class="time">
			{minutes >= 10 ? minutes : '0' + minutes}:{seconds >= 10 ? seconds : '0' + seconds}.{ms < 100
				? ms < 10
					? '00' + ms
					: '0' + ms
				: ms}
		</div>
	</div>
	<div
		class="seekbar"
		bind:offsetHeight={seekbarHeight}
		on:mousemove={seek}
		on:mousedown={seekMouseDown}
		on:mouseup={seekMouseUp}
	>
		<div class="percentage">
			{#if percentage}
				{Math.round(percentage * 100)}%
			{:else}
				0%
			{/if}
		</div>
		<!-- {#each sections as section}
			<div class="section">{section.value}</div>
		{/each} -->
		<div class="bar" style="transform: translateY(-{percentage * 100}%)" />
	</div>
</div>

<style>
	.play {
		width: 2rem;
		height: 2rem;
		background: transparent;
		border: 0;
		color: #fff;
		cursor: pointer;
	}
	.background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}
	.seekbar {
		position: absolute;
		top: 3rem;
		right: 1rem;
		bottom: 1rem;
		background-color: #fff9;
		width: 4rem;
	}
	.top {
		position: absolute;
		top: 0;
		left: 0;
		height: 2rem;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.75);
	}
	.seekbar .bar {
		height: 100%;
		pointer-events: none;
		border-bottom: solid 3px rgb(255, 255, 255);
	}
	.previewer {
		position: absolute;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		/* background-color: #000; */
	}
	.time {
		position: absolute;
		top: 0;
		right: 0.5rem;
		height: 100%;
		display: flex;
		align-items: center;
		color: white;
		font-family: 'Fira Code';
	}
	.percentage {
		position: absolute;
		top: 0;
		right: 0;
		color: white;
		font-size: bold;
		text-shadow: 0px 3px 5px rgba(0, 0, 0, 0.5);
		font-family: 'Poppins';
		font-size: 1.5rem;
		pointer-events: none;
		user-select: none;
		width: 100%;
		text-align: center;
	}
	.highway .image {
		position: absolute;
		top: 0;
		left: 0;
		transform: translateY(-0%);
		background-repeat: repeat-y;
		background-size: 100% 50%;
		width: 100%;
		height: 200%;
		z-index: -1;
	}
	.highway {
		position: relative;
		height: 100vh;
		overflow: hidden;
		transform-origin: 50% 100%;
		border-left: solid 3px white;
		border-right: solid 3px white;
		box-shadow: 300px 0px 10px rgba(0, 0, 0, 1);
		transform-style: preserve-3d;
		mask-image: linear-gradient(180deg, #0000 0%, #fff 10%);
		-webkit-mask-image: linear-gradient(180deg, #0000 0%, #fff 10%);
		transform: matrix3d(1, 0, 0, 0, 0, 1, 0, -0.002, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	.highway-wrapper {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
	}
	.volume-wrapper {
		position: absolute;
		height: 100%;
		display: grid;
		grid-template-columns: 2rem 5rem;
		place-items: center;
		color: white;
		align-items: center;
		top: 0;
		right: 6.5rem;
	}
	.volume {
		-webkit-appearance: none;
		position: relative;
		appearance: none;
		margin: 0;
		border-radius: 20px;
		overflow: hidden;
		width: 100%;
		height: 10px;
		background-color: rgba(255, 255, 255, 0.5);
	}
	.volume::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: var(--value);
		background-color: #fff;
		height: 100%;
	}
	.volume::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 5px;
		height: 100%;
		background: white;
	}
</style>
