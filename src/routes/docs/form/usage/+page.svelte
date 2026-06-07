<div class="docs-content">
	<h1 class="fw-bold mb-2">Usage Guide</h1>
	<p class="lead text-muted mb-4">Complete walkthrough for svelte-simple-form.</p>

	<h2>Installation</h2>
	<pre><code>npm install svelte-simple-form</code></pre>

	<h2>useForm — Simple Forms</h2>
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

	<h2>useFormControl — Full Control</h2>
	<p>Use when you need validation, dirty/touched tracking, <code>use:control</code>, or array helpers.</p>

	<h3>Configuration</h3>
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

	<h3>use:control Directive</h3>
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
	<p>Validators implement the <code>Validator&lt;T&gt;</code> interface. The two methods you need to provide:</p>

	<pre><code>interface Validator&lt;T = any&gt; &lbrace;
  validateField(
    field: FlatPaths&lt;T&gt;,
    form: FormControlContext&lt;T&gt;,
    force?: boolean,
    config?: &lbrace;
      validateOn?: string[];
      validateAfter?: string;
      validateDebounce?: number;
    &rbrace;
  ): boolean | Promise&lt;boolean&gt;;

  validateForm(form: FormControlContext&lt;T&gt;): boolean | Promise&lt;boolean&gt;;
&rbrace;</code></pre>

	<p>Below are reference implementations you can copy into your project.</p>

	<h3>Standard Schema Validator</h3>
	<p>Works with any Standard Schema-compatible library (Zod 4+, Valibot, ArkType).</p>

	<pre><code>// src/lib/validators/standard-schema.ts
import type &lbrace; FormControlContext &rbrace; from 'svelte-simple-form';
import type &lbrace; StandardSchemaV1 &rbrace; from '&lbrace;@&rbrace;standard-schema/spec';
import &lbrace; getDotPath &rbrace; from '&lbrace;@&rbrace;standard-schema/utils';

interface Options &lbrace;
  dependencies?: Partial&lt;Record&lt;string, string[]&gt;&gt;;
&rbrace;

export function standardSchemaValidator&lt;TInput, TOutput&gt;(
  schema: StandardSchemaV1&lt;TInput, TOutput&gt;,
  options: Options = &lbrace;&rbrace;
) &lbrace;
  async function validate(values: any) &lbrace;
    let result = schema["~standard"].validate(values);
    if (result instanceof Promise) result = await result;
    return result;
  &rbrace;

  function convertIssues(issues: any[]) &lbrace;
    const errors: Record&lt;string, string[]&gt; = &lbrace;&rbrace;;
    for (const issue of issues) &lbrace;
      const path = getDotPath(issue) || "_form";
      (errors[path] ??= []).push(issue.message);
    &rbrace;
    return errors;
  &rbrace;

  let latestFormCall: symbol;
  const latestCall: Record&lt;string, symbol&gt; = &lbrace;&rbrace;;

  function getFieldsToCheck(field: string) &lbrace;
    return [field, ...(options?.dependencies?.[field] ?? [])];
  &rbrace;

  return &lbrace;
    async validateForm(f: unknown) &lbrace;
      const form = f as FormControlContext;
      const callId = Symbol();
      latestFormCall = callId;
      const result = await validate(form.data);
      if (latestFormCall !== callId) return false;
      form.setErrors(&lbrace;&rbrace;);
      if (!result.issues) return true;
      const errors = convertIssues(result.issues as any);
      for (const [errKey, msgs] of Object.entries(errors)) &lbrace;
        form.setError(errKey as any, msgs);
        if (errKey.includes(".")) &lbrace;
          const parts = errKey.split(".");
          while (parts.length &gt; 1) &lbrace;
            parts.pop();
            const parentPath = parts.join(".");
            if (!errors[parentPath]) &lbrace;
              form.setError(parentPath as any, ["One or more items are invalid"]);
            &rbrace;
          &rbrace;
        &rbrace;
      &rbrace;
      return false;
    &rbrace;,

    async validateField(field, f, force = false, config) &lbrace;
      const form = f as FormControlContext;
      const callId = Symbol();
      latestCall[field] = callId;
      const result = await validate(form.data);
      if (latestCall[field] !== callId) return false;
      const errors = convertIssues((result.issues || []) as any[]);
      const fieldsToSync = getFieldsToCheck(field);
      let valid = true;
      const &lbrace; validateOn, validateAfter, validateDebounce &rbrace; = &lbrace;
        validateOn: ["change", "blur"],
        validateAfter: "touched-and-dirty",
        validateDebounce: 100,
        ...config,
      &rbrace;;

      for (const fieldKey of fieldsToSync) &lbrace;
        for (const k of Object.keys(form.errors)) &lbrace;
          if (k === fieldKey || k.startsWith(fieldKey + ".")) &lbrace;
            form.removeError(k);
          &rbrace;
        &rbrace;
        if (fieldKey.includes(".")) &lbrace;
          const parts = fieldKey.split(".");
          while (parts.length &gt; 1) &lbrace;
            parts.pop();
            const p = parts.join(".");
            if (form.errors[p]?.[0] === "One or more items are invalid") &lbrace;
              form.removeError(p);
            &rbrace;
          &rbrace;
        &rbrace;
        const matching = Object.entries(errors).filter(
          ([errKey]) =&gt; errKey === fieldKey || errKey.startsWith(fieldKey + ".")
        );
        if (matching.length &gt; 0) &lbrace;
          const isMainField = fieldKey === field;
          const isTouched = form.touched[fieldKey as any];
          const isDirty = form.dirty[fieldKey as any];
          const shouldShowError =
            (isMainField &amp;&amp; force) ||
            (validateAfter === "touched" ? isTouched
              : validateAfter === "dirty" ? isDirty
              : validateAfter === "touched-or-dirty" ? isTouched || isDirty
              : isTouched &amp;&amp; isDirty) ||
            form.isSubmitting;
          if (shouldShowError) &lbrace;
            valid = false;
            for (const [errKey, msgs] of matching) &lbrace;
              form.setError(errKey, msgs);
              if (errKey.includes(".")) &lbrace;
                // ... parent error propagation
              &rbrace;
            &rbrace;
          &rbrace; else &lbrace; valid = false; &rbrace;
        &rbrace;
      &rbrace;
      return valid;
    &rbrace;,
  &rbrace;;
