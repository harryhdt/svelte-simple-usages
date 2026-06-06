<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { Query, useQuery } from 'svelte-simple-query';

	Query.setup({
		baseURI: 'https://jsonplaceholder.typicode.com',
		baseInit: {
			headers: {
				'cache-control': 'no-cache'
			}
		}
	});

	interface User {
		id: number;
		name: string;
	}

	const fastQuery = useQuery<User[]>('/users', { cacheTimeout: 3000 });
	const slowQuery = useQuery<User[]>('/users?_slow=1', { cacheTimeout: 30000 });
	const foreverQuery = useQuery<User[]>('/users?_forever=1', { cacheTimeout: -1 });

	let now = $state(Date.now());
	let lastCacheClearExpired = $state<number | null>(null);
	let lastFastTime = $state(0);
	let lastSlowTime = $state(0);
	let lastForeverTime = $state(0);

	$effect(() => {
		const id = setInterval(() => { now = Date.now(); }, 1000);
		return () => clearInterval(id);
	});

	const fetchAll = () => {
		const t = Date.now();
		if (t - lastFastTime >= 3000 || (lastCacheClearExpired !== null && lastCacheClearExpired > lastFastTime)) lastFastTime = t;
		if (t - lastSlowTime >= 30000 || (lastCacheClearExpired !== null && lastCacheClearExpired > lastSlowTime)) lastSlowTime = t;

		fastQuery.fetch();
		slowQuery.fetch();
		foreverQuery.fetch();
	};

	const handleClear = () => {
		Query.clear();
		lastFastTime = 0;
		lastSlowTime = 0;
		lastForeverTime = 0;
	};

	const overallLastFetch = $derived(Math.max(lastFastTime, lastSlowTime, lastForeverTime));
	const overallTimeSince = $derived(overallLastFetch > 0 ? now - overallLastFetch : 0);
	const timeSinceCacheClearExpired = $derived(
		lastCacheClearExpired ? Math.floor((now - lastCacheClearExpired) / 1000) : null
	);

	const fmtStatus = (ttl: number, timeSince: number) => {
		if (ttl === -1) return { label: 'Permanent', class: 'text-success' };
		const expired = timeSince >= ttl;
		const ago = Math.floor((timeSince - ttl) / 1000);
		return {
			label: expired ? `Expired ${ago}s ago` : 'Fresh',
			class: expired ? 'text-danger' : 'text-success'
		};
	};
</script>

