<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { Icon, Trash } from 'svelte-hero-icons';
	import { fade } from 'svelte/transition';

	export let id: string;
	export let pretty_name: string;
	export let removable: boolean = true;

	const provider = id.split(':')[0];

	let removalWarning = false;
	let key: HTMLSpanElement;
	let simpleicon: string;

	const warn = () => (removalWarning = true);
	const unwarn = () => (removalWarning = false);

	const remove = async () => {
		const removeReq = await fetch('/api/remove_key', {
			method: 'POST',
			body: JSON.stringify({
				id
			})
		});
		if (removeReq.ok && browser) window.location.reload();
	};

	simpleicon = `https://cdn.simpleicons.org/${provider}`;
	onMount(() => {
		// const colorValue = getComputedStyle(key).getPropertyValue('color');
		// const values = colorValue.match(/rgb\((\d+), (\d+), (\d+)\)/)?.slice(1, 4);
		// if (!values) return;
		// const [r, g, b] = values;
		// const color = `${parseInt(r).toString(16)}${parseInt(g).toString(16)}${parseInt(b).toString(
		// 	16
		// )}`;
	});
</script>

{#if provider != 'username'}
	<span bind:this={key} class="key">
		<img src={simpleicon} alt="icon" />
		<span class="name">{pretty_name}</span>
		{#if removable}
			<div on:click={warn} on:keydown={warn} class="remove">
				<Icon src={Trash} />
			</div>
		{/if}
	</span>
	{#if removalWarning}
		<div transition:fade={{ duration: 200 }} class="warning">
			<div on:click={unwarn} on:keydown={unwarn} class="dark" />
			<div class="card">
				<div class="bg" />
				<h3>REMOVE CONNECTION</h3>
				<span class="text"> You'll no longer be able to log in using this connection! </span>
				<span class="key">
					<img src={simpleicon} alt="icon" />
					<span class="name">{pretty_name}</span>
				</span>
				<button on:click={remove} class="y">I'm Sure</button>
				<button on:click={unwarn} class="n">Nevermind</button>
			</div>
		</div>
	{/if}
{/if}

<style>
	.key {
		position: relative;
		margin: 10px;
		padding: 5px;
		width: 300px;
		border-radius: 6px;
		background-color: var(--bg600);
		display: flex;
		align-items: center;
		gap: 5px;
		grid-column: 1/3;
	}
	img {
		width: 18px;
		height: 18px;
	}
	.remove {
		position: absolute;
		right: 10px;
		color: var(--error);
		width: 18px;
		height: 18px;
		cursor: pointer;
	}
	.warning {
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		z-index: 13;
	}
	.dark {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		z-index: 2;
	}
	.card {
		z-index: 3;
		display: grid;
		grid-template-rows: 10% 40% 50px calc(50% - 50px);
		grid-template-columns: 50% 50%;
		place-items: center;
		backdrop-filter: blur(3px);
		border-radius: 5px;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
		height: 200px;
		width: 320px;
		padding: 15px;
	}
	h3 {
		margin: 0;
		grid-column: 1/3;
	}
	.card .text {
		grid-column: 1/3;
		text-align: center;
	}
	.card button {
		width: 95%;
		height: 95%;
		border-radius: 6px;
		border: none;
		font-family: 'Quicksand', sans-serif;
		color: black;
		font-weight: 500;
		font-size: 24px;
		cursor: pointer;
	}
	button.y {
		background-color: var(--error);
	}
	button.n {
		background-color: var(--text);
	}
	.bg {
		position: absolute;
		inset: 0;
		opacity: 0.5;
		border-radius: 5px;
		border: 1px solid var(--bg600);
		background-color: var(--bg500);
		z-index: -1;
	}
</style>
