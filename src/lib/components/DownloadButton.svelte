<script lang="ts">
	import { Icon, ArrowDownTray } from 'svelte-hero-icons';

	export let width = 30;
	export let id: string;
	export let bg = 'var(--bg500)';
</script>

<a href="/download/{id}" class="download" style="width: {width}px; --bgcolor: {bg}">
	<Icon src={ArrowDownTray} width="15" />
</a>

<style>
	.download {
		display: grid;
		place-items: center;
		appearance: none;
		background-color: var(--bgcolor);
		transition: all 200ms ease;
		border: none;
		padding: 5px;
		border-radius: 5px;
		aspect-ratio: 2;
		z-index: 2;
	}
	.download:hover {
		background-color: var(--highlight);
	}

	.download {
		width: 15px;
		height: 15px;
		transition: all 200ms ease;
		color: var(--text);
	}
	.download:hover {
		color: var(--bg400);
	}
</style>
