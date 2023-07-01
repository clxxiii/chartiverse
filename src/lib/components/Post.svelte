<script lang="ts">
	import type { Chart, Post, User } from '@prisma/client';
	import moment from 'moment';
	import { dataset_dev } from 'svelte/internal';

	export let post: PostWithReplies & { author: User };
	export let chart: Chart;

	type PostWithReplies = Post & { replies: { replies: Post } };
	const dateString = moment(post?.date_posted).fromNow();
</script>

{#if post}
	<article>
		<div class="top">
			<a href="/charters/{post.author.id}" class="user">
				<img src={post.author.avatar_url} alt="pfp" />
				<div class="displayname">{post.author.username}</div>
				<div class="username">@{post.author.id}</div>
			</a>
			<div class="badges">
				{#if post.author.id == chart.user_id}
					<div class="badge charter">CHARTER</div>
				{/if}
			</div>
		</div>
		{post.content}
		<div class="date">{dateString}</div>
		<div class="replies">
			{#if post.replies?.replies}
				{#each post.replies.replies as reply}
					<svelte:self post={reply} {chart} />
				{/each}
			{/if}
		</div>

		{#if !post.reply_to_id}
			<div class="gap" />
		{/if}
	</article>
{/if}

<style>
	article {
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
	.badges {
		position: relative;
		display: flex;
		margin-left: 3px;
		padding: 0;
	}
	.charter {
		position: absolute;
		background-color: var(--link-color);
		font-size: 10px;
		color: var(--bg400);
		border-radius: 6px;
		font-weight: 700;
		padding: 2px 4px;
		top: 0;
		left: 0;
		margin: 0;
	}
	.user {
		display: grid;
		width: fit-content;
		text-decoration: none;
		column-gap: 3px;
		font-family: 'Quicksand', sans-serif;
		grid-template-columns: 40px calc(100% - 40px);
		grid-template-rows: 50% 50%;
	}
	.username {
		font-size: 12px;
		grid-row: 2/3;
		color: var(--text);
	}
	.displayname {
		color: var(--link-color);
		font-size: 16px;
		font-weight: 600;
		grid-row: 1/2;
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
	}
</style>
