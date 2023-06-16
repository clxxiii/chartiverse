<script lang="ts">
	import type { User } from '@prisma/client';
	import Profile from './Profile.svelte';
	import { PUBLIC_UPLOAD_ENABLED_USERS } from '$env/static/public';
	import { ArrowUpTray, Icon } from 'svelte-hero-icons';

	export let user: User | null | undefined;

	let uploadEnabled = true;
	const allowedUploadUsers = JSON.parse(PUBLIC_UPLOAD_ENABLED_USERS);
	if (!user) uploadEnabled = false;
	if (allowedUploadUsers.length > 0 && user && !allowedUploadUsers.includes(user.id)) {
		uploadEnabled = false;
	}
</script>

<div class="header">
	<a class="icon" href="/">
		<img src="/favicon-32x32.png" alt="" />
		<div class="title">Chartiverse</div>
	</a>
	<div class="profile">
		{#if uploadEnabled}
			<a href="/upload" class="upload">
				<Icon src={ArrowUpTray} width="20" />
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
	.icon {
		display: flex;
		align-items: center;
		color: var(--text);
		text-decoration: none;
		gap: 7px;
	}
	.icon img {
		width: 25px;
	}
	.upload:hover {
		color: var(--bg400);
		background-color: var(--highlight);
	}
	.profile {
		display: flex;
		align-items: center;
	}
	@media screen and (max-width: 600px) {
		.icon .title {
			display: none;
		}
	}
</style>
