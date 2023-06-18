<script>
	import '../../catpuccin.css';
	import '../../app.css';

	import Header from '$lib/components/Header.svelte';
	export let data;
</script>

<svelte:head>
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

<header>
	<Header user={data.user} />
</header>
<main>
	<slot />
</main>

<style>
	main {
		margin-top: 50px;
		min-height: calc(100vh - 50px);
	}
	header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 50px;
		z-index: 2;
	}
</style>
