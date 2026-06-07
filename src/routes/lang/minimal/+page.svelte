<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { createLang } from 'svelte-simple-lang';
	import id from '$lib/lang/id.json';

	const lang = createLang({
		defaultLocale: 'id',
		defaultSource: id,
		sources: { id }
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
				label: 'Lang',
				href: '/lang'
			},
			{
				label: 'Minimal',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Lang - Minimal</h1>
	<p class="mb-3 text-muted">
		Simplest usage: create a lang instance with a single locale and translate keys.
	</p>
	<div>
		<p>{lang.t('hello')}</p>
		<p>{lang.t('goodbye')}</p>
		<p>{lang.t('hello_{name}', { name: 'World' })}</p>
		<p>
			<strong>Nested:</strong>
			{lang.t('nav.home')} / {lang.t('nav.about')} / {lang.t('nav.contact')}
		</p>
	</div>
</div>
