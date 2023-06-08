<script lang="ts">
	import type { User } from '@prisma/client';
	import Profile from './Profile.svelte';
	import { PUBLIC_UPLOAD_ENABLED_USERS } from '$env/static/public';

	export let user: User | null;

	let uploadEnabled = true;
	const allowedUploadUsers = JSON.parse(PUBLIC_UPLOAD_ENABLED_USERS);
	if (!user) uploadEnabled = false;
	if (allowedUploadUsers.length > 0 && user && !allowedUploadUsers.includes(user.id)) {
		console.log('a');
		uploadEnabled = false;
	}
</script>

<header class="header">
	<div class="title">Chartiverse</div>
	<nav>
		<a href="/">charts</a>
	</nav>
	<div class="profile">
		{#if uploadEnabled}
			<a href="/upload" class="upload">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
					/>
				</svg>
			</a>
		{/if}
		<Profile {user} />
	</div>
</header>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0px 10px;
		height: 50px;
		background-color: var(--ctp-mocha-mantle);
	}
	.upload {
		width: 30px;
		height: 30px;
		margin-right: 1rem;
		display: grid;
		place-items: center;
	}
	.upload svg {
		color: var(--ctp-mocha-text);
		width: 20px;
		height: 20px;
	}
	.profile {
		display: flex;
		align-items: center;
	}
</style>
