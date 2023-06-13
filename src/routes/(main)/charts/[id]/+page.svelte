<script lang="ts">
	export let data;
	const { id, name, artist, charter, user_id, album_url, song_url, chart_url } = data.chart;
</script>

<svelte:head>
	<title>
		{artist} - {name} by {charter} | Chartiverse
	</title>
</svelte:head>

<div class="container">
	<div class="metadata">
		<img class="album" src={album_url} alt="" />
		<div class="info">
			<div class="title">{name}</div>
			<div class="artist">{artist}</div>
			<div class="charter">
				Charted by
				<a href="/charters/{user_id}">
					{charter}
				</a>
			</div>
		</div>
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
		background-color: var(--bg600);
	}
	.metadata {
		background-color: var(--bg500);
		font-family: 'Quicksand';
		height: 200px;
		display: flex;
		gap: 5px;
	}
	img.album {
		width: 200px;
		height: 200px;
		grid-row: 1/4;
		grid-column: 1/2;
	}
	.title {
		font-size: 2em;
		font-weight: 800;
	}
	.artist {
		font-size: 1.5em;
		font-weight: 600;
	}
	.charter {
		margin-top: 1.5em;
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
