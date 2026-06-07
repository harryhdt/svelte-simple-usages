<div class="docs-content">
	<h1 class="fw-bold mb-2">Form Examples</h1>
	<p class="lead text-muted mb-4">Practical code examples for svelte-simple-form.</p>

	<nav class="toc mb-4">
		<strong class="d-block mb-1 small text-muted text-uppercase">On this page</strong>
		<ul class="list-unstyled mb-0">
			<li><a href="#basic-useform">Basic useForm</a></li>
			<li><a href="#basic-useformcontrol">Basic useFormControl</a></li>
			<li><a href="#basic-validation">Basic Validation</a></li>
			<li><a href="#default-values-with-validation">Default Values with Validation</a></li>
			<li><a href="#nested-fields">Nested Fields</a></li>
			<li><a href="#array-helpers">Array Helpers</a></li>
			<li><a href="#cross-field-validation">Cross-Field Validation</a></li>
			<li><a href="#async-validation">Async Validation</a></li>
			<li><a href="#file-upload">File Upload</a></li>
		</ul>
	</nav>

	<h2 id="basic-useform">Basic useForm</h2>
	<p>Simplest form setup — <code>useForm</code> with <code>bind:value</code>, submit, and reset.</p>

	<pre><code>import &lbrace; useForm &rbrace; from 'svelte-simple-form';

const &lbrace; form &rbrace; = useForm(&lbrace;
  initialValues: &lbrace; name: '', email: '', age: 10 &rbrace;,
  onSubmit: async (values) =&gt; &lbrace;
    await fetch('/api/submit', &lbrace; method: 'POST', body: JSON.stringify(values) &rbrace;);
  &rbrace;
&rbrace;);</code></pre>

	<pre><code>&lt;form use:form.handler&gt;
  &lt;input bind:value=&lbrace;form.data.name&rbrace; placeholder="Name" /&gt;
  &lt;input bind:value=&lbrace;form.data.email&rbrace; placeholder="Email" /&gt;
  &lt;button type="submit" disabled=&lbrace;form.isSubmitting&rbrace;&gt;
    &lbrace;form.isSubmitting ? 'Submitting...' : 'Submit'&rbrace;
  &lt;/button&gt;
  &lt;button type="button" onclick=&lbrace;() =&gt; form.reset()&rbrace;&gt;Reset&lt;/button&gt;
&lt;/form&gt;</code></pre>

	<h2 id="basic-useformcontrol">Basic useFormControl</h2>
	<p>Same form using <code>useFormControl</code> with the <code>use:control</code> directive.</p>

	<pre><code>import &lbrace; useFormControl &rbrace; from 'svelte-simple-form';

const &lbrace; form, control &rbrace; = useFormControl(&lbrace;
  initialValues: &lbrace; name: '', email: '' &rbrace;,
  onSubmit: async (values) =&gt; &lbrace; /* ... */ &rbrace;
&rbrace;);</code></pre>

	<pre><code>&lt;form use:form.handler&gt;
  &lt;input use:control=&lbrace;'name'&rbrace; placeholder="Name" /&gt;
  &lt;input use:control=&lbrace;'email'&rbrace; placeholder="Email" /&gt;
  &lt;button type="submit"&gt;Submit&lt;/button&gt;
&lt;/form&gt;</code></pre>

	<h2 id="basic-validation">Basic Validation</h2>
	<p>Add a Zod schema with <code>standardSchemaValidator</code>. Errors appear based on <code>validateAfter</code> config.</p>

	<pre><code>import &lbrace; useFormControl &rbrace; from 'svelte-simple-form';
import &lbrace; standardSchemaValidator &rbrace; from '@svelte-simple-form/validators/standard-schema';
import z from 'zod';

const schema = z.object(&lbrace;
  name: z.string().min(3, 'Min 3 characters'),
  email: z.string().email(),
  age: z.number().min(10)
&rbrace;);

const &lbrace; form, control &rbrace; = useFormControl(&lbrace;
  initialValues: &lbrace; name: '', email: '', age: 0 &rbrace;,
  validator: standardSchemaValidator(schema),
  validateOn: ['change', 'blur', 'submit'],
  validateAfter: 'touched-and-dirty'
&rbrace;);</code></pre>

	<pre><code>&lt;input use:control=&lbrace;'name'&rbrace; class:is-invalid=&lbrace;!!form.errors.name&rbrace; /&gt;
