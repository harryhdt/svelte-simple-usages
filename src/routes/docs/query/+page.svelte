<script lang="ts">
	const queryFeatures = [
		{ title: '📡 Request Dedup', desc: 'Multiple simultaneous .fetch() calls share one network request.' },
		{ title: '💾 TTL Cache', desc: 'Per-query cache timeout. Stale-while-revalidate: shows cached data while fetching fresh.' },
		{ title: '🔄 Auto Retry', desc: 'Configurable retry on failure with unique error sequence IDs to prevent thundering herd.' },
		{ title: '🧹 Auto Cleanup', desc: 'Expired cache entries purged every 60s (configurable).' },
		{ title: '🔀 Dynamic Queries', desc: 'useSingleQuery / useDynamicQueries for parameterized endpoints.' },
		{ title: '✏️ Mutations', desc: 'Optimistic cache updates + optional refetch.' },
		{ title: '🏷️ Groups', desc: 'Tag queries into groups for batch clear/retrieve.' },
		{ title: '⚡ Configurable Fetcher', desc: 'Plug in your own fetch implementation.' }
	];
</script>

<div class="docs-content">
	<h1 class="fw-bold mb-2">Svelte Simple Query</h1>
	<p class="lead text-muted mb-3">
		Data fetching & caching for Svelte 5 — built-in deduplication, retry, and cache management.
	</p>

	<div class="callout">
		<strong>Install:</strong> <code>npm install svelte-simple-query</code>
	</div>

	<nav class="toc mb-4">
		<strong class="d-block mb-1 small text-muted text-uppercase">On this page</strong>
		<ul class="list-unstyled mb-0">
			<li><a href="#features">Features</a></li>
			<li><a href="#quick-start">Quick Start</a></li>
			<li>
				<a href="#core-concepts">Core Concepts</a>
				<ul class="list-unstyled ps-3">
					<li><a href="#query-lifecycle">Query Lifecycle</a></li>
					<li><a href="#state-management">State Management</a></li>
				</ul>
			</li>
		</ul>
	</nav>

	<h2 id="features">Features</h2>
	<div class="row g-3 mb-3">
		{#each queryFeatures as feature}
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

	<h2 id="quick-start">Quick Start</h2>
	<pre><code>import &lbrace; Query, useQuery &rbrace; from 'svelte-simple-query';

// Global setup
Query.setup(&lbrace;
  baseURI: 'https://api.example.com',
  cacheTimeout: 5000       // 5s cache TTL
&rbrace;);

// In a component
const users = useQuery('/users');
users.fetch();</code></pre>

	<pre><code>&lbrace;#if users.isLoading&rbrace;
  &lt;p class="text-muted"&gt;Loading...&lt;/p&gt;
&lbrace;:else if users.isError&rbrace;
  &lt;p class="text-danger"&gt;Error: &lbrace;users.isError&rbrace;&lt;/p&gt;
&lbrace;:else if users.data&rbrace;
  &lbrace;#each users.data as user&rbrace;
    &lt;p&gt;&lbrace;user.name&rbrace;&lt;/p&gt;
  &lbrace;/each&rbrace;
&lbrace;/if&rbrace;</code></pre>

	<h2 id="core-concepts">Core Concepts</h2>

	<h3 id="query-lifecycle">Query Lifecycle</h3>
	<ol>
		<li><strong>fetch()</strong> — checks cache first. If cached &amp; fresh, returns immediately. Otherwise fetches.</li>
		<li><strong>Stale-while-revalidate</strong> — if cached but expired, shows cached data while fetching in background.</li>
		<li><strong>Cache hit dedup</strong> — multiple concurrent <code>fetch()</code> calls => single network request.</li>
		<li><strong>Error retry</strong> — automatically retries on failure (up to <code>retryCount</code> times).</li>
	</ol>

	<h3 id="state-management">State Management</h3>
	<table class="table">
		<thead>
			<tr><th>State</th><th>Type</th><th>Description</th></tr>
		</thead>
		<tbody>
			<tr><td><code>data</code></td><td><code>T | null</code></td><td>Fetched data</td></tr>
			<tr><td><code>isLoading</code></td><td><code>boolean</code></td><td>Fetch in progress</td></tr>
			<tr><td><code>isError</code></td><td><code>boolean | string | object</code></td><td>Error info (<code>false</code> when no error)</td></tr>
		</tbody>
	</table>
</div>
