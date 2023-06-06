<script>
	import '../../catpuccin.css';
	import '../../app.css';

	import Header from '$lib/components/Header.svelte';
	export let data;
</script>

<Header user={data.user} />
<main>
	<slot />
</main>

<style>
	main {
		min-height: calc(100vh - 50px);
	}
</style>
