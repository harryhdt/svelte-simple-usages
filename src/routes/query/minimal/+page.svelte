<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { Query, useQuery } from 'svelte-simple-query';

	Query.setup({
		baseURI: 'https://jsonplaceholder.typicode.com',
		baseInit: {
			headers: {
				'cache-control': 'no-cache'
			}
		}
	});

	interface User {
		id: number;
		name: string;
	}

	const users = useQuery<User[]>('/users');

	$effect(() => {
		users.fetch();
	});
</script>

<div class="p-2">
	<Breadcrumb
		items={[
			{
				label: 'Home',
				href: '/'
			},
			{
				label: 'Query',
				href: '/query'
			},
			{
				label: 'Minimal',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Query - Minimal</h1>
	<p class="mb-3 text-muted">
		Simplest usage: setup, fetch, and render data with loading/error states.
	</p>
	<div>
		{#if users.isLoading}
			Loading...
		{:else if users.data}
			{#each users.data as u, i (u.id)}
				<div>
					{i + 1}. {u.name}
				</div>
			{:else}
				<div>No users yet.</div>
			{/each}
			<button type="button" class="btn btn-sm btn-primary mt-2" onclick={() => users.refetch()}
				>Refresh</button
			>
		{:else if users.isError}
			{users.isError}
			<button type="button" class="btn btn-sm btn-danger mt-2" onclick={() => users.refetch()}
				>Try again</button
			>
		{:else}
			Blank
		{/if}
	</div>
</div>
