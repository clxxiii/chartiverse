<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>
		{$page.error?.message}
	</title>
</svelte:head>

<h1>{$page.status}</h1>

<style>
	h1 {
		margin: 0;
		width: 100%;
		text-align: center;
		font-size: 50vh;
		color: var(--ctp-mocha-mantle);
	}
</style>
