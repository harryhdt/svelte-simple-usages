<div class="docs-content">
	<h1 class="fw-bold mb-2">API Reference</h1>
	<p class="lead text-muted mb-4">Complete API reference for svelte-simple-lang.</p>

	<nav class="toc mb-4">
		<strong class="d-block mb-1 small text-muted text-uppercase">On this page</strong>
		<ul class="list-unstyled mb-0">
			<li><a href="#createlang">createLang(props)</a></li>
			<li>
				<a href="#langinstance-methods">LangInstance Methods</a>
				<ul class="list-unstyled ps-3">
					<li><a href="#t-key-params">t(key, params?)</a></li>
					<li><a href="#setlocale">setLocale(locale)</a></li>
					<li><a href="#getlocale">getLocale()</a></li>
					<li><a href="#resetlocale">resetLocale()</a></li>
					<li><a href="#setdefaultlocale">setDefaultLocale(locale)</a></li>
					<li><a href="#availablelocales">availableLocales</a></li>
				</ul>
			</li>
			<li>
				<a href="#api-types">Types</a>
				<ul class="list-unstyled ps-3">
					<li><a href="#translationfn">TranslationFn</a></li>
					<li><a href="#langinstance">LangInstance</a></li>
					<li><a href="#localedata">LocaleData</a></li>
					<li><a href="#localeloader">LocaleLoader / LocaleSource</a></li>
				</ul>
			</li>
			<li><a href="#behavior-notes">Behavior Notes</a></li>
		</ul>
	</nav>

	<h2 id="createlang">createLang(props)</h2>
	<p>Factory function that creates a reactive i18n instance.</p>
	<pre><code>import &lbrace; createLang &rbrace; from 'svelte-simple-lang';

const i18n = createLang(&lbrace;
  defaultLocale: 'en',
  defaultSource: enData,
  sources: &lbrace; en: enData, id: () =&gt; import('./id.json') &rbrace;,
  maxCachedLocales: 5
&rbrace;);</code></pre>

	<table class="table">
		<thead>
			<tr>
				<th>Prop</th>
				<th>Type</th>
				<th>Required</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>defaultLocale</code></td>
				<td><code>Extract&lt;keyof Sources, string&gt;</code></td>
				<td>Yes</td>
				<td>Locale code used at initialization</td>
			</tr>
			<tr>
				<td><code>defaultSource</code></td>
				<td><code>Source</code></td>
				<td>Yes</td>
				<td>Translation data for the default locale (eager)</td>
			</tr>
			<tr>
				<td><code>sources</code></td>
				<td><code>Record&lt;string, Source | LocaleLoader&lt;Source&gt;&gt;</code></td>
				<td>Yes</td>
				<td>Map of locale code to data or loader function</td>
			</tr>
			<tr>
				<td><code>maxCachedLocales</code></td>
				<td><code>number</code></td>
				<td>No</td>
				<td>LRU cache limit. Min 2, default 5</td>
			</tr>
		</tbody>
	</table>

	<h2 id="langinstance-methods">LangInstance Methods</h2>

	<h3 id="t-key-params">t(key, params?)</h3>
	<p>Translate a key with optional parameter interpolation.</p>
	<table class="table">
		<thead>
			<tr><th>Param</th><th>Type</th><th>Description</th></tr>
		</thead>
		<tbody>
			<tr><td><code>key</code></td><td><code>K extends ExtractKeys&lt;Source&gt;</code></td><td>Translation key (auto-completed)</td></tr>
			<tr><td><code>params</code></td><td><code>&lbrace; [P in ExtractParams&lt;K&gt;]: string | number &rbrace;</code></td><td>Optional — values for <code>&lbrace;param&rbrace;</code> placeholders</td></tr>
		</tbody>
	</table>
	<p><strong>Returns:</strong> <code>string</code> — translated text, or the key itself if not found.</p>
	<p><em>Note:</em> When <code>params.count</code> is provided, automatically resolves <code>_zero</code> / <code>_plural</code> keys.</p>
	<pre><code>t('hello')                               // "Hello"
