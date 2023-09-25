<script lang="ts">
	import CreatePost from '$lib/components/CreatePost.svelte';
	import DownloadButton from '$lib/components/DownloadButton.svelte';
	import Post from '$lib/components/Post.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { id, name, artist, charter, user_id, album_url } = data.chart;

	const chartOwner = data.user?.id == data.chart.user_id;
</script>

<svelte:head>
	<title>
		{artist} - {name} by {charter} | Chartiverse
	</title>

	<meta property="twitter:card" content="summary" />
	<meta property="og:title" content="{artist} - {name}" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="A chart by {charter}, published to Chartiverse" />
	<meta property="og:url" content="https://charts.clxxiii.dev/charts/{id}" />
	<meta property="og:image" content={album_url} />
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
		<div class="download">
			<DownloadButton {id} width={60} bg="var(--bg400)" />
		</div>
	</div>
	<div class="main-content">
		<iframe class="preview" frameborder="0" src="/preview/{id}" title="Chart Preview" />
	</div>
	<div class="posts">
		<h2>Posts</h2>
		{#if data.user}
			<CreatePost />
		{/if}
		<div class="post-list">
			{#each data.posts as post}
				<!-- I'm not willing to go through the type gymnastics that are required to get this error to go away. -->
				<Post repliable={data.user != null} deletable={chartOwner} {post} chart={data.chart} />
			{/each}
		</div>
	</div>
</div>

<style>
	.container {
		position: relative;
		height: 100%;
		max-width: 1000px;
		width: 98%;
		margin: auto;
		margin-top: 3rem;
		background-color: var(--bg600);
	}
	.metadata {
		position: relative;
		background-color: var(--bg500);
		font-family: 'Quicksand';
		height: 200px;
		display: flex;
		gap: 5px;
	}
	.post-list {
		display: flex;
		margin-top: 20px;
		flex-direction: column;
		gap: 10px;
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
	.main-content {
		padding: 10px;
	}
	iframe.preview {
		background-color: var(--bg500);
		width: 80%;
		aspect-ratio: calc(16 / 9);
	}
	.download {
		position: absolute;
		bottom: 10px;
		right: 10px;
	}
	.posts {
		background-color: var(--bg500);
		padding: 20px;
	}
	.posts h2 {
		margin: 0;
	}

	@media screen and (max-width: 600px) {
		.metadata {
			height: 75px;
			align-items: stretch;
		}
		img.album {
			width: 75px;
			height: 75px;
		}
		.title {
			font-size: 1em;
		}
		.artist {
			font-size: 1em;
		}
		.charter {
			font-size: 0.75em;
			margin-top: 0;
		}
		iframe {
			width: 100%;
		}
	}
</style>
