<script lang="ts">
	import type { User } from '@prisma/client';
	import Spinner from '$lib/assets/spinner.svg';
	import OauthButton from '$lib/components/OauthButton.svelte';
	import { browser } from '$app/environment';
	import Key from './Key.svelte';

	export let msAfterInput = 1000;
	export let save: (data: FormData) => Promise<void>;
	export let user: User;
	export let keys: { id: string; pretty_name: string }[];
	let timeout: NodeJS.Timer;

	let typing = false;
	let usernameChanged = false;

	let username = user?.username ?? '';

	let href = new URLSearchParams();
	href.set('user', user.id);
	if (browser) href.set('from', window.location.pathname);

	let removable: boolean = true;
	if (keys.length <= 1) removable = false;

	const keydown = () => {
		clearTimeout(timeout);
		typing = true;
		timeout = setTimeout(typingEnd, msAfterInput);
	};

	const typingEnd = async () => {
		if (!user) return;

		typing = false;
		const payload = new FormData();

		if (user?.username != username) {
			payload.set('username', username);
			user.username = username;
		}
		await save(payload);
		usernameChanged = true;
	};
</script>

<h1>User Settings</h1>
<section id="user-information">
	<h2>User Information</h2>
	<div class="change-display-name">
		<label for="display-name">Display Name</label>
		<input on:keydown={keydown} bind:value={username} name="display-name" type="text" />
		<div class="status">
			{#if typing}
				<img src={Spinner} alt="spinner" />
			{:else if usernameChanged}
				<span class="material-symbols-outlined check">check</span>
			{/if}
		</div>
	</div>
</section>

<section class="keys">
	<h2>Linked Accounts</h2>
	<div class="add">
		<span>Add new:</span>
		<OauthButton
			width={18}
			height={18}
			simpleicon="discord"
			color="#5865F2"
			href="/auth/login/discord?{href.toString()}"
		/>

		<OauthButton
			width={18}
			height={18}
			simpleicon="twitch"
			color="#a970ff"
			href="/auth/login/twitch?{href.toString()}"
		/>
	</div>

	{#each keys as { id, pretty_name }}
		<Key {id} {pretty_name} {removable} />
	{/each}
</section>

<!-- <section id="transfer">
	<h2>Transfer Account</h2>
	<span>
		In the event that you accidentally made two accounts, you can transfer all account data to
		another account
	</span>
	<div>
		<button class="generate-transfer">Generate Transfer Code</button>
		<button class="enter-transfer">Enter Transfer Code</button>
	</div>
</section> -->

<style>
	h2 {
		margin: 5px 0px;
		color: var(--link-color);
		text-transform: uppercase;
		letter-spacing: -0.3px;
		font-size: 18px;
	}
	.add {
		display: flex;
		align-items: center;
		margin-left: 10px;
		text-transform: uppercase;
		font-weight: 600;
	}
	section {
		margin-bottom: 24px;
	}
	.change-display-name {
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
	.status img {
		width: 24px;
		height: 24px;
	}
</style>
