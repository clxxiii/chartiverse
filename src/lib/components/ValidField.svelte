<script lang="ts">
	export let error: boolean | undefined = true;
</script>

{#if error == undefined || error}
	<div class="error">
		<span class="material-symbols-outlined"> adjust </span>
		<span class="text"><slot /></span>
	</div>
{:else}
	<div class="fulfilled">
		<span class="material-symbols-outlined"> done </span>
		<span class="text"><slot /></span>
	</div>
{/if}

<style>
	.error,
	.fulfilled {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 12px;
	}
	.material-symbols-outlined {
		font-size: 12px;
		font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
	}
	.fulfilled .material-symbols-outlined {
		color: var(--success);
	}
</style>
