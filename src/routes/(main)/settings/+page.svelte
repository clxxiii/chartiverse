<script lang="ts">
	export let data;

	let settingsPage = 'User';

	let msAfterInput = 1500;
	let timeout: NodeJS.Timer;
	let typing = false;

	let username = data?.user?.username ?? '';

	const keydown = () => {
		clearTimeout(timeout);
		if (!typing) {
		}
		typing = true;
		timeout = setTimeout(typingEnd, msAfterInput);
	};

	const typingEnd = async () => {
		typing = false;
		const payload: { [key: string]: string } = {};

		if (data?.user?.username != username) {
			payload['username'] = username;
		}
		await save(payload);
		data.user = { ...payload };
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
		<button on:click={() => (settingsPage = 'User')}>User Settings</button>
		<button on:click={() => (settingsPage = 'Appearance')}>Appearance</button>
		<button on:click={() => (settingsPage = 'Devices')}>Devices</button>
	</div>
	<div class="content">
		{#if settingsPage == 'User'}
			<h1>User Settings</h1>
			<input on:keydown={keydown} bind:value={username} type="text" name="" id="" />
		{:else if settingsPage == 'Appearance'}
			<h1>Appearance Settings</h1>
			<button>Choose Appearance</button>
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
