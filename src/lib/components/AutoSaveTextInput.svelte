<script lang="ts">
	import Spinner from '$lib/assets/spinner.svg';

	export let label: string;
	export let name: string = 'input';
	export let value: string = '';
	export let placeholder: string = '';
	export let autosaveTime: number = 500;
	export let width: number = 210;
	export let onsave: (
		value: string
	) => void | string | Promise<void> | Promise<string> | Promise<string | void>;

	let typing = false;
	let success: boolean | null;
	let errorMsg: string | void;

	let timeout: NodeJS.Timer;

	const keydown = () => {
		clearTimeout(timeout);
		typing = true;
		success = null;
		timeout = setTimeout(onTypingEnd, autosaveTime);
	};
	const onTypingEnd = async () => {
		typing = false;
		errorMsg = await onsave(value);
		if (errorMsg) {
			success = false;
		} else {
			success = true;
		}
	};
</script>

<div class="element" style="--width: {width}px">
	<label for={name}>{label}</label>
	<input on:keydown={keydown} bind:value {placeholder} {name} type="text" />
	<div class="status">
		{#if typing}
			<img src={Spinner} alt="spinner" />
		{:else if success}
			<span class="material-symbols-outlined check">check</span>
		{:else if !success && success != null}
			<span class="material-symbols-outlined close">close</span>
			<span class="close">{errorMsg}</span>
		{/if}
	</div>
</div>

<style>
	.element {
		display: flex;
		align-items: center;
		gap: 5px;
	}
	.status {
		display: flex;
		align-items: center;
		height: 100%;
	}
	input[type='text'] {
		color: var(--text);
		outline: none;
		font-family: 'Quicksand';
		border: solid 2px var(--text);
		border-radius: 6px;
		width: var(--width);
		padding: 5px;
		font-size: 16px;
		font-weight: 600;
		background-color: var(--bg400);
	}
	input[type='text']:focus {
		border: solid 2px var(--highlight);
	}
	.material-symbols-outlined {
		font-size: 24px;
		font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
	}
	.check {
		color: var(--success);
	}
	.close {
		color: var(--error);
	}
	.status img {
		width: 24px;
		height: 24px;
	}
</style>
