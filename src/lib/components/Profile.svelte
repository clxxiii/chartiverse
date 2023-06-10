<script lang="ts">
	import type { User } from '@prisma/client';

	export let user: User | null = null;
</script>

{#if user}
	<div class="profile-button">
		<img src={user.avatar_url} alt="" />
		<div class="label">{user.username}</div>
	</div>
{:else}
	<a href="/auth/login/twitch">Login</a>
{/if}

<style>
	a {
		padding: 10px;
		text-transform: uppercase;
		background: rgb(26, 168, 69);
		color: var(--ctp-mocha-text);
	}
	.profile-button {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 5px;
		height: 30px;
		padding: 5px;
	}
	.profile-button:hover {
		background: var(--ctp-mocha-surface1);
	}
	.profile-button img {
		width: 30px;
		border-radius: 100%;
		height: 30px;
	}
</style>
