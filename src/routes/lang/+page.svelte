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
				label: 'Lang',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-2">Svelte Simple Lang Usage</h1>
	<ol>
		<li>
			<a href={resolve('/lang/minimal')}>Minimal</a>
		</li>
		<li>
			<a href={resolve('/lang/basic')}>Basic</a>
		</li>
		<li>
			<a href={resolve('/lang/params-plural')}>Params & Plural</a>
		</li>
		<li>
			<a href={resolve('/lang/locale-management')}>Locale Management</a>
		</li>
	</ol>
</div>
