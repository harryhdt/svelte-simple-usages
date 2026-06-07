<div class="docs-content">
	<h1 class="fw-bold mb-2">Usage Guide</h1>
	<p class="lead text-muted mb-4">Complete walkthrough for svelte-simple-query.</p>

	<h2>Installation</h2>
	<pre><code>npm install svelte-simple-query</code></pre>

	<h2>Global Setup</h2>
	<pre><code>import &lbrace; Query &rbrace; from 'svelte-simple-query';

Query.setup(&lbrace;
  baseURI: 'https://api.example.com',   // Base URL for all endpoints
  baseInit: &lbrace; headers: &lbrace; Authorization: 'Bearer ...' &rbrace; &rbrace;,
  cacheTimeout: 2000,                     // Default TTL (ms). -1 = permanent, 0 = no cache
  fetcher: myCustomFetcher,               // Custom fetch implementation
  onError: (query, error) =&gt; &lbrace; /* log */ &rbrace;,
  onSuccess: (query) =&gt; &lbrace; /* log */ &rbrace;,
  loadingSlowTimeout: 30000,              // ms before triggering onLoadingSlow
  onLoadingSlow: (query) =&gt; &lbrace; /* show spinner */ &rbrace;,
  shouldRetryWhenError: false,            // Auto-retry on failure
  retryCount: 5,                          // Max retry attempts
  retryDelay: 10000,                      // ms between retries
  autoClearExpiredCache: 60000            // Auto-cleanup interval (ms). 0 = disable
&rbrace;);</code></pre>

	<h2>useQuery</h2>
	<p>Core hook for fetching data from an endpoint.</p>
	<pre><code>const posts = useQuery('/posts', &lbrace;
  cacheTimeout: 10000,    // Override global TTL
  group: 'blog'           // Group tag for batch operations
&rbrace;);

posts.fetch();  // Initiate fetch (deduplicated)</code></pre>

	<h3>Response State</h3>
	<pre><code>&lbrace;#if posts.isLoading&rbrace;
  Loading...
&lbrace;:else if posts.isError&rbrace;
  &lbrace;#if typeof posts.isError === 'object' && posts.isError.status&rbrace;
    Error &lbrace;posts.isError.status&rbrace;: &lbrace;JSON.stringify(posts.isError.info)&rbrace;
  &lbrace;:else&rbrace;
    &lbrace;posts.isError&rbrace;
  &lbrace;/if&rbrace;
  &lt;button onclick=&lbrace;() =&gt; posts.refetch()&rbrace;&gt;Retry&lt;/button&gt;
&lbrace;:else if posts.data&rbrace;
  &lbrace;#each posts.data as post&rbrace;
    ...
  &lbrace;/each&rbrace;
&lbrace;/if&rbrace;</code></pre>

	<h3>Refetch</h3>
	<pre><code>await posts.refetch();                       // Skip cache, fetch fresh
await posts.refetch(&lbrace; disableLoading: true &rbrace;); // Silent background refresh</code></pre>

	<h2>Cache Management</h2>
	<pre><code>Query.cacheTimeout = 5000;   // Change global default

// Per-query override
const users = useQuery('/users', &lbrace; cacheTimeout: -1 &rbrace;); // Permanent cache

// Manual operations
Query.clear('/users');          // Clear single endpoint cache
Query.clear();                  // Clear ALL cache
Query.clearExpiredCache();      // Clear only expired entries
Query.clearGroup('blog');       // Clear all queries in a group</code></pre>

	<h2>Mutations</h2>
	<pre><code>import &lbrace; mutate &rbrace; from 'svelte-simple-query';

// After a POST/PUT/DELETE, update cache
await mutate('/users/1', &lbrace;
  data: updatedUser,             // Direct cache update
  refetch: true                  // Also refetch from server (default: false when data provided)
&rbrace;);

// Optimistic update
const prev = users.data;
await mutate('/users/1', &lbrace;
  populateCache: (current) =&gt; (&lbrace; ...current, name: 'New Name' &rbrace;),
  refetch: false
&rbrace;);
// If server call fails, revert:
await mutate('/users/1', &lbrace; data: prev &rbrace;);</code></pre>

	<h2>Dynamic Queries</h2>
	<p>Use <code>useSingleQuery</code> (alias <code>useDynamicQueries</code>) for parameterized or multiple endpoints.</p>
	<pre><code>import &lbrace; useSingleQuery &rbrace; from 'svelte-simple-query';

const posts = useSingleQuery((id) =&gt; `/posts/$&lbrace;id&rbrace;`);

await posts['1'].fetch();
await posts['2'].fetch();

// Now data is available per key
console.log(posts['1'].data);
console.log(posts['2'].data);</code></pre>

	<h2>Query Groups</h2>
	<pre><code>const posts = useQuery('/posts', &lbrace; group: 'blog' &rbrace;);
const authors = useQuery('/authors', &lbrace; groups: ['blog', 'admin'] &rbrace;);

// Clear all blog-related queries
Query.clearGroup('blog');

// Get all queries in a group
const blogQueries = Query.group('blog');</code></pre>

	<h2>Error Handling & Retry</h2>
	<pre><code>Query.setup(&lbrace;
  shouldRetryWhenError: true,
  retryCount: 3,
  retryDelay: 5000,
  onError: (query, error) =&gt; &lbrace;
    console.error(`Failed: $&lbrace;query.endpoint&rbrace;`, error);
  &rbrace;
&rbrace;);</code></pre>
	<p>Retries use unique error sequence IDs to prevent race conditions. If a new error occurs while retrying, the old retry chain is abandoned.</p>
</div>
