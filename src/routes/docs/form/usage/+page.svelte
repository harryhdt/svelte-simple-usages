<div class="docs-content">
	<h1 class="fw-bold mb-2">Usage Guide</h1>
	<p class="lead text-muted mb-4">Complete walkthrough for svelte-simple-form.</p>

	<nav class="toc mb-4">
		<strong class="d-block mb-1 small text-muted text-uppercase">On this page</strong>
		<ul class="list-unstyled mb-0">
			<li><a href="#installation">Installation</a></li>
			<li><a href="#useform-simple-forms">useForm — Simple Forms</a></li>
			<li>
				<a href="#useformcontrol-full-control">useFormControl — Full Control</a>
				<ul class="list-unstyled ps-3">
					<li><a href="#configuration">Configuration</a></li>
					<li><a href="#usecontrol-directive">use:control Directive</a></li>
				</ul>
			</li>
			<li><a href="#validators">Validators</a></li>
			<li><a href="#array-helpers">Array Helpers</a></li>
			<li><a href="#nested-fields">Nested Fields</a></li>
			<li><a href="#async-validation">Async Validation</a></li>
			<li><a href="#file-upload">File Upload</a></li>
		</ul>
	</nav>

	<h2 id="installation">Installation</h2>
	<pre><code>npm install svelte-simple-form</code></pre>

	<h2 id="useform-simple-forms">useForm — Simple Forms</h2>
	<p>Best when you only need submit/reset and prefer direct <code>bind:value</code> bindings.</p>
	<pre><code>const &lbrace; form &rbrace; = useForm(&lbrace;
  initialValues: &lbrace; email: '', password: '' &rbrace;,
  onSubmit: async (data) =&gt; &lbrace; /* server call */ &rbrace;,
  onReset: () =&gt; &lbrace; /* cleanup */ &rbrace;
&rbrace;);</code></pre>

	<table class="table">
		<thead>
			<tr><th>Prop</th><th>Type</th><th>Description</th></tr>
		</thead>
		<tbody>
			<tr><td><code>initialValues</code></td><td><code>T</code></td><td>Initial form data</td></tr>
			<tr><td><code>onSubmit</code></td><td><code>(data: T) =&gt; Promise&lt;void&gt;</code></td><td>Submit handler</td></tr>
			<tr><td><code>onReset</code></td><td><code>() =&gt; void</code></td><td>Reset callback</td></tr>
		</tbody>
	</table>

	<h2 id="useformcontrol-full-control">useFormControl — Full Control</h2>
	<p>Use when you need validation, dirty/touched tracking, <code>use:control</code>, or array helpers.</p>

	<h3 id="configuration">Configuration</h3>
	<table class="table">
		<thead>
			<tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr>
		</thead>
		<tbody>
			<tr><td><code>initialValues</code></td><td><code>T</code></td><td>-</td><td>Required — form data shape</td></tr>
			<tr><td><code>validator</code></td><td><code>Validator&lt;T&gt;</code></td><td>-</td><td>Pluggable validator instance</td></tr>
			<tr><td><code>validateOn</code></td><td><code>('change' | 'blur' | 'submit')[]</code></td><td><code>['change','blur','submit']</code></td><td>When to trigger validation</td></tr>
			<tr><td><code>validateAfter</code></td><td><code>'touched' | 'dirty' | 'touched-or-dirty' | 'touched-and-dirty'</code></td><td><code>'touched-and-dirty'</code></td><td>Condition to show errors</td></tr>
			<tr><td><code>validateDebounce</code></td><td><code>number</code></td><td><code>100</code></td><td>Debounce ms for change validation</td></tr>
			<tr><td><code>onSubmit</code></td><td><code>(data: T) =&gt; Promise&lt;void&gt;</code></td><td>-</td><td>Submit handler</td></tr>
			<tr><td><code>onReset</code></td><td><code>() =&gt; void</code></td><td>-</td><td>Reset callback</td></tr>
		</tbody>
	</table>

	<h3 id="usecontrol-directive">use:control Directive</h3>
	<p>Attach to form elements to establish a two-way contract with form state. Handles all input types:</p>
	<table class="table">
		<thead>
			<tr><th>Usage</th><th>Description</th></tr>
		</thead>
		<tbody>
			<tr><td><code>use:control=&lbrace;'name'&rbrace;</code></td><td>Simple string path</td></tr>
			<tr><td><code>use:control=&lbrace;&lbrace; field: 'age', valueAsNumber: true &rbrace;&rbrace;</code></td><td>Parse value as number</td></tr>
			<tr><td><code>use:control=&lbrace;&lbrace; field: 'email', setValueAs: (v) =&gt; format(v) &rbrace;&rbrace;</code></td><td>Transform value before store</td></tr>
		</tbody>
	</table>

	<p>Supported elements: <code>input[type=text|email|password|number|checkbox|radio|file]</code>, <code>textarea</code>, <code>select</code> (single &amp; multiple), <code>div[contenteditable]</code>.</p>

	<h2 id="validators">Validators</h2>
	<p>Validation is handled by the <code>Validator&lt;T&gt;</code> interface. Instead of rolling your own, use the official <strong>svelte-simple-form-validators</strong> package.</p>

	<div class="callout">
		<strong>Install:</strong> <code>npm install @svelte-simple-form/validators</code>
	</div>

	<p>Compatible with any Standard Schema library (Zod, Valibot, ArkType, etc.).</p>

	<pre><code>import &lbrace; useFormControl &rbrace; from 'svelte-simple-form';
