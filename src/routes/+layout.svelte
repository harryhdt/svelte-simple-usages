<script lang="ts">
	import { GlobeIcon, NotepadTextIcon } from '@lucide/svelte';
	import '../app.css';
	let { children } = $props();
</script>

<div id="app" class="font-tiktok">
	<nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom border-light-subtle">
		<div class="container-xl">
			<a class="navbar-brand fw-semibold" href="/">
				<span class="text-blue"> Svelte </span>
				<span class="text-black"> Simple </span>
				<span class="text-yellow"> * </span>
			</a>
			<button
				class="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<a class="nav-link active" aria-current="page" href="/">Home</a>
					</li>
					<!-- <li class="nav-item">
						<a class="nav-link" href="#">Link</a>
					</li> -->
					<li class="nav-item dropdown">
						<button
							class="nav-link dropdown-toggle"
							id="navbarDropdown"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							Explore
						</button>
						<ul class="dropdown-menu" aria-labelledby="navbarDropdown">
							<li>
								<a class="dropdown-item d-flex align-items-center column-gap-2" href="/form">
									<div class="badge bg-primary">-</div>
									Form
								</a>
							</li>
							<li>
								<a class="dropdown-item d-flex align-items-center column-gap-2" href="/query">
									<div class="badge bg-success">-</div>
									Query
								</a>
							</li>
							<li>
								<a class="dropdown-item d-flex align-items-center column-gap-2" href="/lang">
									<div class="badge bg-warning">-</div>
									Lang
								</a>
							</li>
						</ul>
					</li>
					<!-- <li class="nav-item">
						<a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
					</li> -->
				</ul>
				<div class="d-flex align-items-lg-center column-gap-4">
					<div class="d-flex column-gap-1 align-items-center">
						<NotepadTextIcon size={18} />
						<div class="">
							<a href="https://svelte-simple.harryhdt.dev" target="_blank" class="fw-medium">
								Svelte Simple Docs
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
	<div
		style="min-height: max(300px, calc(100vh - 57px - 81px));"
		class="container-xl d-flex flex-column"
	>
		{@render children()}
	</div>
	<div class="bg-light border-top border-light-subtle px-4 py-3 text-center fs-6">
		<div class="">
			&copy; {new Date().getFullYear()} Svelte Simple
		</div>
		<div class="">
			by
			<a href="https://harryhdt.dev" target="_blank" class="fw-medium"> harryhdt.dev </a>
		</div>
	</div>
</div>
