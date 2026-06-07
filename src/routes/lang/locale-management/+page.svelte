<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import {
		t,
		setLocale,
		getLocale,
		resetLocale,
		setDefaultLocale,
		availableLocales
	} from '$lib/lang/i18n';
	import { createLang } from 'svelte-simple-lang';
	import id from '$lib/lang/id.json';
	import en from '$lib/lang/en.json';

	type Locale = (typeof availableLocales)[number];

	let status = $state('');
	let currentLocale = $state(getLocale());
	let currentDefault = $state(getLocale());

	async function switchLocale(l: Locale) {
		const success = await setLocale(l);
		if (success) {
			currentLocale = l;
			status = `Switched to locale: ${l}`;
		} else {
			status = `Failed to switch to: ${l}`;
		}
	}

	async function handleResetLocale() {
		status = 'Resetting locale...';
		const success = await resetLocale();
		if (success) {
			currentLocale = currentDefault;
			status = `Reset to default locale (${currentLocale})`;
		} else {
			status = 'Failed to reset locale';
		}
	}

	async function handleSetDefaultLocale(l: Locale) {
		status = `Setting "${l}" as default locale...`;
		const success = await setDefaultLocale(l);
		if (success) {
			currentLocale = l;
			currentDefault = l;
			status = `"${l}" is now the default locale. Try resetLocale() to see it in action.`;
		} else {
			status = `Failed to set default locale: ${l}`;
		}
	}

	const cacheDemo = createLang({
		defaultLocale: 'id',
		defaultSource: id,
		sources: {
			id,
			en,
			jp: async () => {
				const res = await fetch('/locales/jp.json');
				return { default: await res.json() };
			},
			fr: async () => {
				const res = await fetch('/locales/fr.json');
				return { default: await res.json() };
			},
			ar: async () => {
				const res = await fetch('/locales/ar.json');
				return { default: await res.json() };
			}
		},
		maxCachedLocales: 4
	});

	type CacheLocale = (typeof cacheDemo.availableLocales)[number];

	let cacheQueue = $state<CacheLocale[]>(['id']);
	let cacheDemoLocale = $state('id');
	let cacheDemoDefault = $state('id');
	let cacheStatus = $state('');

	async function cacheSwitchLocale(l: CacheLocale) {
		cacheStatus = `Loading "${l}"...`;
		const success = await cacheDemo.setLocale(l);
		if (success) {
			cacheDemoLocale = l;

			if (cacheQueue.includes(l)) {
				// Move to end (MRU) — same as LRU behavior in loadLocale
				cacheQueue = cacheQueue.filter((x) => x !== l);
				cacheQueue = [...cacheQueue, l];
			} else {
				if (cacheQueue.length >= 4) {
					const toEvict = cacheQueue.find((x) => x !== cacheDemoDefault);
					if (toEvict) {
						cacheQueue = cacheQueue.filter((x) => x !== toEvict);
					}
				}
				cacheQueue = [...cacheQueue, l];
			}

			cacheStatus = `Switched to "${l}". Queue: [${cacheQueue.join(', ')}]`;
		} else {
			cacheStatus = `Failed to load "${l}"`;
		}
	}
</script>

