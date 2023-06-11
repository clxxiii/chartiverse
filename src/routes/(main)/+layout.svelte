<script>
	import '../../catpuccin.css';
	import '../../app.css';

	import Header from '$lib/components/Header.svelte';
	export let data;
</script>

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
	}
</style>
