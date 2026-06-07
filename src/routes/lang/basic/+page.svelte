<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { t, setLocale, getLocale, availableLocales } from '$lib/lang/i18n';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { untrack } from 'svelte';

	type Locale = (typeof availableLocales)[number];

	$effect(() => {
		const locale = page.url.searchParams.get('locale') as Locale | null;
		if (locale && availableLocales.includes(locale) && locale !== getLocale()) {
			untrack(() => setLocale(locale));
		}
	});

	async function switchLocale(l: Locale) {
		const success = await setLocale(l);
		if (success) {
			page.url.searchParams.set('locale', l);
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto(page.url);
		}
	}
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
				label: 'Basic',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Lang - Basic</h1>
	<p class="mb-3 text-muted">
		Multiple locales with URL-based switching. Uses shared i18n instance.
	</p>
	<div class="d-flex gap-2 mb-3">
		{#each availableLocales as locale (locale)}
			<button
				class="btn btn-sm {locale === getLocale() ? 'btn-primary' : 'btn-secondary'}"
				onclick={() => switchLocale(locale)}
				type="button"
			>
				{locale}
			</button>
		{/each}
	</div>
	<div>
		<p>{t('hello')}</p>
		<p>{t('goodbye')}</p>
		<p>{t('hello_{name}', { name: 'User' })}</p>
		<p><strong>Nested:</strong> {t('nav.home')} / {t('nav.about')} / {t('nav.contact')}</p>
	</div>
</div>
