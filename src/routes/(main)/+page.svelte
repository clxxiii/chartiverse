<script lang="ts">
	import ChartCard from '$lib/components/ChartCard.svelte';
	// import Searchbar from '$lib/components/Searchbar.svelte';
	import type { Chart as ChartType } from '@prisma/client';

	export let data: { charts: ChartType[] };

	let charts = data.charts;

	let chartlist: HTMLDivElement;

	// const searchstart = () => {
	// 	chartlist.style.opacity = '0.8';
	// };
	// const searchend = () => {
	// 	chartlist.style.opacity = '1';
	// };
</script>

<div class="charts">
	<!-- <Searchbar on:searchstart={searchstart} on:searchend={searchend} /> -->
	<div bind:this={chartlist} class="chart-list">
		{#each charts as chart}
			<ChartCard link {chart} />
		{/each}
	</div>
</div>

<style>
	.chart-list {
		display: flex;
		padding: 10px;
		justify-content: center;
		gap: 15px;
		flex-wrap: wrap;
	}
	.charts {
		width: 100%;
		max-width: 1100px;
		margin: auto;
		background-color: var(--ctp-mocha-surface1);
	}
</style>
