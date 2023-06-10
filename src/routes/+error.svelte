<script lang="ts">
	import '../app.css';
	import '../catpuccin.css';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>
		{$page.error?.message}
	</title>
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
		color: var(--ctp-mocha-mantle);
	}
	p {
		text-align: center;
	}
</style>
