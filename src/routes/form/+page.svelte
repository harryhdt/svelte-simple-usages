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
				label: 'Form',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-2">Svelte Simple Form Usage</h1>
	<ol>
		<li>
			<a href={resolve('/form/basic')}>Basic</a>
		</li>
		<li>
			<a href={resolve('/form/basic-validation')}>Basic Validation</a>
		</li>
		<li>
			<a href={resolve('/form/basic-default-values-with-validation')}>Basic Default Values with Validation</a>
		</li>
		<li>
			<a href={resolve('/form/nested-validation')}>Nested Validation</a>
		</li>
		<li>
			<a href={resolve('/form/file-upload-validation')}>File Upload Validation</a>
		</li>
		<li>
			<a href={resolve('/form/array-validation')}>Array Validation</a>
		</li>
		<li>
			<a href={resolve('/form/password-validation')}>Password Validation</a>
		</li>
		<li>
			<a href={resolve('/form/all-input-validation')}>All input Validation</a>
		</li>
		<li>
			<a href={resolve('/form/component-validation')}>Component Validation</a>
		</li>
		<li>
			<a href={resolve('/form/async-validation')}>Async Validation</a>
		</li>
	</ol>
</div>