import &lbrace; standardSchemaValidator &rbrace; from '@svelte-simple-form/validators/standard-schema';
import z from 'zod';

const schema = z.object(&lbrace;
  name: z.string().min(3),
  email: z.string().email(),
  age: z.number().min(10)
&rbrace;);

const &lbrace; form, control &rbrace; = useFormControl(&lbrace;
  initialValues: &lbrace; name: '', email: '', age: 0 &rbrace;,
  validator: standardSchemaValidator(schema)
&rbrace;);</code></pre>

	<p>For full documentation, source code, and contribution guide, visit <a href="https://github.com/harryhdt/svelte-simple-form-validators" target="_blank">github.com/harryhdt/svelte-simple-form-validators</a>.</p>

	<h2 id="array-helpers">Array Helpers</h2>
	<pre><code>// Add
form.arrayAdd('users', &lbrace; name: 'New' &rbrace;, 0); // insert at index 0
form.arrayAdd('tags', 'new tag');            // append to end

// Remove
form.arrayRemove('users', 1);                // remove at index 1

// Swap
form.arraySwap('users', 0, 2);               // swap positions

// Move
form.arrayMove('items', 3, 0);               // move from index 3 to 0

// Remove by predicate
form.arrayRemoveBy('users', (u) =&gt; u.name === 'John');

// Update by predicate
form.arrayUpdateBy('users', (u) =&gt; u.id === 5, &lbrace; name: 'Updated' &rbrace;);</code></pre>
	<p><em>Note:</em> All array helpers auto-reindex errors, dirty, and touched state on sibling items.</p>

	<h2 id="nested-fields">Nested Fields</h2>
	<pre><code>// Data shape: &lbrace; address: &lbrace; city: '', zip: '' &rbrace;, contacts: [&lbrace; name: '' &rbrace;] &rbrace;
&lt;input use:control=&lbrace;'address.city'&rbrace; /&gt;
&lt;input use:control=&lbrace;'contacts.0.name'&rbrace; /&gt;</code></pre>

	<h2 id="async-validation">Async Validation</h2>
	<p>Use async checks within your schema. The library debounces change-triggered validation to prevent API hammering.</p>
	<pre><code>import * as v from 'valibot';
import &lbrace; standardSchemaValidator &rbrace; from '@svelte-simple-form/validators/standard-schema';

const schema = v.object(&lbrace;
  username: v.pipe(
    v.string(),
    v.minLength(3),
    v.check(async (val) =&gt; &lbrace;
      const res = await fetch(`/api/check-username?q=$&lbrace;val&rbrace;`);
      const data = await res.json();
      return data.available;
    &rbrace;, 'Username taken')
  )
&rbrace;);</code></pre>
	<p>Async checks run on all triggers (change, blur, submit) by default. The debounce (100ms) prevents API hammering on rapid keystrokes — only affects change-triggered validation.</p>

	<h2 id="file-upload">File Upload</h2>
	<pre><code>import &lbrace; z &rbrace; from 'zod';
import &lbrace; standardSchemaValidator &rbrace; from '@svelte-simple-form/validators/standard-schema';

const schema = z.object(&lbrace;
  photo: z.instanceof(File).refine((f) =&gt; f.size &lt; 5_000_000, 'Max 5MB')
&rbrace;);

const &lbrace; form, control &rbrace; = useFormControl(&lbrace;
  initialValues: &lbrace; photo: null &rbrace;,
  validator: standardSchemaValidator(schema)
&rbrace;);</code></pre>

	<pre><code>&lt;input type="file" use:control=&lbrace;'photo'&rbrace; accept="image/*" /&gt;</code></pre>
</div>
