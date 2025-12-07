<script lang="ts">
	interface BreadcrumbProps {
		items: {
			label: string;
			href?: string;
			current?: boolean;
		}[];
	}
	const { items }: BreadcrumbProps = $props();
</script>

<nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb" class="bg-light py-2 px-2">
	<ol class="breadcrumb mb-0">
		{#each items as item}
			{#if item.current}
				<li class="breadcrumb-item active" aria-current="page">
					{item.label}
				</li>
			{:else}
				<li class="breadcrumb-item">
					<a class="text-decoration-none" href={item.href}>
						{item.label}
					</a>
				</li>
			{/if}
		{/each}
	</ol>
</nav>
