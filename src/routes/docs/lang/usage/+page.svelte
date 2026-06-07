<div class="docs-content">
	<h1 class="fw-bold mb-2">Usage Guide</h1>
	<p class="lead text-muted mb-4">Complete walkthrough for integrating svelte-simple-lang in your Svelte app.</p>

	<nav class="toc mb-4">
		<strong class="d-block mb-1 small text-muted text-uppercase">On this page</strong>
		<ul class="list-unstyled mb-0">
			<li><a href="#installation">Installation</a></li>
			<li><a href="#setup">Setup</a></li>
			<li><a href="#configuration">Configuration</a></li>
			<li>
				<a href="#using-translation-function">Using the Translation Function</a>
				<ul class="list-unstyled ps-3">
					<li><a href="#pluralization">Pluralization</a></li>
				</ul>
			</li>
			<li>
				<a href="#switching-locales">Switching Locales</a>
				<ul class="list-unstyled ps-3">
					<li><a href="#managing-default">Managing Default</a></li>
				</ul>
			</li>
			<li><a href="#lazy-loading">Lazy Loading</a></li>
			<li><a href="#lru-cache">LRU Cache</a></li>
			<li><a href="#client-side-usage">Client-Side Usage</a></li>
			<li><a href="#server-side-ssr">Server-Side (SSR)</a></li>
		</ul>
	</nav>

	<h2 id="installation">Installation</h2>
	<pre><code># npm
npm install svelte-simple-lang

# pnpm
pnpm add svelte-simple-lang

# yarn
yarn add svelte-simple-lang</code></pre>

	<h2 id="setup">Setup</h2>
	<p>Create your language files and initialize the i18n system:</p>
	<pre><code>// src/lib/lang/i18n.ts
import &lbrace; createLang &rbrace; from 'svelte-simple-lang';
import id from './id.json';
import en from './en.json';

const i18n = createLang(&lbrace;
  defaultLocale: 'id',
  defaultSource: id,
  sources: &lbrace;
    id,                       // Eager-loaded
    en,                       // Eager-loaded
    jp: () =&gt; import('./jp.json')  // Lazy-loaded
  &rbrace;
&rbrace;);

export const &lbrace; t, setLocale, getLocale, resetLocale, setDefaultLocale, availableLocales &rbrace; = i18n;
export default i18n;</code></pre>

	<h2 id="configuration">Configuration</h2>
	<table class="table">
		<thead>
			<tr>
				<th>Option</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>defaultLocale</code></td>
				<td><code>string</code></td>
				<td>-</td>
				<td>Initial locale code</td>
			</tr>
			<tr>
				<td><code>defaultSource</code></td>
				<td><code>object</code></td>
				<td>-</td>
				<td>Translation data for default locale (eager-loaded)</td>
			</tr>
			<tr>
				<td><code>sources</code></td>
				<td><code>Record&lt;string, object | () =&gt; Promise&gt;</code></td>
				<td>-</td>
				<td>All locale sources — object for eager, function for lazy</td>
			</tr>
			<tr>
				<td><code>maxCachedLocales</code></td>
				<td><code>number</code></td>
				<td><code>5</code></td>
				<td>LRU cache size (min 2, default locale never evicted)</td>
			</tr>
		</tbody>
	</table>

	<h2 id="using-translation-function">Using the Translation Function</h2>
	<p>The <code>t()</code> function translates keys based on the active locale:</p>
	<pre><code>t('hello')                          // simple
t('hello_&lbrace;name&rbrace;', &lbrace; name: 'User' &rbrace;) // with params
t('nav.home')                       // nested key (dot notation)</code></pre>

	<h3 id="pluralization">Pluralization</h3>
	<p>When <code>count</code> is passed as a param, the library automatically resolves plural forms:</p>
	<table class="table">
		<thead>
			<tr><th>count</th><th>Key resolved</th></tr>
		</thead>
		<tbody>
			<tr><td><code>0</code></td><td><code>key_zero</code> (falls back to singular)</td></tr>
			<tr><td><code>1</code></td><td>Singular (base key)</td></tr>
			<tr><td><code>2+</code></td><td><code>key_plural</code></td></tr>
		</tbody>
	</table>
	<pre><code>t('you_have_&lbrace;count&rbrace;_apple', &lbrace; count: 0 &rbrace;) // "No apples"
t('you_have_&lbrace;count&rbrace;_apple', &lbrace; count: 1 &rbrace;) // "You have 1 apple"
t('you_have_&lbrace;count&rbrace;_apple', &lbrace; count: 5 &rbrace;) // "You have 5 apples"</code></pre>

	<h2 id="switching-locales">Switching Locales</h2>
	<p><code>setLocale()</code> is async and race-condition safe — concurrent calls are queued:</p>
	<pre><code>const success = await setLocale('en');
if (success) &lbrace;
  // UI updates automatically via Svelte $state reactivity
&rbrace;</code></pre>

	<h3 id="managing-default">Managing Default</h3>
	<pre><code>resetLocale()             // Reset to current default locale
setDefaultLocale('en')    // Change default AND switch to it</code></pre>

	<h2 id="lazy-loading">Lazy Loading</h2>
	<p>Pass a function instead of an object to defer loading until first use:</p>
	<pre><code>sources: &lbrace;
  id,                                  // Loaded immediately
  jp: async () =&gt; &lbrace;                    // Loaded only when first switched to
    const res = await fetch('/locales/jp.json');
    return &lbrace; default: await res.json() &rbrace;;
  &rbrace;
&rbrace;</code></pre>

	<h2 id="lru-cache">LRU Cache</h2>
	<p>The library keeps recently-used locales in memory. The default locale is pinned and never evicted:</p>
	<pre><code>createLang(&lbrace;
  ...
  maxCachedLocales: 3  // 1 default + 2 other locales cached
&rbrace;)</code></pre>
	<p>When the cache is full, the oldest non-default locale is evicted.</p>

	<h2 id="client-side-usage">Client-Side Usage</h2>
	<pre><code>import &lbrace; setDefaultLocale, setLocale, getLocale, t, availableLocales &rbrace; from '$lib/lang/i18n';

// Persist preference
const saved = localStorage.getItem('locale') ?? 'id';
await setDefaultLocale(saved);

const switchLang = async (l) =&gt; &lbrace;
  const ok = await setLocale(l);
  if (ok) localStorage.setItem('locale', l);
&rbrace;;

&lbrace;@html t('hello')&rbrace;
each availableLocales as locale&rbrace;
  &lt;button onclick=&lbrace;() =&gt; switchLang(locale)&rbrace;&gt;&lbrace;locale&rbrace;&lt;/button&gt;
&lbrace;/each&rbrace;</code></pre>

	<h2 id="server-side-ssr">Server-Side (SSR)</h2>
	<p>Use <code>setDefaultLocale()</code> in your layout server load to set locale per request:</p>
	<pre><code>// src/routes/+layout.server.ts
import type &lbrace; LayoutServerLoad &rbrace; from './$types';

export const load: LayoutServerLoad = async (&lbrace; cookies &rbrace;) =&gt; &lbrace;
  const locale = cookies.get('locale') || 'id';
  return &lbrace; locale &rbrace;;
&rbrace;;</code></pre>

	<pre><code>// src/routes/+layout.svelte
import &lbrace; setDefaultLocale &rbrace; from '$lib/lang/i18n';

let &lbrace; children, data &rbrace; = $props();
await setDefaultLocale(data.locale);</code></pre>
</div>
