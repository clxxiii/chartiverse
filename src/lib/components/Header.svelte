<script lang="ts">
	import type { User } from '@prisma/client';
	import Profile from './Profile.svelte';
	import { PUBLIC_UPLOAD_ENABLED_USERS } from '$env/static/public';

	export let user: User | null | undefined;

	let uploadEnabled = true;
	const allowedUploadUsers = JSON.parse(PUBLIC_UPLOAD_ENABLED_USERS);
	if (!user) uploadEnabled = false;
	if (allowedUploadUsers.length > 0 && user && !allowedUploadUsers.includes(user.id)) {
		uploadEnabled = false;
	}
</script>

<div class="header">
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
</div>

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0px 10px;
		height: 100%;
		background-color: var(--bg200);
	}
	.upload {
		width: 50px;
		height: 30px;
		margin-right: 1rem;
		display: grid;
		place-items: center;
		background-color: var(--bg500);
		transition: background-color 200ms ease;
		border-radius: 5px;
	}
	.upload:hover {
		background-color: var(--highlight);
	}
	.upload:hover svg {
		color: var(--bg400);
	}
	.upload svg {
		color: var(--text);
		width: 20px;
		transition: color 200ms ease;
		height: 20px;
	}
	.profile {
		display: flex;
		align-items: center;
	}
</style>
