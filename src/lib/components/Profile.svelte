<script lang="ts">
	import type { User as UserType } from '@prisma/client';
	import { fly } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { Icon, User, XMark } from 'svelte-hero-icons';
	import LoginCard from './LoginCard.svelte';

	export let user: UserType | null = null;

	let menuOpen = false;
	const open = () => (menuOpen = true);
	const close = () => (menuOpen = false);
	const logout = () => browser && (window.location.href = '/auth/logout');

	let path = new URLSearchParams();
	if (browser) path.set('from', window.location.pathname);
</script>

{#if user}
	<div class="profile-button" on:click={open} on:keydown={open}>
		<img src={user.avatar_url} alt="" />
		<div class="label">{user.username}</div>
	</div>
	{#if menuOpen}
		<div
			class="menu"
			transition:fly={{
				y: -50,
				duration: 200
			}}
		>
			<div class="bg" />

			<a href="/charters/{user.id}" class="user">
				<img src={user.avatar_url} alt="" />
				<div class="label">{user.username}</div>
			</a>
			<div on:click={close} on:keydown={close} class="close">
				<Icon src={XMark} width="50" />
			</div>
			<hr />
			<nav>
				<a on:click={close} href="/charters/{user.id}">My Charts</a>
				<a on:click={close} href="/settings">Settings</a>
				<button on:click={logout} class="logout">Logout</button>
			</nav>
		</div>
		<button class="click-catcher" on:click={close} />
	{/if}
{:else}
	<a class="signup" href="/register?{path.toString()}">Sign Up</a>
	<div class="login" on:click={open} on:keydown={open}>Login</div>
	<div class="nouser" on:click={open} on:keydown={open}>
		<Icon src={User} width={30} />
	</div>
	{#if menuOpen}
		<div
			transition:fly={{
				y: -50,
				duration: 200
			}}
			class="login-card"
		>
			<LoginCard />
		</div>
		<button class="click-catcher" on:click={close} />
	{/if}
{/if}

<style>
	.login-card {
		position: absolute;
		top: 5px;
		right: 5px;
		z-index: 11;
	}
	.login,
	.signup {
		padding: 3px 10px;
		border-radius: 5px;
		text-transform: uppercase;
		background: var(--highlight);
		font-weight: 600;
		text-decoration: none;
		color: var(--bg400);
		cursor: pointer;
	}
	.signup {
		margin-right: 10px;
		background: var(--bg400);
		color: var(--highlight);
	}
	.nouser {
		display: grid;
		place-items: center;
		margin-left: 10px;
		cursor: pointer;
	}
	.profile-button {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 5px;
		height: 30px;
		padding: 5px;
		cursor: pointer;
		z-index: 10;
		border-radius: 5px;
		transition: background-color 200ms ease;
	}
	.profile-button:hover {
		background-color: var(--bg500);
	}
	.profile-button img {
		width: 30px;
		border-radius: 100%;
		height: 30px;
	}
	.menu hr {
		border: solid 0.5px var(--bg600);
	}

	.click-catcher {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		inset: 0;
		background-color: transparent;
		border: 0;
		outline: none;
		z-index: 10;
	}
	.menu {
		position: absolute;
		backdrop-filter: blur(3px);
		top: 5px;
		border-radius: 5px;
		right: 10px;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
		min-width: 200px;
		padding: 5px;
		z-index: 11;
	}
	.menu .bg {
		position: absolute;
		inset: 0;
		opacity: 0.5;
		border-radius: 5px;
		border: 1px solid var(--bg600);
		background-color: var(--bg500);
		z-index: -1;
	}
	.menu .close {
		position: absolute;
		top: 5px;
		right: 5px;
		width: 50px;
		height: 50px;
		transition: 200ms ease;
		border-radius: 5px;
		cursor: pointer;
	}
	.menu .close:hover {
		background-color: var(--bg600);
	}
	.menu .user {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-right: 50px;
		padding: 5px;
		cursor: pointer;
		border-radius: 5px;
		width: fit-content;

		color: var(--text);
		text-decoration: none;
		transition: 100ms ease;
	}
	.menu .user img {
		width: 40px;
		height: 40px;
		border-radius: 40px;
	}
	.menu .user:hover {
		background-color: var(--bg600);
	}
	.menu nav a,
	.menu .logout {
		color: var(--highlight);
		font-family: 'Quicksand';
		background: transparent;
		font-size: 16px;
		padding: 0;
		margin: 5px 0px;
		line-height: 1.5em;
		width: 100%;
		text-align: center;
		border-radius: 5px;
		border: 0;
		cursor: pointer;
		font-weight: 600;
		display: block;
		text-decoration: none;
		transition: 100ms ease;
	}
	.menu nav a:hover {
		background-color: var(--bg600);
	}

	.menu .logout {
		color: var(--error);
	}

	.menu .logout:hover {
		background-color: var(--error);
		color: var(--bg400);
	}
	@media screen and (max-width: 600px) {
		.label {
			display: none;
		}
	}
</style>
