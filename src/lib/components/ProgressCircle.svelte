<script lang="ts">
	import { onMount } from 'svelte';
	export let progress = 0;
	export let width = 50;
	export let lineWidth = 5;
	export let startPos = -(Math.PI / 2);
	export let radius = 20;
	export let rounded = false;

	let color: string;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	const setProgress = (p: number) => {
		if (!ctx) return;
		ctx.clearRect(0, 0, width, width);

		if (progress <= 0) return;

		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		rounded && (ctx.lineCap = 'round');

		ctx.beginPath();
		ctx.arc(width / 2, width / 2, radius, startPos, startPos + 2 * Math.PI * p);
		ctx.stroke();
	};

	$: setProgress(progress);

	onMount(() => {
		color = getComputedStyle(canvas).getPropertyValue('color');

		ctx = canvas.getContext('2d');

		canvas.width = width;
		canvas.height = width;
		setProgress(progress);
	});
</script>

<canvas bind:this={canvas} />
