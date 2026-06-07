<div class="docs-content">
	<h1 class="fw-bold mb-2">Lang Examples</h1>
	<p class="lead text-muted mb-4">Practical code examples for svelte-simple-lang.</p>

	<nav class="toc mb-4">
		<strong class="d-block mb-1 small text-muted text-uppercase">On this page</strong>
		<ul class="list-unstyled mb-0">
			<li><a href="#basic-setup">Basic Setup</a></li>
			<li><a href="#multiple-locales">Multiple Locales</a></li>
			<li><a href="#parameters-pluralization">Parameters &amp; Pluralization</a></li>
			<li><a href="#lazy-loading">Lazy Loading</a></li>
			<li><a href="#lru-cache-queue">LRU Cache Queue</a></li>
		</ul>
	</nav>

	<h2 id="basic-setup">Basic Setup</h2>
	<p>Create a lang instance with a single locale and translate keys.</p>

	<pre><code>import &lbrace; createLang &rbrace; from 'svelte-simple-lang';
import id from './id.json';

const lang = createLang(&lbrace;
  defaultLocale: 'id',
  defaultSource: id,
  sources: &lbrace; id &rbrace;
&rbrace;);

export const &lbrace; t, setLocale, getLocale, availableLocales &rbrace; = lang;</code></pre>

	<pre><code>// id.json
&lbrace;
  "hello": "Halo",
  "goodbye": "Sampai jumpa",
  "hello_&lbrace;name&rbrace;": "Halo &lbrace;name&rbrace;",
  "nav": &lbrace;
    "home": "Beranda",
    "about": "Tentang"
  &rbrace;
&rbrace;</code></pre>

	<pre><code>&lt;p&gt;&lbrace;t('hello')&rbrace;&lt;/p&gt;
&lt;p&gt;&lbrace;t('goodbye')&rbrace;&lt;/p&gt;
&lt;p&gt;&lbrace;t('hello_&lbrace;name&rbrace;', &lbrace; name: 'Dunia' &rbrace;)&rbrace;&lt;/p&gt;
&lt;p&gt;&lbrace;t('nav.home')&rbrace; / &lbrace;t('nav.about')&rbrace;&lt;/p&gt;</code></pre>

	<h2 id="multiple-locales">Multiple Locales</h2>
	<p>Create an instance with multiple locales and switch between them at runtime.</p>

	<pre><code>import &lbrace; createLang &rbrace; from 'svelte-simple-lang';
import id from './id.json';
import en from './en.json';

const lang = createLang(&lbrace;
  defaultLocale: 'id',
  defaultSource: id,
  sources: &lbrace; id, en &rbrace;
&rbrace;);

export const &lbrace; t, setLocale, getLocale &rbrace; = lang;</code></pre>

	<pre><code>// Switch locale programmatically
await setLocale('en');
console.log(getLocale()); // 'en'

await setLocale('id');
console.log(getLocale()); // 'id'</code></pre>

	<h2 id="parameters-pluralization">Parameters & Pluralization</h2>
	<p>Keys embed <code>&lbrace;param&rbrace;</code> placeholders. Plural forms use <code>_zero</code> and <code>_plural</code> suffixes when <code>count</code> param is provided.</p>

	<pre><code>// JSON keys
"hello_&lbrace;name&rbrace;": "Hello &lbrace;name&rbrace;"
"item_&lbrace;count&rbrace;": "&lbrace;count&rbrace; item"
"item_&lbrace;count&rbrace;_zero": "No items"
"item_&lbrace;count&rbrace;_plural": "&lbrace;count&rbrace; items"</code></pre>

	<pre><code>// Usage
t('hello_&lbrace;name&rbrace;', &lbrace; name: 'World' &rbrace;);   // "Hello World"

t('item_&lbrace;count&rbrace;', &lbrace; count: 0 &rbrace;);   // "No items"       (_zero)
t('item_&lbrace;count&rbrace;', &lbrace; count: 1 &rbrace;);   // "1 item"         (base)
t('item_&lbrace;count&rbrace;', &lbrace; count: 5 &rbrace;);   // "5 items"        (_plural)
t('item_&lbrace;count&rbrace;', &lbrace; count: 100 &rbrace;); // "100 items"      (_plural)</code></pre>

	<h2 id="lazy-loading">Lazy Loading</h2>
	<p>Load locales asynchronously on first request — keeps initial bundle small.</p>

	<pre><code>const lang = createLang(&lbrace;
  defaultLocale: 'en',
  defaultSource: en,
  sources: &lbrace;
    en,
    jp: async () =&gt; &lbrace;
      const res = await fetch('/locales/jp.json');
      return &lbrace; default: await res.json() &rbrace;;
    &rbrace;,
    fr: async () =&gt; &lbrace;
      const mod = await import('./fr.json');
      return mod;
    &rbrace;
  &rbrace;
&rbrace;);

// jp and fr are loaded from network only when first requested
await lang.setLocale('jp'); // triggers fetch
await lang.setLocale('fr'); // triggers import
await lang.setLocale('jp'); // cached — instant</code></pre>

	<h2 id="lru-cache-queue">LRU Cache Queue</h2>
	<p>Control how many locales are kept in memory. Default is 5, minimum is 2. The default locale is never evicted.</p>

	<pre><code>const lang = createLang(&lbrace;
  defaultLocale: 'en',
  defaultSource: en,
  sources: &lbrace; en, jp, fr, ar, de, es &rbrace;,
  maxCachedLocales: 4 // only 4 locales cached at a time
&rbrace;);

// Queue: [en] (default, pinned)
await lang.setLocale('jp'); // Queue: [en, jp]
await lang.setLocale('fr'); // Queue: [en, jp, fr]
await lang.setLocale('ar'); // Queue: [en, jp, fr, ar]
await lang.setLocale('de'); // Queue: [en, fr, ar, de] — jp evicted (oldest non-default)
await lang.setLocale('jp'); // Queue: [en, ar, de, jp] — fr evicted</code></pre>
</div>