t('hello_&lbrace;name&rbrace;', &lbrace; name: 'World' &rbrace;)     // "Hello World"
t('nav.home')                            // "Home"
t('item_&lbrace;count&rbrace;', &lbrace; count: 5 &rbrace;)          // "5 items" (plural)</code></pre>

	<h3 id="setlocale">setLocale(locale)</h3>
	<p>Switch to a different locale. Async — loads the locale if not cached yet. Race-safe via promise queue.</p>
	<table class="table">
		<thead>
			<tr><th>Param</th><th>Type</th><th>Description</th></tr>
		</thead>
		<tbody>
			<tr><td><code>locale</code></td><td><code>Locales</code></td><td>Target locale code</td></tr>
		</tbody>
	</table>
	<p><strong>Returns:</strong> <code>Promise&lt;boolean&gt;</code> — <code>true</code> on success, <code>false</code> on failure.</p>

	<h3 id="getlocale">getLocale()</h3>
	<p>Get the currently active locale code.</p>
	<p><strong>Returns:</strong> <code>Locales</code></p>
	<pre><code>const current = getLocale(); // "id"</code></pre>

	<h3 id="resetlocale">resetLocale()</h3>
	<p>Reset to the current default locale. Async.</p>
	<p><strong>Returns:</strong> <code>Promise&lt;boolean&gt;</code></p>

	<h3 id="setdefaultlocale">setDefaultLocale(locale)</h3>
	<p>Set a new default locale and switch to it. Async.</p>
	<table class="table">
		<thead>
			<tr><th>Param</th><th>Type</th><th>Description</th></tr>
		</thead>
		<tbody>
			<tr><td><code>locale</code></td><td><code>Locales</code></td><td>Locale to set as default</td></tr>
		</tbody>
	</table>
	<p><strong>Returns:</strong> <code>Promise&lt;boolean&gt;</code></p>

	<h3 id="availablelocales">availableLocales</h3>
	<p>Array of all registered locale codes.</p>
	<p><strong>Type:</strong> <code>Locales[]</code></p>
	<pre><code>console.log(availableLocales); // ["id", "en", "jp"]</code></pre>

	<h2 id="api-types">Types</h2>

	<h3 id="translationfn">TranslationFn&lt;Source&gt;</h3>
	<pre><code>type TranslationFn&lt;Source&gt; = &lt;K extends ExtractKeys&lt;Source&gt;&gt;(
  key: K,
  params?: TranslationParams&lt;K&gt;
) =&gt; string;</code></pre>

	<h3 id="langinstance">LangInstance&lt;Locales, Source&gt;</h3>
	<pre><code>type LangInstance&lt;Locales, Source&gt; = &lbrace;
  getLocale: () =&gt; Locales;
  setLocale: (l: Locales) =&gt; Promise&lt;boolean&gt;;
  resetLocale: () =&gt; Promise&lt;boolean&gt;;
  setDefaultLocale: (l: Locales) =&gt; Promise&lt;boolean&gt;;
  t: TranslationFn&lt;Source&gt;;
  availableLocales: Locales[];
&rbrace;;</code></pre>

	<h3 id="localedata">LocaleData</h3>
	<pre><code>type LocaleData = &lbrace;
  [key: string]: string | LocaleData;
&rbrace;;</code></pre>

	<h3 id="localeloader">LocaleLoader / LocaleSource</h3>
	<pre><code>type LocaleLoader&lt;Source&gt; = () =&gt; Promise&lt;&lbrace; default: Source &rbrace;&gt;;
type LocaleSource&lt;Source&gt; = Source | LocaleLoader&lt;Source&gt;;</code></pre>

	<h2 id="behavior-notes">Behavior Notes</h2>
	<ul>
		<li><strong>Missing keys:</strong> console.warn with the key name, returns the key as fallback.</li>
		<li><strong>Non-string values:</strong> console.warn if a key resolves to a nested object (not a leaf string).</li>
		<li><strong>Regex escaping:</strong> parameter names with special regex characters are automatically escaped.</li>
		<li><strong>Invalid count:</strong> if <code>count</code> param is NaN, a warning is logged and singular form is used.</li>
	</ul>
</div>
