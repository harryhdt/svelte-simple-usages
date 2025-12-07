<script>
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
				label: 'Form',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-2">Svelte Simple Form Usage</h1>
	<ol>
		<li>
			<a href="/form/basic">Basic</a>
		</li>
		<li>
			<a href="/form/basic-validation">Basic Validation</a>
		</li>
		<li>
			<a href="/form/nested-validation">Nested Validation</a>
		</li>
		<li>
			<a href="/form/array-validation">Array Validation</a>
		</li>
		<li>
			<a href="/form/nested-array-validation">Nested Array Validation</a>
		</li>
		<li>
			<a href="/form/password-validation">Password Validation</a>
		</li>
	</ol>
</div>