&rbrace;</code></pre>

	<h3>Zod Validator</h3>
	<pre><code>// src/lib/validators/zod.ts
import type &lbrace; FormControlContext &rbrace; from 'svelte-simple-form';
import type &lbrace; ZodType &rbrace; from 'zod';

export function zodValidator&lt;T extends ZodType&lt;any&gt;&gt;(
  schema: T,
  options: &lbrace; dependencies?: Partial&lt;Record&lt;string, string[]&gt;&gt; &rbrace; = &lbrace;&rbrace;
) &lbrace;
  function mapErrors(values: any) &lbrace;
    const res = schema.safeParse(values);
    if (res.success) return &lbrace;&rbrace;;
    const errors: Record&lt;string, string[]&gt; = &lbrace;&rbrace;;
    for (const issue of res.error.issues) &lbrace;
      const key = issue.path.join('.') || '_form';
      (errors[key] ??= []).push(issue.message);
    &rbrace;
    return errors;
  &rbrace;

  return &lbrace;
    validateForm(form: FormControlContext) &lbrace;
      form.setErrors(&lbrace;&rbrace;);
      const errors = mapErrors(form.data);
      if (Object.keys(errors).length) &lbrace;
        form.setErrors(errors);
        return false;
      &rbrace;
      return true;
    &rbrace;,
    validateField(field: string, form: FormControlContext) &lbrace;
      const allErrors = mapErrors(form.data);
      const deps = options?.dependencies?.[field] ?? [];
      const fieldsToCheck = [field, ...deps];
      let valid = true;
      for (const key of fieldsToCheck) &lbrace;
        if (!form.touched[key]) continue;
        const errs = allErrors[key];
        if (errs &amp;&amp; errs.length &gt; 0) &lbrace;
          valid = false;
          form.setError(key, errs);
        &rbrace; else &lbrace;
          form.removeError(key);
        &rbrace;
      &rbrace;
      return valid;
    &rbrace;,
  &rbrace;;
&rbrace;</code></pre>

	<h2>Array Helpers</h2>
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

	<h2>Nested Fields</h2>
	<pre><code>// Data shape: &lbrace; address: &lbrace; city: '', zip: '' &rbrace;, contacts: [&lbrace; name: '' &rbrace;] &rbrace;
&lt;input use:control=&lbrace;'address.city'&rbrace; /&gt;
&lt;input use:control=&lbrace;'contacts.0.name'&rbrace; /&gt;</code></pre>

	<h2>Async Validation</h2>
	<p>Use async checks within your schema. The library debounces change-triggered validation to prevent API hammering.</p>
	<pre><code>import * as v from 'valibot';
import &lbrace; standardSchemaValidator &rbrace; from '$lib/validators/standard-schema';

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

	<h2>File Upload</h2>
	<pre><code>import &lbrace; z &rbrace; from 'zod';
import &lbrace; zodValidator &rbrace; from '$lib/validators/zod';

const schema = z.object(&lbrace;
  photo: z.instanceof(File).refine((f) =&gt; f.size &lt; 5_000_000, 'Max 5MB')
&rbrace;);

const &lbrace; form, control &rbrace; = useFormControl(&lbrace;
  initialValues: &lbrace; photo: null &rbrace;,
  validator: zodValidator(schema)
&rbrace;);</code></pre>

	<pre><code>&lt;input type="file" use:control=&lbrace;'photo'&rbrace; accept="image/*" /&gt;</code></pre>
</div>
