<script lang="ts">
	export let color = '#FFFFFF';
	export let href: string;
	export let simpleicon = '';
	export let width = 300;
	export let height = 30;

	let url: string;
	if (simpleicon != '') {
		url = `https://cdn.simpleicons.org/${simpleicon}/FFFFFF`;
	}
</script>

<a {href} style="--color: {color}; --width: {width}px; --height: {height}px">
	<img src={url} alt="" />
	<span class="text">
		<slot />
	</span>
</a>

<style>
	a {
		display: block;
		position: relative;
		height: var(--height);
		width: var(--width);
		gap: 10px;
		text-decoration: none;
		padding: 5px;
		margin: 5px;
		color: white;
		transition: 150ms ease;
		border-radius: 6px;
		border: solid 2px rgba(0, 0, 0, 0);
		background-color: var(--color);
	}
	img {
		position: absolute;
		top: 5px;
		left: 5px;
		width: var(--height);
		height: var(--height);
	}
	a:hover {
		border: solid 2px var(--color);
		filter: drop-shadow(0 0 3px var(--color));
		background-color: rgba(0, 0, 0, 0);
	}
	.text {
		display: block;
		width: 100%;
		height: 100%;
		text-align: center;
		transform: translateY(2px);
	}
</style>
