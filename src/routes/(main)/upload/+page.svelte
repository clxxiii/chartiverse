<script lang="ts">
	import { StatusCodes } from '$lib/StatusCodes';
	import ChartCard from '$lib/components/ChartCard.svelte';
	import UploadButton from '$lib/components/UploadButton.svelte';
	import Spinner from '$lib/assets/spinner.svg';
	import { ondrop, onupload } from '$lib/zip';
	import { redirect } from '@sveltejs/kit';
	import axios from 'axios';
	import { fade } from 'svelte/transition';

	let upload: UploadButton;

	let uploading = true;
	let loaded = false;
	let loading = false;

	let chart: { [key: string]: string };
	let file: File;
	const filedrop = async (e: CustomEvent) => {
		if (e.detail.files.accepted.length < 1) {
			const file = e.detail.files.rejected[0];
			upload.error(file.error.name);

			return;
		}
		loading = true;
		file = e.detail.files.accepted[0];
		const chartData = await ondrop(file);
		if (chartData.error) {
			upload.error(chartData.error);
		}
		if (chartData.info) {
			chartData.info.album_url = chartData.album_url;
			chart = chartData.info;
			loading = false;
			uploading = false;
			loaded = true;
		}
	};

	const uploadChart = async () => {
		const chartReq = await fetch('/api/upload', {
			method: 'POST',
			body: JSON.stringify(chart)
		});
		const chartInfo = await chartReq.json();
		const files = await onupload(file);

		await axios({
			url: `/api/upload_files?id=${chartInfo.id}`,
			method: 'PUT',
			data: JSON.stringify(files),
			onUploadProgress: (p) => {
				console.log(p);
			}
		});
		redirect(StatusCodes.TEMPORARY_REDIRECT, `/charts/${chartInfo.id}`);
	};
</script>

<div class="page">
	{#if loading}
		<div class="dark" transition:fade>
			<img src={Spinner} alt="" />
		</div>
	{/if}
	{#if uploading}
		<UploadButton bind:this={upload} on:filedrop={filedrop} />
	{/if}
	{#if loaded}
		<ChartCard {chart} />
		<div on:click={uploadChart} on:keydown={uploadChart}>Upload</div>
	{/if}
</div>

<style>
	.page {
		height: calc(100vh - 50px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.dark {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: grid;
		place-items: center;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(5px);
		z-index: 10;
	}
	.dark img {
		width: 6rem;
		height: 6rem;
	}
</style>
