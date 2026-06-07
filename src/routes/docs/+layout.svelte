<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();

	const navItems = [
		{
			section: 'Svelte Simple Form',
			links: [
				{ href: '/docs/form', label: 'Overview' },
				{ href: '/docs/form/usage', label: 'Usage Guide' },
				{ href: '/docs/form/api', label: 'API Reference' },
				{ href: '/docs/form/examples', label: 'Examples' }
			]
		},
		{
			section: 'Svelte Simple Query',
			links: [
				{ href: '/docs/query', label: 'Overview' },
				{ href: '/docs/query/usage', label: 'Usage Guide' },
				{ href: '/docs/query/api', label: 'API Reference' },
				{ href: '/docs/query/examples', label: 'Examples' }
			]
		},
		{
			section: 'Svelte Simple Lang',
			links: [
				{ href: '/docs/lang', label: 'Overview' },
				{ href: '/docs/lang/usage', label: 'Usage Guide' },
				{ href: '/docs/lang/api', label: 'API Reference' },
				{ href: '/docs/lang/examples', label: 'Examples' }
			]
		}
	];

	function isActive(href: string) {
		return page.url.pathname === href;
	}
</script>

<button
	class="btn btn-outline-primary btn-sm d-md-none mb-3 ms-3 mt-3"
	data-bs-toggle="offcanvas"
	data-bs-target="#docsSidebar"
	type="button"
>
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
	Docs Menu
</button>

<aside
	class="offcanvas offcanvas-start d-md-none"
	tabindex="-1"
	id="docsSidebar"
	aria-labelledby="docsSidebarLabel"
>
	<div class="offcanvas-header border-bottom">
		<h5 class="offcanvas-title fw-semibold" id="docsSidebarLabel">📚 Docs</h5>
		<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
	</div>
	<div class="offcanvas-body p-0">
		<nav class="py-2">
			{#each navItems as item}
				<h6 class="px-3 mt-3 mb-1 text-muted text-uppercase small fw-bold">{item.section}</h6>
				<ul class="nav flex-column mb-2">
					{#each item.links as link}
						<li class="nav-item">
							<a
								hreflang={link.href}
								href={link.href}
								class="nav-link py-1 px-3 {isActive(link.href) ? 'active fw-semibold' : ''}"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			{/each}
		</nav>
	</div>
</aside>

<div class="row g-0">
	<nav class="col-lg-2 d-none d-md-block bg-light border-end vh-100 position-sticky top-0 overflow-auto">
		<div class="p-3">
			<h5 class="fw-semibold mb-3">
				<a href="/docs" class="text-decoration-none text-dark">📚 Docs</a>
			</h5>
			{#each navItems as item}
				<h6 class="mt-3 mb-1 text-muted text-uppercase small fw-bold">{item.section}</h6>
				<ul class="nav flex-column mb-2">
					{#each item.links as link}
						<li class="nav-item">
							<a
								hreflang={link.href}
								href={link.href}
								class="nav-link py-1 px-0 {isActive(link.href) ? 'active fw-semibold' : ''}"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			{/each}
		</div>
	</nav>
	<main class="col-lg-10 px-3 px-md-4 py-4">
		{@render children()}
	</main>
</div>

<style>
	:global(.docs-content h2) {
		margin-top: 2rem;
		border-bottom: 1px solid #dee2e6;
		padding-bottom: 0.5rem;
	}
	:global(.docs-content h3) {
		margin-top: 1.5rem;
	}
	:global(.docs-content pre) {
		background: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 0.5rem;
		padding: 1rem;
		overflow-x: auto;
	}
	:global(.docs-content table) {
		width: 100%;
		margin-bottom: 1rem;
	}
	:global(.docs-content table th),
	:global(.docs-content table td) {
		padding: 0.5rem;
		vertical-align: top;
		border-top: 1px solid #dee2e6;
	}
	:global(.docs-content table thead th) {
		border-bottom: 2px solid #dee2e6;
		font-weight: 600;
	}
	:global(.docs-content .callout) {
		padding: 1rem;
		margin-bottom: 1rem;
		border-left: 4px solid #0d6efd;
		background: #f0f7ff;
		border-radius: 0.25rem;
	}
	:global(.docs-content .callout-warning) {
		border-left-color: #ffc107;
		background: #fffef0;
	}
	:global(.docs-content .callout-success) {
		border-left-color: #198754;
		background: #f0fff4;
	}
	:global(.docs-content .feature-card) {
		transition: box-shadow 0.2s;
		height: 100%;
	}
	:global(.docs-content .feature-card:hover) {
		box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.08);
	}
	:global(.docs-content code) {
		font-size: 0.875em;
	}
</style>
