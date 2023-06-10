<script lang="ts">
	import type { Chart } from '@prisma/client';

	export let chart: Chart | { [key: string]: string };

	let card: HTMLDivElement;
	export let link = false;

	const { id, name, artist, charter, album_url } = chart;

	let hover = false;
	let playing = false;
	const preview = () => {};
</script>

<div class="card" bind:this={card}>
	{#if link}
		<a class="chart-page" href="/charts/{id}">this text is invisible</a>
		<a href="/download/{id}" class="download">
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
	{/if}
	<div class="album">
		{#if hover}
			<div class="preview">
				{#if playing}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-6 h-6"
					>
						<path
							fill-rule="evenodd"
							d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
							clip-rule="evenodd"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-6 h-6"
					>
						<path
							fill-rule="evenodd"
							d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
							clip-rule="evenodd"
						/>
					</svg>
				{/if}
			</div>
		{/if}
		<img class="album" src={album_url} alt="" />
	</div>
	<div class="title">{name}</div>
	<div class="artist">{artist}</div>
	<div class="charter">
		Charted by {charter}
	</div>
</div>

<style>
	.chart-page {
		position: absolute;
		color: transparent;
		z-index: 1;
		width: 100%;
		height: 100%;
	}
	.card {
		position: relative;
		display: grid;
		grid-template-columns: 80px 5px calc(100% - 75px);
		grid-template-rows: 1em 5px 1em 10px 1em;
		transform-style: preserve-3d;
		padding: 10px;
		height: 80px;
		width: 300px;
		background-color: var(--ctp-mocha-surface2);
		font-family: Quicksand;
		font-size: 12px;
		font-weight: 500;
		transition: scale 200ms ease;
		z-index: 0;
	}
	.download svg {
		width: 15px;
		height: 15px;
		transition: all 200ms ease;
		color: var(--ctp-mocha-text);
	}

	.card .album {
		position: relative;
		width: calc(100px - 2 * 10px);
		height: calc(100px - 2 * 10px);
	}
	.download {
		position: absolute;
		display: grid;
		place-items: center;
		appearance: none;
		background-color: var(--ctp-mocha-surface1);
		transition: all 200ms ease;
		border: none;
		padding: 5px;
		border-radius: 5px;
		bottom: 5px;
		right: 5px;
		width: 30px;
		height: 15px;
		z-index: 2;
	}
	.download:hover {
		background-color: var(--ctp-mocha-sky);
	}
	.download:hover svg {
		color: var(--ctp-mocha-base);
	}
	.title,
	.artist,
	.charter {
		overflow: hidden;
		text-overflow: ellipsis;
		grid-column: 3 / 4;
	}
	.title {
		font-weight: 800;
	}
	.artist {
		grid-row: 3/4;
	}
	.charter {
		color: var(--ctp-mocha-lavender);
		grid-row: 5/6;
	}
	.preview {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0.5);
		backdrop-filter: blur(5px);
		z-index: 10;
	}
</style>
