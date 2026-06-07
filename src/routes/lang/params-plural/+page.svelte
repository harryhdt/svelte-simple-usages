<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { t, setLocale } from '$lib/lang/i18n';

	let name = $state('World');
	let count = $state(0);

	setLocale('en');
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
				href: '/lang'
			},
			{
				label: 'Params & Plural',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Lang - Params & Plural</h1>
	<p class="mb-3 text-muted">
		Translation with parameters and plural forms. Keys embed <code>{'{param}'}</code> in their name for
		type safety.
	</p>
	<div class="row gap-4">
		<div class="col" style="max-width: 400px;">
			<div class="mb-3">
				<label for="name" class="form-label">Name</label>
				<input type="text" class="form-control" id="name" bind:value={name} />
			</div>
			<div class="mb-3">
				<label for="count" class="form-label">Count</label>
				<input type="number" class="form-control" id="count" bind:value={count} min="0" />
			</div>
		</div>
		<div class="col">
			<p>
				<strong>With name param:</strong>
				{t('hello_{name}', { name })}
				<br />
				<span><code>{`hello_{name}`}</code></span>
			</p>
			<p>
				<strong>With count param:</strong>
				{t('item_{count}', { count })}
				<br />
				<span><code>{`item_{count}`}</code></span>
			</p>
			<p class="text-muted" style="font-size: 0.85rem;">
				Try changing count to 0, 1, or 2+ to see plural forms in action.
			</p>
			<div class="mt-3 small">
				<p><strong>Keys in locale (en.json):</strong></p>
				<pre style="white-space: pre-wrap;">"hello_{`{name}`}": "Hello {`{name}`}"
"item_{`{count}`}": "{`{count}`} item"
"item_{`{count}`}_zero": "No items"
"item_{`{count}`}_plural": "{`{count}`} items"</pre>
			</div>
		</div>
	</div>
</div>
