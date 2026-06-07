<div class="docs-content">
	<h1 class="fw-bold mb-2">API Reference</h1>
	<p class="lead text-muted mb-4">Complete API reference for svelte-simple-query.</p>

	<h2>Query (Global Object)</h2>
	<p>Singleton that manages global configuration, cache, and group operations.</p>

	<h3>Query.setup(options)</h3>
	<p>Initialize global query configuration. Call once at app startup.</p>
	<table class="table">
		<thead>
			<tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr>
		</thead>
		<tbody>
			<tr><td><code>baseURI</code></td><td><code>string</code></td><td><code>''</code></td><td>Base API URL prepended to all endpoints</td></tr>
			<tr><td><code>baseInit</code></td><td><code>RequestInit</code></td><td><code>&lbrace;&rbrace;</code></td><td>Default fetch options (headers, etc.)</td></tr>
			<tr><td><code>fetcher</code></td><td><code>(url: string) =&gt; Promise&lt;any&gt;</code></td><td><code>fetch + JSON parse</code></td><td>Custom fetch implementation</td></tr>
			<tr><td><code>cacheTimeout</code></td><td><code>number</code></td><td><code>2000</code></td><td>Default cache TTL in ms. -1 = permanent, 0 = no cache</td></tr>
			<tr><td><code>onError</code></td><td><code>(query, error) =&gt; void</code></td><td>-</td><td>Called on fetch error</td></tr>
			<tr><td><code>onSuccess</code></td><td><code>(query) =&gt; void</code></td><td>-</td><td>Called on successful fetch</td></tr>
			<tr><td><code>loadingSlowTimeout</code></td><td><code>number</code></td><td><code>30000</code></td><td>ms threshold for slow loading</td></tr>
			<tr><td><code>onLoadingSlow</code></td><td><code>(query) =&gt; void</code></td><td>-</td><td>Called when loading exceeds threshold</td></tr>
			<tr><td><code>shouldRetryWhenError</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Auto-retry on failure</td></tr>
			<tr><td><code>retryCount</code></td><td><code>number</code></td><td><code>5</code></td><td>Max retries when error</td></tr>
			<tr><td><code>retryDelay</code></td><td><code>number</code></td><td><code>10000</code></td><td>ms between retry attempts</td></tr>
			<tr><td><code>autoClearExpiredCache</code></td><td><code>number</code></td><td><code>60000</code></td><td>Auto-cleanup interval. 0 = disable</td></tr>
		</tbody>
	</table>

	<h3>Query Methods</h3>
	<table class="table">
		<thead>
			<tr><th>Method</th><th>Signature</th><th>Description</th></tr>
		</thead>
		<tbody>
			<tr><td><code>clear</code></td><td><code>(endpoint?: string) =&gt; void</code></td><td>Clear single or all cache/data</td></tr>
			<tr><td><code>clearExpiredCache</code></td><td><code>() =&gt; void</code></td><td>Clear only expired entries</td></tr>
			<tr><td><code>clearGroup</code></td><td><code>(group?: string) =&gt; void</code></td><td>Clear queries in a group (all if omitted)</td></tr>
			<tr><td><code>group</code></td><td><code>(group: string) =&gt; StateQuery[]</code></td><td>Get all queries in a group</td></tr>
		</tbody>
	</table>

	<h2>useQuery&lt;T&gt;(endpoint, opts?)</h2>
	<p>Create a query instance for a single endpoint.</p>
	<pre><code>const users = useQuery&lt;User[]&gt;('/users', &lbrace;
  cacheTimeout: 5000,
  group: 'users'
&rbrace;);

