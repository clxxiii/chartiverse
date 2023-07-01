<script lang="ts">
	import {
		validatePassword,
		type PasswordValidation,
		type UsernameValidation,
		validateUsername
	} from '$lib/auth';
	import OauthButton from './OauthButton.svelte';
	import Spinner from '$lib/assets/spinner.svg';
	import ValidField from './ValidField.svelte';

	let password: string;
	let username: string;

	let validity: PasswordValidation;
	$: validity = validatePassword(password);

	let usernameValidity: UsernameValidation;
	$: usernameValidity = validateUsername(username);

	let usernameAvailable = false;
	let checkingUsername = false;
	let usernameCheckInterval: NodeJS.Timer;
	const typing = () => {
		usernameAvailable = false;
		checkingUsername = true;
		clearInterval(usernameCheckInterval);
		usernameCheckInterval = setTimeout(checkUsername, 1000);
	};
	const checkUsername = async () => {
		checkingUsername = false;
		if (username == '') return;
		const userCheckReq = await fetch(`/api/check_username?u=${username}`);
		const userCheck = await userCheckReq.json();
		usernameAvailable = !userCheck.taken;
	};
</script>

<div class="register">
	<div class="bg" />
	<h2>Make an Account</h2>
	<div class="options">
		<div class="basic">
			<form method="POST" action="/register">
				<div class="field">
					<label for="email">Email</label>
					<div class="subtitle">Your email is only used for password reset requests.</div>
					<input type="text" name="email" id="email" />
				</div>
				<div class="field">
					<label for="username">Username</label>
					<ValidField
						error={usernameValidity.errors?.too_short || usernameValidity.errors?.too_long}
					>
						Usernames are 2-24 characters long
					</ValidField>
					<ValidField error={usernameValidity.errors?.weird_characters}>
						Includes only letters, numbers, spaces, and basic symbols
					</ValidField>
					<div class="availability">
						{#if usernameAvailable}
							<span class="material-symbols-outlined check">check</span>
							<span>Username must be unique</span>
						{:else if checkingUsername}
							<img src={Spinner} alt="spinner" /> <span>Username must be unique</span>
						{:else if username == '' || username == undefined}
							<span class="material-symbols-outlined">adjust</span>
							<span>Username must be unique</span>
						{:else}
							<span class="material-symbols-outlined failed">close</span>
							<span class="failed">Username must be unique</span>
						{/if}
					</div>
					<input
						on:keydown={typing}
						type="text"
						bind:value={username}
						name="username"
						id="username"
					/>
				</div>

				<div class="field password">
					<label for="password">Password</label>
					<div class="pass-validation">
						<ValidField error={validity.errors?.length}>
							Password must be at least 8 characters long
						</ValidField>
						<ValidField error={validity.errors?.lowercase}>
							Password must contain Lowercase letters
						</ValidField>
						<ValidField error={validity.errors?.uppercase}>
							Password must contain Uppercase letters
						</ValidField>
						<ValidField error={validity.errors?.number}>Password must contain a number</ValidField>
					</div>
					<input type="password" bind:value={password} name="password" id="password" />
				</div>
				<div class="submit">
					{#if validity.success && usernameValidity && usernameAvailable}
						<input type="submit" value="Register" />
					{:else}
						<input disabled type="submit" value="Register" />
					{/if}
				</div>
			</form>
		</div>
		<div class="line" />
		<div class="oauth-providers">
			<OauthButton simpleicon="twitch" color="#a970ff" href="/auth/login/twitch">
				Sign up with Twitch
			</OauthButton>
			<OauthButton simpleicon="discord" color="#5865F2" href="/auth/login/discord">
				Sign up with Discord
			</OauthButton>
		</div>
	</div>
</div>

<style>
	.register {
		width: fit-content;
		margin: auto;
		backdrop-filter: blur(3px);
		border-radius: 5px;
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
		width: fit-content;
		padding: 15px;
		z-index: 11;
	}
	.material-symbols-outlined {
		font-size: 12px;
		font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
	}
	.failed {
		color: var(--error);
	}
	.check {
		color: var(--success);
	}
	.availability {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 12px;
	}
	.availability {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 12px;
	}
	.availability img {
		width: 12px;
		height: 12px;
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
	.subtitle {
		font-size: 12px;
	}
	.options {
		display: flex;
	}
	.basic,
	.oauth-providers {
		width: 350px;
	}
	.line {
		border-left: solid 2px var(--bg600);
	}
	label {
		font-size: 18px;
		font-weight: 600;
	}
	.password {
		margin-top: 20px;
		margin-bottom: 55px;
	}
	.oauth-providers {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	input[type='text'],
	input[type='password'] {
		color: var(--text);
		outline: none;
		font-family: 'Quicksand';
		border: solid 2px var(--text);
		border-radius: 6px;
		padding: 5px;
		width: 275px;
		font-size: 16px;
		font-weight: 600;
		background-color: var(--bg400);
	}
	input[type='text']:focus,
	input[type='password']:focus {
		border: solid 2px var(--highlight);
	}

	.submit {
		position: relative;
	}
	input[type='submit'] {
		position: absolute;
		bottom: 0;
		left: 0;
		border: 0;
		background-color: var(--highlight);
		color: var(--bg400);
		cursor: pointer;
		margin-top: 10px;
		padding: 5px 20px;
		font-family: 'Poppins', sans-serif;
		font-weight: 600;
		border-radius: 6px;
		font-size: 24px;
	}
	input[type='submit']:disabled {
		opacity: 0.75;
		background-color: var(--bg400);
		color: var(--bg500);
	}
</style>
