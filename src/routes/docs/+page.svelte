<script lang="ts">
	const libraries = [
		{
			name: 'Svelte Simple Form',
			tagline: 'Reactive form state on Svelte Runes',
			description:
				'Form handling library with full control, validation, dirty/touched tracking, array helpers, nested field support, and pluggable validators.',
			href: '/docs/form',
			color: 'primary',
			features: [
				'useForm & useFormControl',
				'use:control field directive',
				'Zod / Standard Schema validators',
				'Array add/remove/swap/move',
				'Nested & cross-field validation'
			]
		},
		{
			name: 'Svelte Simple Query',
			tagline: 'Data fetching & caching for Svelte 5',
			description:
				'Query library with built-in caching, request deduplication, automatic retries, dynamic endpoints, mutations, and group management.',
			href: '/docs/query',
			color: 'success',
			features: [
				'TTL-based cache with auto-cleanup',
				'Request deduplication',
				'Automatic retry on failure',
				'Dynamic queries (useSingleQuery)',
				'Optimistic mutations'
			]
		},
		{
			name: 'Svelte Simple Lang',
			tagline: 'Multi-language (i18n) made simple',
			description:
				'Lightweight i18n library with full TypeScript type safety, lazy loading, nested keys, pluralization, parameter interpolation, and LRU caching.',
			href: '/docs/lang',
			color: 'warning',
			features: [
				'Type-safe keys & params from JSON',
				'Lazy loading & LRU cache',
				'Pluralization (_zero / _plural)',
				'Race-condition safe switching',
				'Zero dependencies'
			]
		}
	];
</script>

<div class="docs-content">
	<div class="mb-4">
		<h1 class="fw-bold mb-2">📚 Documentation</h1>
		<p class="lead text-muted mb-0">
			Complete reference for the Svelte Simple ecosystem — form handling, data fetching, and
			internationalization.
		</p>
	</div>

	<hr class="mb-4" />

	<div class="row g-4">
		{#each libraries as lib}
			<div class="col-12 col-md-6 col-lg-4">
				<a href={lib.href} class="text-decoration-none">
					<div class="card feature-card border-{lib.color} border">
						<div class="card-body d-flex flex-column">
							<h5 class="card-title fw-semibold">{lib.name}</h5>
							<p class="text-muted small mb-2">{lib.tagline}</p>
							<p class="card-text small flex-grow-1">{lib.description}</p>
							<ul class="list-unstyled mb-0 small">
								{#each lib.features as feat}
									<li class="mb-1">
										<span class="text-{lib.color}">&#10003;</span>
										{feat}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</a>
			</div>
		{/each}
	</div>

	<div class="callout mt-4">
		<strong>Quick links:</strong>
		<a href="/form" class="ms-2">Form Demos</a>
		<a href="/query" class="ms-2">Query Demos</a>
		<a href="/lang" class="ms-2">Lang Demos</a>
		&middot;
		<a href="https://github.com/harryhdt" target="_blank">GitHub</a>
	</div>
</div>
