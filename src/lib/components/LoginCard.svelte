<script lang="ts">
	import { browser } from '$app/environment';
	import OauthButton from './OauthButton.svelte';

	let href = new URLSearchParams();

	if (browser) href.set('from', window.location.pathname);

	let border = 'var(--text)';
	let user: string, password: string;
	let loggingIn = false;
	const login = async () => {
		loggingIn = true;
		border = 'var(--text)';
		const data = new FormData();
		data.set('username', user);
		data.set('password', password);
		const loginReq = await fetch(`/login`, {
			method: 'POST',
			body: data
		});
		if (loginReq.ok) {
			loggingIn = false;
			browser && window.location.reload();
		} else {
			loggingIn = false;
			border = 'var(--error)';
		}
	};
</script>

<div class="login">
	<h2>Login</h2>
	<div class="bg" />
	<div class="top">
		<div class="form" style="--border: {border}">
			<input type="text" bind:value={user} placeholder="Username" name="username" id="username" />
			<input
				type="password"
				bind:value={password}
				placeholder="Password"
				name="password"
				id="password"
			/>
			<input disabled={loggingIn} on:click={login} type="submit" value="Login" />
		</div>
		<div class="line" />
		<div class="oauth-options">
			<OauthButton
				color="#a970ff"
				simpleicon="twitch"
				href="/auth/login/twitch?{href.toString()}"
				width={30}
				height={30}
			/>
			<OauthButton
				color="#5865F2"
				simpleicon="discord"
				href="/auth/login/discord?{href.toString()}"
				width={30}
				height={30}
			/>
		</div>
	</div>
	<div class="flex">
		<a href="/register">Make an account</a>
	</div>
</div>

<style>
	h2 {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 10px;
		margin-bottom: 10px;
	}
	.login {
		backdrop-filter: blur(3px);
		border-radius: 5px;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
		width: fit-content;
		padding: 15px;
		z-index: 11;
	}
	.top {
		display: flex;
		gap: 5px;
	}
	a {
		margin-top: 10px;
		font-size: 12px;
	}

	.bg {
		position: absolute;
		inset: 0;
		opacity: 0.5;
		border-radius: 5px;
		border: 1px solid var(--bg600);
		background-color: var(--bg500);
		z-index: -1;
	}
	.form {
		width: fit-content;
		display: flex;
		flex-direction: column;
		margin: 10px 5px 10px 0px;
		align-items: flex-end;
	}
	.line {
		margin: 0px;
		border: solid 1px var(--bg500);
	}
	.oauth-options {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.flex {
		display: flex;
		justify-content: center;
	}
	input[type='text'],
	input[type='password'] {
		color: var(--text);
		display: block;
		outline: none;
		font-family: 'Quicksand';
		border: solid 2px var(--border);
		transition: border-color 200ms ease;
		border-radius: 6px;
		margin-top: 5px;
		padding: 5px;
		width: 250px;
		font-size: 14px;
		font-weight: 600;
		background-color: var(--bg400);
	}
	input[type='text']:focus,
	input[type='password']:focus {
		border: solid 2px var(--highlight);
	}

	input[type='submit'] {
		border: 0;
		background-color: var(--highlight);
		color: var(--bg400);
		cursor: pointer;
		width: 100px;
		padding: 0px 10px;
		margin-top: 10px;
		transition: 200ms ease;
		font-family: 'Poppins', sans-serif;
		font-weight: 600;
		border-radius: 6px;
		font-size: 16px;
	}
	input[type='submit']:disabled {
		cursor: default;
		opacity: 0.75;
		background-color: var(--bg400);
		color: var(--bg500);
	}
</style>
