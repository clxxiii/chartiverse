<script lang="ts">
	import ThemePreview from '$lib/components/ThemePreview.svelte';
	import { DevicePhoneMobile, Icon, PaintBrush, User } from 'svelte-hero-icons';

	export let data;

	type Payload = {
		username?: string;
	};

	let settingsPage = 'User';

	let msAfterInput = 1500;
	let timeout: NodeJS.Timer;
	let typing = false;

	let username = data?.user?.username ?? '';

	const keydown = () => {
		clearTimeout(timeout);
		typing = true;
		timeout = setTimeout(typingEnd, msAfterInput);
	};

	const typingEnd = async () => {
		if (!data.user) return;

		typing = false;
		const payload: Payload = {};

		if (data?.user?.username != username) {
			payload['username'] = username;
			data.user.username = username;
		}
		await save(payload);
	};

	const save = async (payload: { [key: string]: string }) => {
		await fetch('?/save', {
			method: 'POST',
			body: JSON.stringify(payload)
		});
	};
</script>

<svelte:head>
	<title>{settingsPage} Settings | Chartiverse</title>
</svelte:head>

<div class="page">
	<div class="sidebar">
		<h1>Settings</h1>
		<hr />
		<button on:click={() => (settingsPage = 'User')}>
			<span class="icon">
				<Icon src={User} width="25" />
			</span>
			<span class="label">Account</span>
		</button>
		<button on:click={() => (settingsPage = 'Appearance')}>
			<span class="icon">
				<Icon src={PaintBrush} width="25" />
			</span>

			<span class="label">Appearance</span>
		</button>
		<button on:click={() => (settingsPage = 'Devices')}>
			<span class="icon">
				<Icon src={DevicePhoneMobile} width="25" />
			</span>

			<span class="label">Devices</span>
		</button>
	</div>
	<div class="content">
		{#if settingsPage == 'User'}
			<h1>User Settings</h1>
			<label for="display-name">Display Name</label>
			<input on:keydown={keydown} bind:value={username} name="display-name" type="text" />
		{:else if settingsPage == 'Appearance'}
			<h1>Appearance Settings</h1>
			<div class="themes">
				<h2>Side-wide Theme</h2>
				<div class="flex">
					<div class="catpuccin-mocha">
						<ThemePreview name="Catpuccin Mocha" id="catppuccin-mocha" />
					</div>
					<div class="catpuccin-frappe">
						<ThemePreview name="Catpuccin Frappe" id="catppuccin-frappe" />
					</div>
					<div class="amoled">
						<ThemePreview name="Amoled" id="amoled" />
					</div>
				</div>
			</div>
		{:else if settingsPage == 'Devices'}
			<h1>Device Settings</h1>
		{/if}
	</div>
</div>

<style>
	.page {
		max-width: 1100px;
		min-height: calc(100vh - 40px - 10px); /* height - header - padding */
		margin: auto;
		display: grid;
		grid-template-columns: 250px calc(100% - 250px);
	}
	.flex {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		justify-content: center;
	}
	.sidebar button {
		display: grid;
		grid-template-columns: 30px calc(100% - 30px);
		gap: 5px;
		margin: 5px 0px;
		align-items: center;
		width: 100%;
		background: 0;
		border: 0;
		font-family: 'Poppins';
		border-radius: 10px;
		color: var(--text);
		transition: background-color 150ms ease;
		cursor: pointer;
	}
	.sidebar button:hover {
		background: var(--bg500);
	}
	.sidebar .label {
		text-align: left;
		transition: 150ms ease;
	}
	.sidebar button:hover .label {
		transform: translateX(10px);
	}
	.sidebar button .icon {
		width: 30px;
		height: 30px;
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
	h1 {
		margin: 0;
	}
	.sidebar {
		background: var(--bg600);
		padding: 10px;
	}
	.content h1 {
		font-size: 3.5em;
	}
	.content {
		padding: 10px;
		background: var(--bg500);
	}
</style>
