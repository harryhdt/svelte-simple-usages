<script lang="ts">
	import { untrack } from 'svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { Query, useQuery, useSingleQuery } from 'svelte-simple-query';

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
		email: string;
	}

	let page = $state('1');
	let limit = $state('3');

	const useUsers = (query: Record<string, string> = {}) =>
		useQuery<User[]>('/users?' + new URLSearchParams(query));

	let usersQuery = $state(useUsers());

	$effect(() => {
		void limit;
		void page;
		untrack(() => {
			usersQuery = useUsers({
				_start: ((parseInt(page) - 1) * parseInt(limit)).toString(),
				_limit: limit
			});
			usersQuery.fetch();
		});
	});

	const user = useSingleQuery<User>((key) => '/users/' + key);

	let loading = $state({ add: false, edit: false });

	const addUser = async () => {
		loading.add = true;
		const res = await fetch('https://jsonplaceholder.typicode.com/users', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: 'User ' + ((usersQuery.data?.length || 0) + 1),
				email: (usersQuery.data?.length || 0) + 1 + '-user@example.com'
			})
		});
		const newUser = await res.json();
		usersQuery.mutate({
			data: [...(usersQuery.data || []), newUser]
		});
		loading.add = false;
	};

	const editFirstUser = async () => {
		loading.edit = true;
		const res = await fetch('https://jsonplaceholder.typicode.com/users/1', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: 1, name: 'EDITED User 1' })
		});
		const updatedUser = await res.json();
		await usersQuery.mutate({
			data: usersQuery.data?.map((u) => ({
				...(u.id === 1 ? { ...u, ...updatedUser } : u)
			}))
		});
		await user[1].mutate({
			data: { ...user[1].data, ...updatedUser }
		});
		loading.edit = false;
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
				label: 'Pagination',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Query - Pagination</h1>
	<p class="mb-3 text-muted">
		Paginated fetch with <code>_start</code> / <code>_limit</code> params. Includes mutations
		(add/edit) and
		<code>useSingleQuery</code> for individual user prefetch on hover.
	</p>
	<div>
		{#if usersQuery.isLoading}
			Loading...
		{:else if usersQuery.data}
			<div class="d-flex gap-2 mb-2">
				<button
					type="button"
					class="btn btn-sm btn-success"
					onclick={addUser}
					disabled={loading.add}>{loading.add ? 'Adding...' : 'Add user'}</button
				>
				<button
					type="button"
					class="btn btn-sm btn-warning"
					onclick={editFirstUser}
					disabled={loading.edit}>{loading.edit ? 'Updating...' : 'Edit 1st user'}</button
				>
				<button
					type="button"
					class="btn btn-sm btn-danger"
					onclick={() => {
						Query.setup({ baseURI: 'https://google.com' });
						usersQuery.refetch();
					}}
				>
					Simulate error
				</button>
			</div>
			<div>
				{#each usersQuery.data as u, i (u.id)}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<!-- svelte-ignore a11y_mouse_events_have_key_events -->
					<div
						onmouseover={() => {
							user[u.id].fetch();
						}}
					>
						{i + 1}. {u.name}
					</div>
				{:else}
					<div>No users yet.</div>
				{/each}
			</div>
			<div class="d-flex align-items-center gap-2 mt-3">
				<select class="form-select form-select-sm w-auto" bind:value={page}>
					<option value="1">1</option>
					<option value="2">2</option>
					<option value="3">3</option>
				</select>
				<select class="form-select form-select-sm w-auto" bind:value={limit}>
					<option value="3">3</option>
					<option value="5">5</option>
					<option value="10">10</option>
				</select>
				<button type="button" class="btn btn-sm btn-primary" onclick={() => usersQuery.refetch()}
					>Refresh</button
				>
			</div>
		{:else if usersQuery.isError}
			{usersQuery.isError}
			<div class="d-flex gap-2 mt-2">
				<button type="button" class="btn btn-sm btn-danger" onclick={() => usersQuery.refetch()}
					>Try again</button
				>
				<button
					type="button"
					class="btn btn-sm btn-secondary"
					onclick={() => {
						Query.setup({ baseURI: 'https://jsonplaceholder.typicode.com' });
						usersQuery.refetch();
					}}>Reset</button
				>
			</div>
		{:else}
			Blank
		{/if}
	</div>
</div>
