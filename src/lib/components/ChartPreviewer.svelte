<script lang="ts">
	import ChartPreviewer from '$lib/ChartPreviewerCanvas';
	import { onMount } from 'svelte';

	export let chart: ChartFile.Chart;
	export let audioPath: string;

	let height: number;
	let width: number;

	let canvas: HTMLCanvasElement;
	let playButton: HTMLButtonElement;
	let previewer: ChartPreviewer;
	let sections: ChartFile.Event[] = [];

	let volume = 75;
	$: previewer && (previewer.audio.volume = volume / 100);

	const playPause = () => {
		if (previewer.playing) {
			previewer.pause();
		} else {
			previewer.play();
		}
	};

	let percentage: number;
	let seekClicked = false;
	let seekbarHeight = 0;

	const frameCallback = (num: number) => {
		percentage = num;
	};

	const seek = (event: MouseEvent) => {
		if (!seekClicked) return;

		let mousePosition = (seekbarHeight - event.offsetY) / seekbarHeight;
		// I cannot explain why I need this, all I know is that it aligns the mouse pointer correctly
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

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (ctx == null) return;
		previewer = new ChartPreviewer(ctx, chart, audioPath, height - 4);
		previewer.setFrameCallback(frameCallback);
		sections = chart.events.filter((x) => (x.type = 'section'));
	});
</script>

<div class="previewer" bind:clientHeight={height} bind:clientWidth={width}>
	<div class="highway-wrapper">
		<canvas bind:this={canvas} />
	</div>
	<button class="play" bind:this={playButton} on:click={playPause}>
		{#if previewer?.playing}
			Pause
		{:else}
			Play
		{/if}
	</button>
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
	<input type="range" bind:value={volume} min="0" max="100" class="volume" />
</div>

<style>
	.play {
		position: absolute;
		top: 15px;
		left: 15px;
	}
	.seekbar {
		position: absolute;
		top: 1rem;
		right: 1rem;
		bottom: 1rem;
		background-color: #fff9;
		width: 4rem;
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
		background-color: #000;
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
	.highway-wrapper {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		/* background-color: #fff; */
	}
	.volume {
		position: absolute;
		top: 0;
	}
	canvas {
		transform-origin: 50% 100%;
		transform-style: preserve-3d;
		mask-image: linear-gradient(180deg, #0000 0%, #fff 10%);
		-webkit-mask-image: linear-gradient(180deg, #0000 0%, #fff 10%);
		transform: matrix3d(1, 0, 0, 0, 0, 1, 0, -0.002, 0, 0, 1, 0, 0, 0, 0, 1);
	}
</style>
