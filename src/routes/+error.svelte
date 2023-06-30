<script lang="ts">
	import '../app.css';
	import '../catpuccin.css';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>
		{$page.error?.message}
	</title>
	<style>
		body {
			font-family: Poppins;
			margin: 0;
			background-color: var(--bg400);
			color: var(--text);
		}

		a {
			color: var(--link-color);
		}
	</style>
</svelte:head>

<h1>{$page.status}</h1>
{#if $page.status == 404}
	<p>
		If you clicked on a link and arrived here, reminder that this site is still giga in progress!
		Come back a little later and you might find something!
	</p>
{/if}

<style>
	h1 {
		margin: 0;
		width: 100%;
		text-align: center;
		font-size: 50vh;
		color: var(--bg200);
	}
	p {
		text-align: center;
	}
</style>
