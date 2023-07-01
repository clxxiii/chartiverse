<script>
	import ThemePreview from '$lib/components/ThemePreview.svelte';
</script>

<h1>Appearance Settings</h1>
<div class="themes">
	<h2>Side-wide Theme</h2>
	<div class="flex">
		<div class="catpuccin-mocha">
			<ThemePreview name="Catpuccin Mocha" id="catppuccin-mocha" />
		</div>
		<div class="catpuccin-frappe">
			<ThemePreview name="Catpuccin Frappe" id="catppuccin-frappe" />
		</div>
		<div class="amoled">
			<ThemePreview name="Amoled" id="amoled" />
		</div>
	</div>
</div>

<style>
	.flex {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		justify-content: center;
	}
</style>
