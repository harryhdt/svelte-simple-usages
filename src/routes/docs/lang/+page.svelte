<script lang="ts">
	import { t, getLocale, availableLocales } from '$lib/lang/i18n';

	const langFeatures = [
		{ title: '🔐 Type Safety', desc: 'Full key inference & param validation from JSON — typos caught at compile time.' },
		{ title: '🧩 Nested Keys', desc: 'Dot notation for hierarchical keys: <code>nav.home</code>, <code>menu.file.save</code>.' },
		{ title: '📝 Params', desc: 'Interpolate dynamic values: <code>t("hello_&lbrace;name&rbrace;", &lbrace; name: "World" &rbrace;)</code>.' },
		{ title: '⚖️ Pluralization', desc: 'Automatic <code>_zero</code> / <code>_plural</code> forms via <code>count</code> param.' },
		{ title: '🔄 Lazy Loading', desc: 'Load locales on-demand, keep bundles small.' },
		{ title: '💾 LRU Cache', desc: 'Configurable cache (default 5 locales). Default locale never evicted.' },
		{ title: '🚦 Race Safe', desc: 'Promise queue prevents concurrent switching conflicts.' },
		{ title: '📦 Zero Deps', desc: 'No runtime dependencies. Minimal footprint.' }
	];
</script>

<div class="docs-content">
	<h1 class="fw-bold mb-2">Svelte Simple Lang</h1>
	<p class="lead text-muted mb-3">
		Lightweight, type-safe internationalization (i18n) for Svelte 5 — zero dependencies.
	</p>

	<div class="callout">
		<strong>Install:</strong> <code>npm install svelte-simple-lang</code>
	</div>

	<nav class="toc mb-4">
		<strong class="d-block mb-1 small text-muted text-uppercase">On this page</strong>
		<ul class="list-unstyled mb-0">
			<li><a href="#features">Features</a></li>
			<li><a href="#live-example">Live Example</a></li>
			<li><a href="#quick-start">Quick Start</a></li>
			<li><a href="#language-files">Language Files</a></li>
		</ul>
	</nav>

	<h2 id="features">Features</h2>
	<div class="row g-3 mb-3">
		{#each langFeatures as feature}
			<div class="col-12 col-sm-6 col-lg-4">
				<div class="card feature-card h-100">
					<div class="card-body py-2 px-3">
						<strong class="small">{@html feature.title}</strong>
						<p class="small text-muted mb-0 mt-1">{@html feature.desc}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<h2 id="live-example">Live Example</h2>
	<p class="text-muted small">Current locale: <strong>{getLocale()}</strong></p>
	<div class="card mb-4">
		<div class="card-body py-3">
			<p class="mb-1">{t('hello')}</p>
			<p class="mb-1">{t('hello_{name}', { name: 'World' })}</p>
			<p class="mb-1"><strong>Nested:</strong> {t('nav.home')} / {t('nav.about')} / {t('nav.contact')}</p>
			<p class="mb-0">
				<strong>Available:</strong>
				{#each availableLocales as l}
					<span class="badge bg-secondary me-1">{l}</span>
				{/each}
			</p>
		</div>
	</div>

	<h2 id="quick-start">Quick Start</h2>
	<pre><code>import &lbrace; createLang &rbrace; from 'svelte-simple-lang';
import id from './id.json';

const i18n = createLang(&lbrace;
  defaultLocale: 'id',
  defaultSource: id,
  sources: &lbrace;
    id,
    en: () =&gt; import('./en.json')
  &rbrace;
&rbrace;);

export const &lbrace; t, setLocale, getLocale, availableLocales &rbrace; = i18n;</code></pre>

	<h2 id="language-files">Language Files</h2>
	<p>JSON files define your translations. Keys can be nested or contain <code>&lbrace;param&rbrace;</code> placeholders.</p>
	<div class="row g-3 mb-3">
		<div class="col-md-6">
			<pre class="mb-0"><code>&lbrace;
  "hello": "Hello",
  "hello_&lbrace;name&rbrace;": "Hello &lbrace;name&rbrace;",
  "you_have_&lbrace;count&rbrace;_apple": "You have &lbrace;count&rbrace; apple",
  "you_have_&lbrace;count&rbrace;_apple_plural": "You have &lbrace;count&rbrace; apples",
  "you_have_&lbrace;count&rbrace;_apple_zero": "No apples",
  "nav": &lbrace;
    "home": "Home",
    "about": "About"
  &rbrace;
&rbrace;</code></pre>
		</div>
		<div class="col-md-6">
			<pre class="mb-0"><code>&lbrace;
  "hello": "Halo",
  "hello_&lbrace;name&rbrace;": "Halo &lbrace;name&rbrace;",
  "you_have_&lbrace;count&rbrace;_apple": "Kamu punya &lbrace;count&rbrace; apel",
  "you_have_&lbrace;count&rbrace;_apple_plural": "Kamu punya &lbrace;count&rbrace; apel",
  "you_have_&lbrace;count&rbrace;_apple_zero": "Kamu tidak punya apel",
  "nav": &lbrace;
    "home": "Beranda",
    "about": "Tentang"
  &rbrace;
&rbrace;</code></pre>
		</div>
	</div>
</div>
