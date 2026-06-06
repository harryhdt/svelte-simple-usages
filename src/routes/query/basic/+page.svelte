<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { untrack } from 'svelte';
	import { Query, useQuery } from 'svelte-simple-query';

	Query.setup({
		baseURI: 'https://jsonplaceholder.typicode.com',
		baseInit: {
			headers: {
				'cache-control': 'no-cache'
			}
		},
		cacheTimeout: 10000
	});

	interface User {
		id: number;
		name: string;
		email: string;
	}

	const pageNum = $derived(page.url.searchParams.get('page') || '1');
	const useUsers = (p: string) => useQuery<User[]>(`/users?page=${p}`);

	let usersQuery = $state(useUsers(page.url.searchParams.get('page') || '1'));

	$effect(() => {
		void pageNum;
		untrack(() => {
			usersQuery = useUsers(pageNum);
			usersQuery.fetch();
		});
	});

	const handleSearchParamsChange = (obj: Record<string, string>) => {
		for (const [key, value] of Object.entries(obj)) {
			if (value) {
				page.url.searchParams.set(key, value);
			} else {
				page.url.searchParams.delete(key);
			}
		}
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(page.url);
	};
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
				label: 'Basic',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Query - Basic</h1>
	<p class="mb-3 text-muted">
		Fetch users with URL search params pagination. Uses <code>$derived</code> + <code>$effect</code>
		to reactively rebuild query when <code>?page=</code> changes.
	</p>
	<div class="d-flex align-items-center gap-2 mb-3">
		Page:
		{#each [1, 2, 3] as n (n)}
			<button
				class="btn btn-sm {pageNum === n.toString() ? 'btn-primary' : 'btn-secondary'}"
				onclick={() =>
					handleSearchParamsChange({
						page: n.toString()
					})}
				type="button"
			>
				{n}
			</button>
		{/each}
	</div>
	{#if usersQuery.isLoading}
		Loading...
	{:else if usersQuery.data}
		<div>
			Total users: {usersQuery.data.length}
		</div>
		<div style="white-space: pre; font-size: 0.9rem;overflow:auto;max-height:calc(100vh - 320px)">
			{JSON.stringify(usersQuery.data, null, 2)}
		</div>
		<button type="button" class="btn btn-sm btn-primary mt-2" onclick={() => usersQuery.refetch()}
			>Refresh</button
		>
	{:else if usersQuery.isError}
		{usersQuery.isError}
		<button type="button" class="btn btn-sm btn-danger mt-2" onclick={() => usersQuery.refetch()}
			>Try again</button
		>
	{/if}
</div>