<div class="p-2">
	<Breadcrumb
		items={[
			{ label: 'Home', href: '/' },
			{ label: 'Query', href: '/query' },
			{ label: 'Cache Management', current: true }
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Query - Cache Management</h1>
	<p class="mb-3 text-muted">
		Demonstrates <code>clearExpiredCache()</code> — invalidates only expired cache entries while preserving
		fresh and permanent (<code>cacheTimeout: -1</code>) ones. Data stays displayed — next <strong>Fetch
		All</strong> will hit network only for expired ones.
	</p>
	<p class="mb-3 text-muted small">
		<code>autoClearExpiredCache</code> runs every 60s by default — expired entries are automatically
		purged from memory. No setup needed. Override via
		<code>Query.setup(&#123; autoClearExpiredCache: 30000 &#125;)</code> or disable with
		<code>&#123; autoClearExpiredCache: 0 &#125;</code>.
	</p>

	<div class="d-flex gap-2 mb-3">
		<button type="button" class="btn btn-sm btn-primary" onclick={fetchAll}>Fetch All</button>
		<button
			type="button"
			class="btn btn-sm btn-warning"
			onclick={() => {
				Query.clearExpiredCache();
				lastCacheClearExpired = Date.now();
			}}>Clear Expired Cache</button
		>
		<button type="button" class="btn btn-sm btn-danger" onclick={handleClear}>Clear All</button>
	</div>

	{#if overallLastFetch > 0}
		<p class="mb-3 text-info-emphasis small">Last network fetch: {Math.floor(overallTimeSince / 1000)}s ago</p>
	{/if}
	{#if timeSinceCacheClearExpired !== null}
		<p class="mb-3 small text-warning">
			Cache expired cleared {timeSinceCacheClearExpired}s ago — data still shown, next Fetch All will
			fetch fresh for expired entries only.
		</p>
	{/if}

	<!-- Fast — 3s TTL -->
	<div class="card mb-2">
		<div class="card-header d-flex justify-content-between align-items-center">
			<span>
				<strong>Fast</strong> <span class="badge text-bg-info">3s TTL</span>
			</span>
			<span class="small {fmtStatus(3000, now - lastFastTime).class}">
				{lastFastTime > 0 ? fmtStatus(3000, now - lastFastTime).label : ''}
			</span>
		</div>
		<div class="card-body">
			{#if fastQuery.isLoading}
				Loading...
			{:else if fastQuery.data}
				<div class="mb-1">
					{fastQuery.data.length} users
				</div>
				<button type="button" class="btn btn-sm btn-outline-primary" onclick={() => { lastFastTime = Date.now(); fastQuery.refetch(); }}>
					Refetch
				</button>
			{:else if fastQuery.isError}
				<span class="text-danger">{fastQuery.isError}</span>
			{:else}
				<span class="text-muted">No data</span>
			{/if}
		</div>
	</div>

	<!-- Slow — 30s TTL -->
	<div class="card mb-2">
		<div class="card-header d-flex justify-content-between align-items-center">
			<span>
				<strong>Slow</strong> <span class="badge text-bg-secondary">30s TTL</span>
			</span>
			<span class="small {fmtStatus(30000, now - lastSlowTime).class}">
				{lastSlowTime > 0 ? fmtStatus(30000, now - lastSlowTime).label : ''}
			</span>
		</div>
		<div class="card-body">
			{#if slowQuery.isLoading}
				Loading...
			{:else if slowQuery.data}
				<div class="mb-1">
					{slowQuery.data.length} users
				</div>
				<button type="button" class="btn btn-sm btn-outline-primary" onclick={() => { lastSlowTime = Date.now(); slowQuery.refetch(); }}>
					Refetch
				</button>
			{:else if slowQuery.isError}
				<span class="text-danger">{slowQuery.isError}</span>
			{:else}
				<span class="text-muted">No data</span>
			{/if}
		</div>
	</div>

	<!-- Forever — -1 TTL -->
	<div class="card mb-2">
		<div class="card-header d-flex justify-content-between align-items-center">
			<span>
				<strong>Forever</strong> <span class="badge text-bg-dark">-1 TTL</span>
			</span>
			<span class="small text-success">
				{lastForeverTime > 0 ? 'Permanent' : ''}
			</span>
		</div>
		<div class="card-body">
			{#if foreverQuery.isLoading}
				Loading...
			{:else if foreverQuery.data}
				<div class="mb-1">
					{foreverQuery.data.length} users
				</div>
				<button type="button" class="btn btn-sm btn-outline-primary" onclick={() => { lastForeverTime = Date.now(); foreverQuery.refetch(); }}>
					Refetch
				</button>
			{:else if foreverQuery.isError}
				<span class="text-danger">{foreverQuery.isError}</span>
			{:else}
				<span class="text-muted">No data</span>
			{/if}
		</div>
	</div>

	<div class="mt-3 small text-muted">
		<p class="mb-1">
			<strong>How to test:</strong>
		</p>
		<ol class="mb-0">
			<li>Klik <strong>Fetch All</strong> — semua query terfetch</li>
			<li>Perhatikan badge tiap card: tiap detik <strong class="text-success">Fresh</strong> berubah jadi <strong class="text-danger">Expired Xs ago</strong> sesuai TTL masing-masing</li>
			<li>Klik <strong>Clear Expired Cache</strong> — expired entries di-cache dihapus, tapi data tampil tetap (cache-only invalidation)</li>
			<li>Klik <strong>Fetch All</strong> lagi — Fast (expired) fetch dari network, Slow (masih fresh) &amp; Forever dari cache</li>
			<li>Klik <strong>Clear All</strong> — hapus cache + state (pembanding, UI jadi blank)</li>
		</ol>
	</div>
</div>
