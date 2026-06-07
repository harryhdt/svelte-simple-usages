<script lang="ts">
	const features = [
		{ title: '🎯 use:control Directive', desc: 'Two-way contract between form state and DOM — handles text, checkbox, radio, select, file, contenteditable.' },
		{ title: '🔐 Type Safety', desc: 'Auto-inferred field paths from your data shape. <code>address.city</code>, <code>users.0.name</code>.' },
		{ title: '📊 State Tracking', desc: 'Per-field <code>errors</code>, <code>touched</code>, <code>dirty</code> — computed <code>isValid</code>, <code>isDirty</code>, <code>isValidating</code>.' },
		{ title: '🧩 Nested & Array Fields', desc: 'Deeply nested paths and dynamic arrays with add/remove/swap/move helpers.' },
		{ title: '🔌 Pluggable Validators', desc: 'Implement the <code>Validator</code> interface — works with Zod, Valibot, ArkType (via Standard Schema), or custom logic.' },
		{ title: '⚡ Async Validation', desc: 'Debounced field-level async checks (e.g. username availability).' },
		{ title: '🔄 Cross-field Validation', desc: 'Dependencies config so changing one field re-validates others (e.g. password confirmation).' },
		{ title: '📦 Zero Dependencies', desc: 'Built on <code>$state</code>, <code>$effect</code>, <code>untrack</code>. No external runtime.' }
	];
</script>

<div class="docs-content">
	<h1 class="fw-bold mb-2">Svelte Simple Form</h1>
	<p class="lead text-muted mb-3">
		Reactive form handling built on Svelte 5 Runes — zero dependencies.
	</p>

	<nav class="toc mb-4">
		<strong class="d-block mb-1 small text-muted text-uppercase">On this page</strong>
		<ul class="list-unstyled mb-0">
			<li><a href="#when-to-use-what">When to Use What</a></li>
			<li><a href="#features">Features</a></li>
			<li>
				<a href="#quick-start">Quick Start</a>
				<ul class="list-unstyled ps-3">
					<li><a href="#useform-minimal">useForm — Minimal</a></li>
					<li><a href="#useformcontrol-full-control">useFormControl — Full Control</a></li>
				</ul>
			</li>
		</ul>
	</nav>

	<div class="callout">
		<strong>Install:</strong> <code>npm install svelte-simple-form</code>
	</div>

	<h2 id="when-to-use-what">When to Use What</h2>
	<table class="table">
		<thead>
			<tr><th>Hook</th><th>Best For</th></tr>
		</thead>
		<tbody>
			<tr>
				<td><code>useForm</code></td>
				<td>Simple forms — just need submit/reset, fine with <code>bind:value</code></td>
			</tr>
			<tr>
				<td><code>useFormControl</code></td>
				<td>Full control — validation, dirty/touched tracking, array helpers, <code>use:control</code></td>
			</tr>
		</tbody>
	</table>

	<h2 id="features">Features</h2>
	<div class="row g-3 mb-3">
		{#each features as feature}
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
	<h3 id="useform-minimal">useForm — Minimal</h3>
	<pre><code>import &lbrace; useForm &rbrace; from 'svelte-simple-form';

const &lbrace; form &rbrace; = useForm(&lbrace;
  initialValues: &lbrace; email: '', password: '' &rbrace;,
  onSubmit: async (values) =&gt; &lbrace;
    await fetch('/api/login', &lbrace; method: 'POST', body: JSON.stringify(values) &rbrace;);
  &rbrace;
&rbrace;);</code></pre>

	<pre><code>&lt;form use:form.handler&gt;
  &lt;input bind:value=&lbrace;form.data.email&rbrace; name="email" /&gt;
  &lt;input bind:value=&lbrace;form.data.password&rbrace; name="password" type="password" /&gt;
  &lt;button type="submit" disabled=&lbrace;form.isSubmitting&rbrace;&gt;
    &lbrace;form.isSubmitting ? 'Submitting...' : 'Submit'&rbrace;
  &lt;/button&gt;
&lt;/form&gt;</code></pre>

	<h3 id="useformcontrol-full-control">useFormControl — Full Control</h3>
	<pre><code>import &lbrace; useFormControl &rbrace; from 'svelte-simple-form';

const &lbrace; form, control &rbrace; = useFormControl(&lbrace;
  initialValues: &lbrace; name: '', email: '' &rbrace;,
  onSubmit: async (values) =&gt; &lbrace; /* ... */ &rbrace;
&rbrace;);</code></pre>

	<pre><code>&lt;form use:form.handler&gt;
  &lt;input use:control=&lbrace;'name'&rbrace; /&gt;
  &lbrace;#if form.errors.name&rbrace;
    &lt;p class="text-danger small"&gt;&lbrace;form.errors.name.join(', ')&rbrace;&lt;/p&gt;
  &lbrace;/if&rbrace;
  &lt;input use:control=&lbrace;'email'&rbrace; /&gt;
  &lbrace;#if form.errors.email&rbrace;
    &lt;p class="text-danger small"&gt;&lbrace;form.errors.email.join(', ')&rbrace;&lt;/p&gt;
  &lbrace;/if&rbrace;
  &lt;button type="submit" disabled=&lbrace;form.isSubmitting || !form.isValid&rbrace;&gt;Submit&lt;/button&gt;
&lt;/form&gt;</code></pre>

	<div class="callout">
		<strong>Note:</strong> Validators implement the <code>Validator</code> interface. See the <a href="/docs/form/usage#validators">Usage Guide</a> for setup instructions using the official <code>@svelte-simple-form/validators</code> package.
	</div>
</div>
