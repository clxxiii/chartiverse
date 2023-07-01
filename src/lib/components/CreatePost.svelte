<script lang="ts">
	export let time: number = 0;

	const ms = Math.round(time % 1000);
	const seconds = Math.round(time / 1000) % 60;
	const minutes = Math.round(time / 1000 / 60);
	const timeString = `${minutes}:${seconds > 10 ? seconds : '0' + seconds}`;

	const oninput = (event: KeyboardEvent) => {
		if (!event.target) return;
		const target: HTMLTextAreaElement = <HTMLTextAreaElement>event.target;
		target.style.height = '0';
		const scrollHeight = target.scrollHeight < 52 ? 52 : target.scrollHeight;
		target.style.height = scrollHeight + 'px';
	};
</script>

<div class="create">
	<form action="?/post" method="POST">
		<input type="hidden" name="time_code" value={time} />
		<div class="input">
			<textarea placeholder="Share your thoughts" on:keydown={oninput} name="text" id="text" />
		</div>
		<div class="bottom">
			<div class="time">
				<input class="material-symbols-outlined" type="checkbox" name="include_time" id="" />
				<label for="include_time">Post comment with time code: {timeString}</label>
			</div>
			<input type="submit" value="Post" />
		</div>
	</form>
</div>

<style>
	.create {
		width: 100%;
	}
	.input {
		padding-top: 15px;
		padding-bottom: 10px;
	}
	textarea {
		display: block;
		font-size: 18px;
		height: 48px;
		font-family: 'QuickSand', sans-serif;
		font-weight: 500;
		background-color: var(--bg400);
		border: solid 4px var(--text);
		color: var(--text);
		width: 97%;
		outline: none;
		border-radius: 6px;
		padding: 10px;
		margin: auto;
		resize: none;
	}
	textarea:focus {
		border-color: var(--highlight);
	}
	input[type='submit'] {
		appearance: none;
		border: none;
		background-color: var(--highlight);
		color: var(--bg400);
		font-family: 'Quicksand', sans-serif;
		font-weight: 800;
		width: 100px;
		height: 36px;
		border-radius: 6px;
		font-size: 24px;
	}
	input[type='checkbox'] {
		position: relative;
		appearance: none;
		width: 36px;
		height: 36px;
		border-radius: 6px;
		transition: background-color 100ms ease;
		border: solid 4px var(--highlight);
		cursor: pointer;
	}
	input[type='checkbox']:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}
	input[type='checkbox']:checked {
		background-color: var(--highlight);
	}
	input[type='checkbox']::after {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		transition: opacity 100ms ease;
		display: flex;
		color: var(--bg400);
		align-items: center;
		font-size: 32px;
		justify-content: center;
		content: 'check';
		opacity: 0;
		font-variation-settings: 'FILL' 0, 'wght' 800, 'GRAD' 0, 'opsz' 48;
	}

	input[type='checkbox']:checked::after {
		opacity: 1;
	}

	.time {
		display: flex;
		gap: 3px;
		align-items: center;
	}
	.time label {
		font-size: 18px;
	}
	.bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	/* https://www.w3schools.com/howto/howto_css_placeholder.asp */
	::placeholder {
		/* Chrome, Firefox, Opera, Safari 10.1+ */
		color: var(--bg600);
		opacity: 1; /* Firefox */
	}

	:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: var(--bg600);
	}

	::-ms-input-placeholder {
		/* Microsoft Edge */
		color: var(--bg600);
	}
</style>
