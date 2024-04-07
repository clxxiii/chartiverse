<script lang="ts">
	import type { Drive as DriveData } from '@prisma/client';
	export let drive: DriveData;

	import AutoSaveTextInput from '$lib/components/AutoSaveTextInput.svelte';

	const onsave = async (value: string) => {
		if (value == '') {
			return 'must specify an ID';
		}

		const body = new FormData();
		body.set('id', value);
		const response = await fetch(`/settings?/change-drive-id`, {
			method: 'POST',
			body
		});

		if (response.status != 200) {
			const { error } = await response.json();
			return error.message;
		}
		drive = await response.json();
	};

	const onsync = async () => {
		const response = await fetch(`/settings?/sync-drive`, {
			method: 'POST',
			body: new FormData()
		});

		if (response.status != 200) {
			const { error } = await response.json();
			return error.message;
		}
	};
</script>

<h1>Google Drive Sync</h1>
Synchronize your existing Google Drive with all of your charts in it to Chartiverse. Add a recurring
sync to set it & forget it, or sync once to leave Google Drive all together!

<h2>Settings</h2>
<AutoSaveTextInput
	label="Google Drive Folder ID"
	{onsave}
	value={drive.drive_id}
	autosaveTime={1000}
	width={310}
	placeholder="1qkX1t-2DFng7F_xKvVoXQPX0AO5oOrH3"
/>

<!-- <button on:click={onsync}>SYNC</button> -->

<style>
	h2 {
		margin: 5px 0px;
		color: var(--link-color);
		text-transform: uppercase;
		letter-spacing: -0.3px;
		font-size: 18px;
	}
	button {
		border: 0;
		font-weight: bold;
		font-family: 'Quicksand', sans-serif;
		cursor: pointer;
		color: var(--bg400);
		background-color: var(--highlight);
		width: 100px;
		height: 40px;
		font-size: 1.5em;
		margin-top: 1rem;
		display: grid;
		place-items: center;
		transition: background-color 200ms ease;
		border-radius: 5px;
	}
	button:hover {
		color: var(--link-color);
		background-color: var(--bg400);
	}
</style>