<div class="p-2">
	<Breadcrumb
		items={[
			{ label: 'Home', href: '/' },
			{ label: 'Lang', href: '/lang' },
			{ label: 'Locale Management', current: true }
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Lang - Locale Management</h1>
	<p class="mb-3 text-muted">
		Demonstrates <code>resetLocale()</code>, <code>setDefaultLocale()</code>, async locale loading,
		and the built-in locale cache queue.
	</p>

	<div class="row g-4">
		<div class="col-12 col-md-6">
			<div class="card">
				<div class="card-body">
					<h5 class="card-title">API Demo (shared instance)</h5>
					<div class="d-flex gap-2 mb-3 flex-wrap">
						{#each availableLocales as locale (locale)}
							<button
								class="btn btn-sm {locale === currentLocale
									? 'btn-primary'
									: 'btn-outline-primary'}"
								onclick={() => switchLocale(locale)}
								type="button"
							>
								{locale}
							</button>
						{/each}
					</div>

					<hr />

					<h5 class="card-title">Locale Management</h5>
					<div class="d-flex gap-2 flex-wrap mb-2">
						<button class="btn btn-warning btn-sm" onclick={handleResetLocale} type="button">
							resetLocale()
						</button>
						{#each availableLocales as locale (locale)}
							<button
								class="btn btn-sm btn-outline-danger"
								onclick={() => handleSetDefaultLocale(locale)}
								type="button"
							>
								setDefaultLocale('{locale}')
							</button>
						{/each}
					</div>
					<small class="text-muted">
						Current locale: <strong>{currentLocale}</strong>
						<br />
						Default locale: <strong>{currentDefault}</strong>
					</small>
				</div>
			</div>

			{#if status}
				<div class="alert alert-info mt-3 mb-0 py-2 small">{status}</div>
			{/if}
		</div>

		<div class="col-12 col-md-6">
			<div class="card">
				<div class="card-body">
					<h5 class="card-title">Translations</h5>
					<p>{t('hello')}</p>
					<p>{t('goodbye')}</p>
					<p>{t('hello_{name}', { name: 'User' })}</p>
					<p><strong>Nested:</strong> {t('nav.home')} / {t('nav.about')} / {t('nav.contact')}</p>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-4">
		<div class="card">
			<div class="card-body">
				<h5 class="card-title">Locale Queue Simulation</h5>
				<p class="text-muted small mb-3">
					Separate lang instance with <code>maxCachedLocales: 4</code>. Only 4 locales fit in the
					queue (default + 3). Loading a 5th evicts the oldest.
				</p>

				<div class="d-flex gap-2 mb-3 flex-wrap">
					{#each cacheDemo.availableLocales as locale (locale)}
						<button
							class="btn btn-sm {locale === cacheDemoLocale
								? 'btn-primary'
								: 'btn-outline-primary'}"
							onclick={() => cacheSwitchLocale(locale)}
							type="button"
						>
							{locale}
						</button>
					{/each}
				</div>

				<div class="mb-2">
					<strong>Active:</strong>
					<span class="badge bg-primary ms-1">{cacheDemoLocale}</span>
				</div>

				<div>
					<strong>Queue:</strong>
					<div class="d-flex gap-2 mt-1" style="min-height: 42px;">
						{#each cacheQueue as l, i (l)}
							<div
								class="d-flex align-items-center border rounded px-3 py-1 {l === cacheDemoDefault
									? 'border-success bg-success-subtle'
									: 'border-secondary bg-white'}"
								style="font-family: monospace;"
							>
								<span class="fw-medium">{l}</span>
								{#if l === cacheDemoDefault}
									<span class="badge bg-success ms-1" style="font-size: 0.6rem;">pinned</span>
								{/if}
								{#if i < cacheQueue.length - 1}
									<span class="ms-2 text-muted" style="font-size: 0.7rem;">→</span>
								{/if}
							</div>
						{/each}
						{#if cacheQueue.length === 0}
							<span class="text-muted small">(empty)</span>
						{/if}
					</div>
				</div>

				{#if cacheStatus}
					<div class="alert alert-info mt-2 mb-0 py-2 small">{cacheStatus}</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="mt-4">
		<div class="card">
			<div class="card-body">
				<h5 class="card-title">How it works</h5>
				<ul class="mb-0 small">
					<li>
						<code>resetLocale()</code> — resets to the current default locale (initially
						<code>id</code>). Try changing locale first, then click reset.
					</li>
					<li>
						<code>setDefaultLocale(locale)</code> — changes which locale is considered "default".
						After setting a new default, <code>resetLocale()</code> will go to that locale.
					</li>
					<li>
						The <code>jp</code> and <code>fr</code> locales are loaded asynchronously from
						<code>/locales/jp.json</code> / <code>/locales/fr.json</code> when first requested.
					</li>
					<li>
						<strong>Queue:</strong> <code>maxCachedLocales</code> controls queue size. Default
						locale (<span class="badge bg-success" style="font-size: 0.6rem;">pinned</span>) is
						never evicted. When full, the oldest non-default locale is evicted.
					</li>
				</ul>
			</div>
		</div>
	</div>
</div>
