<script lang="ts">
	export let width = 30;
	export let id: string;
	export let bg = 'var(--bg500)';
</script>

<a href="/download/{id}" class="download" style="width: {width}px; --bgcolor: {bg}">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="w-6 h-6"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
		/>
	</svg>
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

	.download svg {
		width: 15px;
		height: 15px;
		transition: all 200ms ease;
		color: var(--text);
	}
	.download:hover svg {
		color: var(--bg400);
	}
</style>
