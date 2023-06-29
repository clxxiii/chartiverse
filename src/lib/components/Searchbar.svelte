<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let value: string;

	let timeout: NodeJS.Timeout;
	let msAfterInput = 1000;
	let searching = false;

	const dispatcher = createEventDispatcher();

	const keydown = () => {
		clearTimeout(timeout);
		if (!searching) {
			dispatcher('searchstart', { value });
		}
		searching = true;
		timeout = setTimeout(searchEnd, msAfterInput);
	};

	const searchEnd = () => {
		dispatcher('searchend', { value });
		searching = false;
	};
</script>

<div class="searchbar">
	<input bind:value on:keydown={keydown} type="text" />
</div>
