<script lang="ts">
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
	};
</script>

<h1>Google Drive Sync</h1>
Synchronize your existing Google Drive with all of your charts in it to Chartiverse. Add a recurring
sync to set it & forget it, or sync once to leave Google Drive all together!

<h2>Settings</h2>
<AutoSaveTextInput
	label="Google Drive Folder ID"
	{onsave}
	autosaveTime={1000}
	width={310}
	placeholder="1qkX1t-2DFng7F_xKvVoXQPX0AO5oOrH3"
/>

<style>
	h2 {
		margin: 5px 0px;
		color: var(--link-color);
		text-transform: uppercase;
		letter-spacing: -0.3px;
		font-size: 18px;
	}
</style>