&lt;input use:control=&lbrace;'email'&rbrace; class:is-invalid=&lbrace;!!form.errors.email&rbrace; /&gt;
&lt;input use:control=&lbrace;&lbrace; field: 'age', valueAsNumber: true &rbrace;&rbrace;
  class:is-invalid=&lbrace;!!form.errors.age&rbrace; /&gt;

&lt;button type="submit" disabled=&lbrace;form.isSubmitting || !form.isValid&rbrace;&gt;Submit&lt;/button&gt;</code></pre>

	<h2 id="default-values-with-validation">Default Values with Validation</h2>
	<p>Pre-filled form with immediate validation on load.</p>

	<pre><code>const &lbrace; form, control &rbrace; = useFormControl(&lbrace;
  initialValues: &lbrace; name: 'John', email: 'invalid-email' &rbrace;,
  validator: standardSchemaValidator(schema),
  validateAfter: 'touched-or-dirty'
&rbrace;);

// Trigger validation immediately
form.validate();</code></pre>

	<h2 id="nested-fields">Nested Fields</h2>
	<p>Deeply nested objects are accessed via dot-path notation.</p>

	<pre><code>const schema = z.object(&lbrace;
  name: z.string().min(3),
  address: z.object(&lbrace; city: z.string().min(3) &rbrace;),
  nested1: z.object(&lbrace;
    label: z.string().min(1),
    nested2: z.object(&lbrace;
      label: z.string().min(2),
      nested3: z.object(&lbrace; label: z.string().min(3) &rbrace;)
    &rbrace;)
  &rbrace;)
&rbrace;);

const &lbrace; form, control &rbrace; = useFormControl(&lbrace;
  initialValues: &lbrace;
    name: '',
    address: &lbrace; city: '' &rbrace;,
    nested1: &lbrace; label: '', nested2: &lbrace; label: '', nested3: &lbrace; label: '' &rbrace; &rbrace; &rbrace;
  &rbrace;,
  validator: standardSchemaValidator(schema)
&rbrace;);</code></pre>

	<pre><code>&lt;input use:control=&lbrace;'address.city'&rbrace; /&gt;
&lt;input use:control=&lbrace;'nested1.nested2.nested3.label'&rbrace; /&gt;</code></pre>

	<h2 id="array-helpers">Array Helpers</h2>
	<p>Dynamic arrays with add, remove, swap, move, and predicate-based helpers. Auto-reindexes errors/dirty/touched.</p>

	<pre><code>// Add at specific index (default: append)
form.arrayAdd('tags', 'new tag');
form.arrayAdd('users', &lbrace; name: 'New' &rbrace;, 0); // insert at index 0

// Remove
form.arrayRemove('users', 1);

// Swap positions
form.arraySwap('items', 0, 2);

// Move from index 3 to 0
form.arrayMove('items', 3, 0);

// Predicate-based helpers
form.arrayRemoveBy('users', (u) =&gt; u.name === 'John');
form.arrayUpdateBy('users', (u) =&gt; u.id === 5, &lbrace; name: 'Updated' &rbrace;);</code></pre>

	<pre><code>&lt;!-- Template pattern for array fields --&gt;
&lbrace;#each form.data.contacts as contact, i (contact.id)&rbrace;
  &lt;input use:control=&lbrace;`contacts.&lbrace;i&rbrace;.label`&rbrace; /&gt;
  &lt;input use:control=&lbrace;`contacts.&lbrace;i&rbrace;.value`&rbrace; /&gt;
  &lt;button onclick=&lbrace;() =&gt; form.arrayRemove('contacts', i)&rbrace;&gt;Remove&lt;/button&gt;
&lbrace;/each&rbrace;</code></pre>

	<h2 id="cross-field-validation">Cross-Field Validation</h2>
	<p>Use <code>dependencies</code> so changing one field re-validates another — perfect for password confirmation.</p>

	<pre><code>import &lbrace; useFormControl &rbrace; from 'svelte-simple-form';
import &lbrace; standardSchemaValidator &rbrace; from '@svelte-simple-form/validators/standard-schema';
import z from 'zod';

