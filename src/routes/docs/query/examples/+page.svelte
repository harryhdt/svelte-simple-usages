<div class="docs-content">
	<h1 class="fw-bold mb-2">Query Examples</h1>
	<p class="lead text-muted mb-4">Practical code examples for svelte-simple-query.</p>

	<nav class="toc mb-4">
		<strong class="d-block mb-1 small text-muted text-uppercase">On this page</strong>
		<ul class="list-unstyled mb-0">
			<li><a href="#setup-basic-fetch">Setup &amp; Basic Fetch</a></li>
			<li><a href="#parameters-pagination">Parameters &amp; Pagination</a></li>
			<li><a href="#mutations">Mutations</a></li>
			<li><a href="#cache-management">Cache Management</a></li>
			<li><a href="#dynamic-queries">Dynamic Queries</a></li>
		</ul>
	</nav>

	<h2 id="setup-basic-fetch">Setup & Basic Fetch</h2>
	<p>Configure global <code>Query</code> and fetch data in a component.</p>

	<pre><code>import &lbrace; Query, useQuery &rbrace; from 'svelte-simple-query';

// Global setup (call once at app start)
Query.setup(&lbrace;
  baseURI: 'https://api.example.com',
  cacheTimeout: 5000 // 5s default TTL
&rbrace;);

// In a component
interface User &lbrace; id: number; name: string; &rbrace;

const users = useQuery&lt;User[]&gt;('/users');

$effect(() =&gt; &lbrace;
  users.fetch();
&rbrace;);</code></pre>

	<pre><code>&lbrace;#if users.isLoading&rbrace;
  &lt;p&gt;Loading...&lt;/p&gt;
&lbrace;:else if users.data&rbrace;
  &lbrace;#each users.data as u (u.id)&rbrace;
    &lt;p&gt;&lbrace;u.name&rbrace;&lt;/p&gt;
  &lbrace;/each&rbrace;
  &lt;button onclick=&lbrace;() =&gt; users.refetch()&rbrace;&gt;Refresh&lt;/button&gt;
&lbrace;:else if users.isError&rbrace;
  &lt;p class="text-danger"&gt;&lbrace;users.isError&rbrace;&lt;/p&gt;
  &lt;button onclick=&lbrace;() =&gt; users.refetch()&rbrace;&gt;Retry&lt;/button&gt;
&lbrace;/if&rbrace;</code></pre>

	<h2 id="parameters-pagination">Parameters & Pagination</h2>
	<p>Reactively rebuild query when params change. Use <code>$derived</code> + <code>$effect</code> + <code>untrack</code>.</p>

	<pre><code>import &lbrace; untrack &rbrace; from 'svelte';
import &lbrace; Query, useQuery &rbrace; from 'svelte-simple-query';

Query.setup(&lbrace; baseURI: 'https://api.example.com' &rbrace;);

let page = $state(1);
let limit = $state(10);

const useUsers = (params: Record&lt;string, string&gt;) =&gt;
  useQuery&lt;User[]&gt;('/users?' + new URLSearchParams(params));

let usersQuery = $state(useUsers(&lbrace;&rbrace;));

$effect(() =&gt; &lbrace;
  void page;
  void limit;
  untrack(() =&gt; &lbrace;
    usersQuery = useUsers(&lbrace;
      _start: ((page - 1) * limit).toString(),
      _limit: limit.toString()
    &rbrace;);
    usersQuery.fetch();
  &rbrace;);
&rbrace;);</code></pre>

	<pre><code>&lt;select bind:value=&lbrace;page&rbrace;&gt;
  &lt;option value=&lbrace;1&rbrace;&gt;1&lt;/option&gt;
  &lt;option value=&lbrace;2&rbrace;&gt;2&lt;/option&gt;
  &lt;option value=&lbrace;3&rbrace;&gt;3&lt;/option&gt;
&lt;/select&gt;
&lt;select bind:value=&lbrace;limit&rbrace;&gt;
  &lt;option value=&lbrace;5&rbrace;&gt;5&lt;/option&gt;
  &lt;option value=&lbrace;10&rbrace;&gt;10&lt;/option&gt;
&lt;/select&gt;</code></pre>

	<h2 id="mutations">Mutations</h2>
	<p>Optimistically update query data after a mutation using <code>mutate()</code>.</p>

	<pre><code>const users = useQuery&lt;User[]&gt;('/users');
users.fetch();

const addUser = async () =&gt; &lbrace;
  const res = await fetch('https://api.example.com/users', &lbrace;
    method: 'POST',
    headers: &lbrace; 'Content-Type': 'application/json' &rbrace;,
    body: JSON.stringify(&lbrace; name: 'New User' &rbrace;)
  &rbrace;);
  const newUser = await res.json();

  // Optimistically update the cache
  users.mutate(&lbrace; data: [...(users.data || []), newUser] &rbrace;);
&rbrace;;

const editUser = async (id: number) =&gt; &lbrace;
  const res = await fetch(`/users/$&lbrace;id&rbrace;`, &lbrace; method: 'PATCH' &rbrace;);
  const updated = await res.json();

  users.mutate(&lbrace;
    data: users.data?.map((u) =&gt; (u.id === id ? &lbrace; ...u, ...updated &rbrace; : u))
  &rbrace;);
&rbrace;;</code></pre>

	<h2 id="cache-management">Cache Management</h2>
	<p>Control cache TTL per-query. Clear expired or all cache entries.</p>

	<pre><code>// Per-query TTL overrides global default
const fast = useQuery&lt;User[]&gt;('/users', &lbrace; cacheTimeout: 3000 &rbrace;);   // 3s
const slow = useQuery&lt;User[]&gt;('/users', &lbrace; cacheTimeout: 30000 &rbrace;);  // 30s
const perm = useQuery&lt;User[]&gt;('/users', &lbrace; cacheTimeout: -1 &rbrace;);    // forever</code></pre>

	<pre><code>// Cache management methods
Query.clearExpiredCache();  // remove only expired entries (data still displayed)
Query.clear();              // remove all cache entries</code></pre>

	<pre><code>// Auto-cleanup runs every 60s by default
// Override via setup:
Query.setup(&lbrace; autoClearExpiredCache: 30000 &rbrace;);  // every 30s
// Or disable:
Query.setup(&lbrace; autoClearExpiredCache: 0 &rbrace;);</code></pre>

	<h2 id="dynamic-queries">Dynamic Queries</h2>
	<p>Create parameterized queries on-the-fly with <code>useSingleQuery</code>. Useful for prefetch on hover.</p>

	<pre><code>import &lbrace; useSingleQuery &rbrace; from 'svelte-simple-query';

// Factory: maps a key to a unique endpoint
const user = useSingleQuery&lt;User&gt;((id) =&gt; '/users/' + id);

// Fetch individual user
user[1].fetch();

// Prefetch on hover
&lt;div onmouseover=&lbrace;() =&gt; &lbrace; user[u.id].fetch(); &rbrace;&rbrace;&gt;
  &lbrace;u.name&rbrace;
&lt;/div&gt;</code></pre>
</div>
