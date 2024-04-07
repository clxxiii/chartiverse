<script lang="ts">
	import { Cloud, Icon, PaintBrush, User } from 'svelte-hero-icons';
	import Account from './Account.svelte';
	import Appearance from './Appearance.svelte';
	import Drive from './Drive.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let settingsPage = 'User';

	const save = async (payload: FormData) => {
		await fetch('?/save', {
			method: 'POST',
			body: payload
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
		<button on:click={() => (settingsPage = 'Drive')}>
			<span class="icon">
				<Icon src={Cloud} width="25" />
			</span>

			<span class="label">Google Drive Sync</span>
		</button>
	</div>
	<div class="content">
		{#if settingsPage == 'User' && data.user}
			<Account user={data.user} {save} keys={data.keys} />
		{:else if settingsPage == 'Appearance'}
			<Appearance />
		{:else if settingsPage == 'Drive'}
			<Drive drive={data.drives[0]} />
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
	h1 {
		margin: 0;
	}
	.sidebar {
		background: var(--bg600);
		padding: 10px;
	}
	.content {
		padding: 10px;
		background: var(--bg500);
	}
</style>
