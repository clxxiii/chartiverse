<script lang="ts">
	export let data;
	const { id, name, artist, charter, user_id, album_url, song_url, chart_url } = data.chart;
</script>

<svelte:head>
	<title>
		{artist} - {name} by {charter}
	</title>
</svelte:head>

<div class="container">
	<div class="metadata">
		<img class="album" src={album_url} alt="" />
		<div class="title">{name}</div>
		<div class="artist">{artist}</div>
		<div class="charter">{charter}</div>
	</div>
	<iframe frameborder="0" src="/preview/{id}" title="Chart Preview" />
</div>

<style>
	.container {
		max-width: 1000px;
		width: 98%;
		height: fit-content;
		margin: auto;
		margin-top: 3rem;
		background-color: var(--ctp-mocha-surface2);
	}
	.metadata {
		background-color: var(--ctp-mocha-surface1);
		height: fit-content;
		display: grid;
		grid-template-columns: 200px 5px calc(100% - 205px);
		grid-template-rows: 33% 33% 33%;
	}
	img.album {
		width: 200px;
		height: 200px;
		grid-row: 1/4;
		grid-column: 1/2;
	}
	.title,
	.artist,
	.charter {
		grid-column: 3/4;
	}
	iframe {
		margin: 10px;
		width: 80%;
		aspect-ratio: calc(16 / 9);
	}
</style>
