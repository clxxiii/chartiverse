<script lang="ts">
	import type { FileDropOptions } from 'filedrop-svelte';
	import FileDrop from 'filedrop-svelte';
	import { createEventDispatcher } from 'svelte';
	import { ArrowUpTray, Icon } from 'svelte-hero-icons';

	const dispatch = createEventDispatcher();

	let filedropClass: HTMLDivElement;
	let msg = 'Upload a .zip of your chart';

	const options: FileDropOptions = {
		accept: '.zip',
		multiple: false
	};
	const filedrop = (e: CustomEvent) => {
		dispatch('filedrop', e.detail);
	};
	const dragenter = () => (filedropClass.style.border = 'dashed 3px var(--highlight)');
	const dragleave = () => (filedropClass.style.border = 'dashed 3px var(--bg100)');

	export const error = (message: string) => {
		filedropClass.style.border = 'dashed 3px var(--error)';
		msg = message;
	};
</script>

<FileDrop {...options} on:filedrop={filedrop}>
	<div class="filedrop" on:dragleave={dragleave} on:dragenter={dragenter} bind:this={filedropClass}>
		<Icon src={ArrowUpTray} width={48} />
		<div class="label">{msg}</div>
	</div>
</FileDrop>

<style>
	.filedrop {
		position: relative;
		width: 12rem;
		height: 12rem;
		display: grid;
		place-items: center;
		background-color: var(--bg200);
		border-radius: 25px;
		border: dashed 3px var(--bg100);
		color: var(--bg500);
		font-weight: bold;
		font-size: 12px;
		cursor: pointer;
		transition: border 200ms ease;
	}
	.label {
		position: absolute;
		bottom: 3rem;
		width: 100%;
		text-align: center;
		pointer-events: none;
	}
	.filedrop:hover {
		border: dashed 3px var(--bg500);
	}
	.filedrop:focus-visible {
		border: dashed 3px var(--highlight);
	}
</style>
