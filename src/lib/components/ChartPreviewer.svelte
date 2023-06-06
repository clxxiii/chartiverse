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
		if (playButton.textContent == 'Play') {
			previewer.play();
			playButton.textContent = 'Pause';
		} else {
			previewer.pause();
			playButton.textContent = 'Play';
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
		const mousePosition = (seekbarHeight - event.clientY) / seekbarHeight;
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
	<button class="play" bind:this={playButton} on:click={playPause}>Play</button>
	<div
		class="seekbar"
		bind:offsetHeight={seekbarHeight}
		on:mousemove={seek}
		on:mousedown={seekMouseDown}
		on:mouseup={seekMouseUp}
	>
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
		width: 3rem;
	}
	.seekbar .bar {
		height: 100%;
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