users.fetch();</code></pre>

	<h3>Options</h3>
	<table class="table">
		<thead>
			<tr><th>Option</th><th>Type</th><th>Description</th></tr>
		</thead>
		<tbody>
			<tr><td><code>cacheTimeout</code></td><td><code>number</code></td><td>Override global cache TTL</td></tr>
			<tr><td><code>group</code></td><td><code>string</code></td><td>Single group tag</td></tr>
			<tr><td><code>groups</code></td><td><code>string[]</code></td><td>Multiple group tags</td></tr>
			<tr><td>Any Query.setup option</td><td>-</td><td>Override per-query</td></tr>
		</tbody>
	</table>

	<h3>StateQuery&lt;T, TError&gt; Interface</h3>
	<table class="table">
		<thead>
			<tr><th>Member</th><th>Type</th><th>Description</th></tr>
		</thead>
		<tbody>
			<tr><td><code>data</code></td><td><code>T | null</code></td><td>Fetched response data</td></tr>
			<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td>Currently fetching</td></tr>
			<tr><td><code>isError</code></td><td><code>boolean | string | TError</code></td><td><code>false</code> when no error, or error info</td></tr>
			<tr><td><code>endpoint</code></td><td><code>string</code></td><td>The endpoint URL</td></tr>
			<tr><td><code>group</code></td><td><code>string | undefined</code></td><td>Single group tag</td></tr>
			<tr><td><code>groups</code></td><td><code>string[] | undefined</code></td><td>Multiple group tags</td></tr>
			<tr><td><code>fetch()</code></td><td><code>() =&gt; Promise</code></td><td>Fetch data (deduplicated)</td></tr>
			<tr><td><code>refetch(opts?)</code></td><td><code>(opts?: &lbrace; disableLoading?: boolean &rbrace;) =&gt; Promise</code></td><td>Bypass cache &amp; re-fetch</td></tr>
			<tr><td><code>mutate(opts?)</code></td><td><code>(opts?: MutateOptions) =&gt; Promise</code></td><td>Direct cache mutation</td></tr>
			<tr><td><code>clear()</code></td><td><code>() =&gt; void</code></td><td>Clear this query's data &amp; cache</td></tr>
		</tbody>
	</table>

	<h2>useSingleQuery / useDynamicQueries</h2>
	<p>Create parameterized queries via a key → endpoint mapping function. Returns a proxy object with per-key queries.</p>
	<pre><code>const posts = useSingleQuery&lt;Post&gt;((id: string) =&gt; `/posts/$&lbrace;id&rbrace;`);

// Access individual queries by key
await posts['1'].fetch();
await posts['2'].fetch();

// Each key returns a full StateQuery instance
console.log(posts['1'].data);
console.log(posts['2'].data);</code></pre>

	<h2>mutate(endpoint, opts?)</h2>
	<p>Update cache for an endpoint directly — useful after POST/PUT/DELETE.</p>
	<table class="table">
		<thead>
			<tr><th>Option</th><th>Type</th><th>Description</th></tr>
		</thead>
		<tbody>
			<tr><td><code>data</code></td><td><code>any</code></td><td>Direct cache data replacement</td></tr>
			<tr><td><code>populateCache</code></td><td><code>(currentData: any) =&gt; any</code></td><td>Derive new data from current</td></tr>
			<tr><td><code>refetch</code></td><td><code>boolean</code></td><td>Force server refetch after updating cache (default: <code>true</code> if no data/populateCache)</td></tr>
		</tbody>
	</table>

	<pre><code>// Direct update
await mutate('/users', &lbrace; data: newUsersList &rbrace;);

// Optimistic update
await mutate('/users/1', &lbrace;
  populateCache: (current) =&gt; (&lbrace; ...current, name: newName &rbrace;)
&rbrace;);

// Refetch
await mutate('/users/1', &lbrace; refetch: true &rbrace;);</code></pre>

	<h2>Types</h2>
	<pre><code>type StateQuery&lt;T, TError = any&gt; = &lbrace;
  data: T | null;
  isError: boolean | string | TError;
  isLoading: boolean;
  endpoint: string;
  group?: string;
  groups?: string[];
  fetch: () =&gt; Promise&lt;void&gt;;
  refetch: (opts?: &lbrace; disableLoading?: boolean &rbrace;) =&gt; Promise&lt;void&gt;;
  mutate: (opts?: MutateOptions) =&gt; Promise&lt;void&gt;;
  clear: () =&gt; void;
&rbrace;;

type MutateOptions = &lbrace;
  data?: any;
  populateCache?: (currentData: any) =&gt; any;
  refetch?: boolean;
&rbrace;;

type QueryOptions = &lbrace;
  baseURI?: string;
  baseInit?: RequestInit;
  cacheTimeout?: number;
  // ... (same as Query.setup options except setup/bagHit/clear/group methods)
&rbrace;;</code></pre>

	<h2>Behavior Notes</h2>
	<ul>
		<li><strong>Deduplication:</strong> Multiple simultaneous <code>.fetch()</code> calls share one network request. Subsequent calls await the in-flight promise.</li>
		<li><strong>Stale-while-revalidate:</strong> When cache is expired, stale data is shown while fetching in background. No loading flash.</li>
		<li><strong>Retry:</strong> Unique error sequence IDs prevent thundering herd. Retry chains are abandoned if a new error occurs.</li>
		<li><strong>Cache growth:</strong> CacheStore grows unbounded for dynamic endpoints. <code>autoClearExpiredCache</code> (default 60s) mitigates this.</li>
	</ul>
</div>
