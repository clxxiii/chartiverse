<script lang="ts">
	import {
		validatePassword,
		type PasswordValidation,
		type UsernameValidation,
		validateUsername
	} from '$lib/auth';
	import OauthButton from '$lib/components/OauthButton.svelte';
	import ValidField from '$lib/components/ValidField.svelte';

	let password: string;
	let username: string;

	let validity: PasswordValidation;
	$: validity = validatePassword(password);

	let usernameValidity: UsernameValidation;
	$: usernameValidity = validateUsername(username);
</script>

<svelte:head>
	<title>Register an account | Chartiverse</title>
</svelte:head>

<div class="register">
	<h2>Make an Account</h2>
	<div class="options">
		<div class="basic">
			<form method="POST">
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
					<input type="text" bind:value={username} name="username" id="username" />
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
					{#if validity.success && usernameValidity}
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
			<OauthButton simpleicon="discord" color="#5865F2" href="/auth/login/twitch">
				Sign up with Discord
			</OauthButton>
		</div>
	</div>
</div>

<style>
	.register {
		width: fit-content;
		margin: auto;
		padding: 10px;
		background-color: var(--bg500);
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