const schema = z.object(&lbrace;
  password: z.string().min(8),
  passwordConfirmation: z.string()
&rbrace;).refine(
  (&lbrace; password, passwordConfirmation &rbrace;) =&gt; password === passwordConfirmation,
  &lbrace; message: 'Passwords do not match', path: ['passwordConfirmation'] &rbrace;
);

const &lbrace; form, control &rbrace; = useFormControl(&lbrace;
  initialValues: &lbrace; password: '', passwordConfirmation: '' &rbrace;,
  validator: standardSchemaValidator(schema, &lbrace;
    dependencies: &lbrace; password: ['passwordConfirmation'] &rbrace;
  &rbrace;)
&rbrace;);</code></pre>

	<h2 id="async-validation">Async Validation</h2>
	<p>Per-field async checks (e.g. username availability) triggered on blur. Also runs on submit.</p>

	<pre><code>const TAKEN = ['admin', 'root', 'test'];

const handleAsyncCheck = async (field: string) =&gt; &lbrace;
  const value = form.data[field];
  if (!value) return;

  // Simulate API call
  await new Promise((r) =&gt; setTimeout(r, 500));

  if (TAKEN.includes(value.toLowerCase())) &lbrace;
    form.setError(field, [`&dollar;&lbrace;field&rbrace; "&dollar;&lbrace;value&rbrace;" is taken`]);
  &rbrace; else &lbrace;
    form.removeError(field);
    form.validateField(field);
  &rbrace;
&rbrace;;</code></pre>

	<pre><code>&lt;input use:control=&lbrace;'username'&rbrace; onblur=&lbrace;() =&gt; handleAsyncCheck('username')&rbrace; /&gt;
&lt;input use:control=&lbrace;'email'&rbrace; onblur=&lbrace;() =&gt; handleAsyncCheck('email')&rbrace; /&gt;</code></pre>

	<pre><code>// In onSubmit, run async checks before final submission
const &lbrace; form, control &rbrace; = useFormControl(&lbrace;
  onSubmit: async (values) =&gt; &lbrace;
    await handleAsyncCheck('username');
    await handleAsyncCheck('email');
    if (form.errors.username || form.errors.email) return;
    // Proceed with submission...
  &rbrace;
&rbrace;);</code></pre>

	<h2 id="file-upload">File Upload</h2>
	<p>Single file, multi-file, and array of objects with files — validated via Zod <code>refine</code>.</p>

	<pre><code>import &lbrace; useFormControl &rbrace; from 'svelte-simple-form';
import &lbrace; standardSchemaValidator &rbrace; from '@svelte-simple-form/validators/standard-schema';
import z from 'zod';

const schema = z.object(&lbrace;
  photo: z.instanceof(File)
    .refine((f) =&gt; f.size &lt; 5_000_000, 'Max 5MB')
    .refine((f) =&gt; ['image/jpeg', 'image/png'].includes(f.type), 'JPEG/PNG only'),
  galleries: z.array(
    z.instanceof(File)
      .refine((f) =&gt; f.size &lt; 2_000_000, 'Max 2MB')
  ).max(6).optional(),
  cards: z.array(z.object(&lbrace;
    label: z.string().min(1),
    file: z.instanceof(File).optional()
  &rbrace;))
&rbrace;);

const &lbrace; form, control &rbrace; = useFormControl(&lbrace;
  initialValues: &lbrace;
    photo: undefined as File | undefined,
    galleries: [] as File[],
    cards: [] as &lbrace; label: string; file: File | undefined &rbrace;[]
  &rbrace;,
  validator: standardSchemaValidator(schema)
&rbrace;);</code></pre>

	<pre><code>&lt;!-- Single file --&gt;
&lt;input type="file" use:control=&lbrace;'photo'&rbrace; accept="image/*" /&gt;

&lt;!-- Multi-file --&gt;
&lt;input type="file" use:control=&lbrace;'galleries'&rbrace; multiple /&gt;

&lt;!-- Array of objects with files --&gt;
&lt;input use:control=&lbrace;`cards.&lbrace;i&rbrace;.label`&rbrace; /&gt;
&lt;input type="file" use:control=&lbrace;`cards.&lbrace;i&rbrace;.file`&rbrace; /&gt;</code></pre>
</div>
