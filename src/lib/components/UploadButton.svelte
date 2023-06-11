<script lang="ts">
	import type { FileDropOptions } from 'filedrop-svelte';
	import FileDrop from 'filedrop-svelte';
	import { createEventDispatcher } from 'svelte';

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
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
			/>
		</svg>

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
	svg {
		width: 3rem;
		height: 3rem;
		margin-bottom: 1rem;
		pointer-events: none;
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
