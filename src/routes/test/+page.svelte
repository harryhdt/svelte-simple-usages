<script>
	import { resolve } from '$app/paths';
</script>

<div class="p-2">
	<h1 class="fs-3 fw-semibold mt-2 mb-2">Test Pages</h1>
	<p class="text-muted">Dedicated test cases untuk verifikasi behavior spesifik per library.</p>

	<h2 class="fs-5 mt-3">Form</h2>
	<ol>
		<li>
			<a href={resolve('/test/form/async-double-submit')}>Async Double Submit</a>
		</li>
	</ol>

	<h2 class="fs-5 mt-3">Query</h2>
	<p class="text-muted fst-italic">Belum ada test.</p>

	<h2 class="fs-5 mt-3">Lang</h2>
	<p class="text-muted fst-italic">Belum ada test.</p>
</div>
