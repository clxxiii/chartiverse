<script lang="ts">
	import type { Chart, Post, User } from '@prisma/client';
	import moment from 'moment';
	import CreatePost from './CreatePost.svelte';
	import { Icon, ChatBubbleLeftEllipsis, XMark } from 'svelte-hero-icons';

	export let post: PostWithReplies & { author: User };
	export let chart: Chart;

	let replyBoxOpen = false;
	const showReplyBox = () => (replyBoxOpen = !replyBoxOpen);

	type PostWithReplies = Post & { replies: { replies: Post } };
	const dateString = moment(post?.date_posted).fromNow();
</script>

{#if post}
	<article>
		<div class="top">
			<a href="/charters/{post.author.id}" class="user">
				<img src={post.author.avatar_url} alt="pfp" />
				<div class="name-badges">
					{post.author.username}

					<div class="badges">
						{#if post.author.id == chart.user_id}
							<div class="badge charter">CHARTER</div>
						{/if}
					</div>
				</div>
			</a>
		</div>
		<div class="message">
			{post.content}
		</div>
		<div class="date">{dateString}</div>

		{#if !post.reply_to_id}
			<button on:click={showReplyBox} class="reply-button">
				{#if replyBoxOpen}
					<Icon src={XMark} />
				{:else}
					<Icon src={ChatBubbleLeftEllipsis} />
				{/if}
			</button>
		{/if}

		<div class="replies">
			{#if post.replies?.replies}
				{#each post.replies.replies as reply}
					<svelte:self post={reply} {chart} />
				{/each}
			{/if}
		</div>

		{#if replyBoxOpen}
			<div class="replybox">
				<b>Reply</b>
				<CreatePost reply_to={post.id} />
			</div>
		{/if}

		{#if !post.reply_to_id}
			<div class="gap" />
		{/if}
	</article>
{/if}

<style>
	article {
		position: relative;
		padding: 10px;
		padding-bottom: 0;
		background: var(--bg600);
		border-radius: 6px;
		/* border: dashed 1px red; */
	}
	.top {
		display: flex;
	}
	.gap {
		height: 5px;
	}
	.date {
		color: var(--bg400);
		font-size: 12px;
	}

	.message {
		margin-top: 5px;
	}
	.badges {
		display: flex;
		gap: 5px;
		padding: 0;
	}
	.charter {
		background-color: var(--link-color);
		font-size: 10px;
		color: var(--bg400);
		border-radius: 6px;
		font-weight: 700;
		padding: 2px 4px;
		margin: 0;
	}
	.reply-button {
		position: absolute;
		cursor: pointer;
		bottom: 10px;
		right: 10px;
		border: 0;
		outline: 0;
		width: 30px;
		height: 30px;
		border-radius: 6px;
		color: white;
		background-color: var(--bg500);
		z-index: 100;
	}
	.user {
		display: flex;
		width: fit-content;
		text-decoration: none;
		column-gap: 3px;
		font-family: 'Quicksand', sans-serif;
		grid-template-columns: 40px calc(100% - 40px);
	}
	.name-badges {
		align-items: center;
		color: var(--link-color);
		font-size: 16px;
		font-weight: 600;
		grid-row: 2/3;
	}
	.user img {
		grid-row: 1/3;
		width: 40px;
		border-radius: 6px;
	}
	.replies {
		position: relative;
	}
	.replies::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 3px;
		height: 100%;
		background-color: var(--bg500);
		border-radius: 6px;
		z-index: 2;
	}
	.replybox {
		padding: 10px;
		background: var(--bg500);
		border-radius: 6px;
		margin-bottom: 40px;
		margin-top: 10px;
	}
	.replybox,
	b {
		font-size: 1.15em;
		font-weight: 800;
	}
</style>
