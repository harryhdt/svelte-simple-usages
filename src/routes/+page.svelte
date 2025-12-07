<script>
	import { TelescopeIcon } from '@lucide/svelte';
</script>

<div class="d-flex gap-1 align-items-center justify-content-center flex-grow-1">
	<div class="d-flex flex-column gap-2 justify-content-center">
		<TelescopeIcon size={64} class="mx-auto" />
		<h3 class="text-center">Svelte Simple Usage</h3>
		<div class="d-flex gap-2 align-items-center justify-content-center">
			<a href="/form" class="btn btn-primary"> Form </a>
			<a href="/query" class="btn btn-success"> Query </a>
			<a href="/lang" class="btn btn-warning"> Lang </a>
		</div>
	</div>
	<!-- <button type="button" class="btn btn-primary text-nowrap">Hello world</button>
	<input type="text" class="form-control" placeholder="Write here..." /> -->
</div>
