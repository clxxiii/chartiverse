<script lang="ts">
	import { browser } from '$app/environment';

	export let id = 'default';
	export let name = 'Default';

	let currentTheme: string | null;
	if (browser) {
		currentTheme = document.documentElement.getAttribute('data-theme');
	}

	const setTheme = async () => {
		await fetch(`/settings?/change-theme`, {
			method: 'POST',
			body: JSON.stringify({
				id
			})
		});

		if (browser) document.documentElement.setAttribute('data-theme', id);
	};
</script>

<button on:click={setTheme} class="box">
	{#if currentTheme == id}
		<div class="border" />
	{/if}
	<div class="samples">
		<div class="sample highlight" />
		<div class="sample link" />
		<div class="sample error" />
		<div class="sample warning" />
		<div class="sample success" />
	</div>
	<div class="label">{name}</div>
</button>

<style>
	.box {
		position: relative;
		width: 150px;
		height: 75px;
		border: 0;
		font-family: 'Poppins';
		color: var(--text);
		font-size: 12px;
		overflow: hidden;
		background-color: var(--bg400);
		border-radius: 10px;
		box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
		cursor: pointer;
	}
	.label {
		position: absolute;
		bottom: 0;
		left: 0;
		text-align: center;
		background-color: var(--bg500);
		width: 100%;
		height: 25%;
	}
	.samples {
		display: flex;
		gap: 5px;
		width: 100%;
		height: 75%;
		align-items: center;
		justify-content: center;
	}
	.sample {
		width: 20px;
		height: 20px;
		border-radius: 200px;
	}
	.highlight {
		background-color: var(--highlight);
	}
	.link {
		background-color: var(--link-color);
	}
	.error {
		background-color: var(--error);
	}
	.warning {
		background-color: var(--warning);
	}
	.success {
		background-color: var(--success);
	}
</style>
