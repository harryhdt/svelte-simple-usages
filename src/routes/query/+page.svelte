<script>
	import { resolve } from '$app/paths';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
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
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-2">Svelte Simple Query Usage</h1>
	<ol>
		<li>
			<a href={resolve('/query/minimal')}>Minimal</a>
		</li>
		<li>
			<a href={resolve('/query/basic')}>Basic</a>
		</li>
		<li>
			<a href={resolve('/query/pagination')}>Pagination</a>
		</li>
		<li>
			<a href={resolve('/query/cache-management')}>Cache Management</a>
		</li>
	</ol>
</div>
