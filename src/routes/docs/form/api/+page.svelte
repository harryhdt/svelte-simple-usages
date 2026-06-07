<div class="docs-content">
	<h1 class="fw-bold mb-2">API Reference</h1>
	<p class="lead text-muted mb-4">Complete API reference for svelte-simple-form.</p>

	<h2>useForm</h2>
	<p>Minimal form state and submission handling.</p>
	<pre><code>function useForm&lt;T extends Record&lt;string, any&gt;&gt;(
  props: FormProps&lt;T&gt;
): &lbrace;
  form: &lbrace;
    initialValues: T;
    data: T;
    isSubmitting: boolean;
    reset(): void;
    submit(callback?: (data: T) =&gt; any): Promise&lt;void&gt;;
    handler(node: HTMLFormElement): void;
  &rbrace;
&rbrace;</code></pre>

	<h3>FormProps&lt;T&gt;</h3>
	<table class="table">
		<thead>
			<tr><th>Prop</th><th>Type</th><th>Required</th></tr>
		</thead>
		<tbody>
			<tr><td><code>initialValues</code></td><td><code>T</code></td><td>Yes</td></tr>
			<tr><td><code>onSubmit</code></td><td><code>(data: T) =&gt; Promise&lt;void&gt;</code></td><td>No</td></tr>
			<tr><td><code>onReset</code></td><td><code>() =&gt; void</code></td><td>No</td></tr>
		</tbody>
	</table>

	<h3>Form Members</h3>
	<table class="table">
		<thead>
			<tr><th>Member</th><th>Type</th><th>Description</th></tr>
		</thead>
		<tbody>
			<tr><td><code>initialValues</code></td><td><code>T</code></td><td>Snapshot of original values</td></tr>
			<tr><td><code>data</code></td><td><code>T</code></td><td>Current mutable form data</td></tr>
			<tr><td><code>isSubmitting</code></td><td><code>boolean</code></td><td>Submission in progress</td></tr>
			<tr><td><code>reset()</code></td><td><code>() =&gt; void</code></td><td>Reset data to initial values</td></tr>
			<tr><td><code>submit(callback?)</code></td><td><code>(callback?: (data: T) =&gt; any) =&gt; Promise&lt;void&gt;</code></td><td>Trigger submit</td></tr>
			<tr><td><code>handler(node)</code></td><td><code>(node: HTMLFormElement) =&gt; void</code></td><td>Use action for &lt;form&gt; element</td></tr>
		</tbody>
	</table>

	<h2>useFormControl</h2>
	<p>Full form control with validation and state tracking.</p>
	<pre><code>function useFormControl&lt;T extends Record&lt;string, any&gt;&gt;(
  props: FormControlProps&lt;T&gt;
): &lbrace;
  form: FormControlContext&lt;T&gt;;
  control: (node: any, data: &lbrace; field: FlatPaths&lt;T&gt;; valueAsNumber?: boolean; setValueAs?: (v: any) =&gt; Promise&lt;void&gt; | void &rbrace; | FlatPaths&lt;T&gt;) =&gt; &lbrace; destroy(): void &rbrace; | undefined;
&rbrace;</code></pre>


	<h3>FormControlProps&lt;T&gt; (extends FormProps)</h3>
	<table class="table">
		<thead>
			<tr><th>Prop</th><th>Type</th><th>Default</th></tr>
		</thead>
		<tbody>
			<tr><td><code>validator</code></td><td><code>Validator&lt;T&gt;</code></td><td>-</td></tr>
			<tr><td><code>validateOn</code></td><td><code>('change' | 'blur' | 'submit')[]</code></td><td><code>['change','blur','submit']</code></td></tr>
			<tr><td><code>validateAfter</code></td><td><code>'touched' | 'dirty' | 'touched-or-dirty' | 'touched-and-dirty'</code></td><td><code>'touched-and-dirty'</code></td></tr>
			<tr><td><code>validateDebounce</code></td><td><code>number</code></td><td><code>100</code></td></tr>
		</tbody>
	</table>

	<h3>FormControlContext&lt;T&gt; (extends FormContext)</h3>

	<table class="table">
		<thead>
			<tr><th>Member</th><th>Type</th><th>Description</th></tr>
		</thead>
		<tbody>
			<tr><td colspan="3" class="fw-semibold bg-light">State Flags</td></tr>
			<tr><td><code>isValid</code></td><td><code>boolean</code></td><td>All errors empty (derived via $effect)</td></tr>
			<tr><td><code>isValidating</code></td><td><code>boolean</code></td><td>Async validation in flight (tracked via activeRequests counter)</td></tr>
			<tr><td><code>isDirty</code></td><td><code>boolean</code></td><td>Any field dirty (derived via $effect)</td></tr>
			<tr><td><code>setIsValid(v)</code></td><td><code>(v: boolean) =&gt; void</code></td><td>Manually override isValid flag</td></tr>
			<tr><td><code>setIsValidating(v)</code></td><td><code>(v: boolean) =&gt; void</code></td><td>Manually override isValidating flag</td></tr>
			<tr><td colspan="3" class="fw-semibold bg-light">Field State Maps</td></tr>
			<tr><td><code>errors</code></td><td><code>Record&lt;FlatPaths&lt;T&gt;, string[] | undefined&gt;</code></td><td>Field error messages</td></tr>
			<tr><td><code>touched</code></td><td><code>Record&lt;FlatPaths&lt;T&gt;, boolean | undefined&gt;</code></td><td>Field has been blurred / interacted with</td></tr>
			<tr><td><code>dirty</code></td><td><code>Record&lt;FlatPaths&lt;T&gt;, boolean | undefined&gt;</code></td><td>Field value differs from initial</td></tr>
			<tr><td colspan="3" class="fw-semibold bg-light">Data Mutation</td></tr>
			<tr><td><code>setData(values, opts?)</code></td><td><code>(values: T, opts?: &lbrace; shouldValidate?: boolean &rbrace;) =&gt; void</code></td><td>Replace all data</td></tr>
			<tr><td><code>setData(field, value, opts?)</code></td><td><code>(field: P, value, opts?: FieldOptions) =&gt; void</code></td><td>Set single field value</td></tr>
			<tr><td><code>setInitialValues(values, opts?)</code></td><td><code>(values: T, opts?: &lbrace; reset?: boolean &rbrace;) =&gt; void</code></td><td>Update initial values snapshot</td></tr>
			<tr><td colspan="3" class="fw-semibold bg-light">Field State Management</td></tr>
			<tr><td><code>setTouched(field, value?)</code></td><td><code>(field: FlatPaths&lt;T&gt;, value?: boolean) =&gt; void</code></td><td>Mark field as touched</td></tr>
			<tr><td><code>removeTouched(field)</code></td><td><code>(field: FlatPaths&lt;T&gt;) =&gt; void</code></td><td>Remove touched state</td></tr>
			<tr><td><code>setDirty(field, value?)</code></td><td><code>(field: FlatPaths&lt;T&gt;, value?: boolean) =&gt; void</code></td><td>Mark field as dirty</td></tr>
			<tr><td><code>removeDirty(field)</code></td><td><code>(field: FlatPaths&lt;T&gt;) =&gt; void</code></td><td>Remove dirty state</td></tr>
			<tr><td><code>resetField(path)</code></td><td><code>(path: FlatPaths&lt;T&gt;) =&gt; void</code></td><td>Reset single field to initial value, clear touched/dirty</td></tr>
			<tr><td colspan="3" class="fw-semibold bg-light">Validation</td></tr>
			<tr><td><code>validate()</code></td><td><code>() =&gt; Promise&lt;boolean&gt;</code></td><td>Validate entire form</td></tr>
			<tr><td><code>validateField(field, force?)</code></td><td><code>(field: FlatPaths&lt;T&gt;, force?: boolean) =&gt; Promise&lt;boolean&gt;</code></td><td>Validate single field</td></tr>
			<tr><td><code>setErrors(errors)</code></td><td><code>(errors: Record&lt;string, string[] | undefined&gt;) =&gt; void</code></td><td>Set all errors at once (deep clone)</td></tr>
			<tr><td><code>setError(field, error)</code></td><td><code>(field: FlatPaths&lt;T&gt;, error: string | string[]) =&gt; void</code></td><td>Set single field error</td></tr>
			<tr><td><code>removeError(field)</code></td><td><code>(field: FlatPaths&lt;T&gt;) =&gt; void</code></td><td>Remove error for field</td></tr>
			<tr><td colspan="3" class="fw-semibold bg-light">Array Helpers</td></tr>
			<tr><td><code>arrayAdd(path, value, index?, opts?)</code></td><td>Insert item</td><td>Inserts at position (default: end). Auto-reindexes errors/dirty/touched.</td></tr>
			<tr><td><code>arrayRemove(path, index, opts?)</code></td><td>Remove by index</td><td>Removes item at index. Auto-reindexes.</td></tr>
			<tr><td><code>arraySwap(path, i, j, opts?)</code></td><td>Swap items</td><td>Swaps positions i and j. Auto-reindexes.</td></tr>
			<tr><td><code>arrayMove(path, from, to, opts?)</code></td><td>Move item</td><td>Moves from one index to another. Auto-reindexes.</td></tr>
			<tr><td><code>arrayRemoveBy(path, predicate, opts?)</code></td><td>Remove by condition</td><td>Removes first item matching predicate. Auto-reindexes.</td></tr>
			<tr><td><code>arrayUpdateBy(path, predicate, value, opts?)</code></td><td>Update by condition</td><td>Updates first matching item. Auto-reindexes.</td></tr>
		</tbody>
	</table>

	<h3>FieldOptions</h3>
	<pre><code>type FieldOptions = &lbrace;
  shouldTouch?: boolean;    // default: true
  shouldDirty?: boolean;    // default: true
  shouldValidate?: boolean; // default: true
&rbrace;;</code></pre>

	<h3>Control Action</h3>
	<p>Returned as the second element from <code>useFormControl</code>. Use via <code>use:control</code> directive.</p>
	<pre><code>const &lbrace; form, control &rbrace; = useFormControl(...);
// control is used via: &lt;input use:control=&lbrace;'fieldName'&rbrace; /&gt;</code></pre>

	<table class="table">
		<thead>
			<tr><th>Usage</th><th>Behavior</th></tr>
		</thead>
		<tbody>
			<tr><td><code>use:control=&lbrace;'name'&rbrace;</code></td><td>Bind field path as string</td></tr>
			<tr><td><code>use:control=&lbrace;&lbrace; field: 'age', valueAsNumber: true &rbrace;&rbrace;</code></td><td>Parse input value as number</td></tr>
			<tr><td><code>use:control=&lbrace;&lbrace; field: 'email', setValueAs: (v) =&gt; v.trim() &rbrace;&rbrace;</code></td><td>Transform value via callback</td></tr>
		</tbody>
	</table>
	<p>The action sets up <code>input</code>/<code>change</code> event listeners (select + checkbox/radio/file use <code>change</code>; text inputs use <code>input</code>) and a <code>blur</code> listener. It also uses a <code>$effect</code> to write form state changes back to the DOM.</p>

	<h2>Validator Interface</h2>
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
	<p>For ready-to-use validators, install <code>@svelte-simple-form/validators</code> — see <a href="/docs/form/usage#validators">Usage Guide</a>.</p>

	<h2>Types</h2>
	<pre><code>type FlatPaths&lt;T&gt;     // Union of all dot-notation field paths
type ArrayPaths&lt;T&gt;   // Only array field paths
type FormContext&lt;T&gt;        // Base context (extended by FormControlContext)
type FormControlContext&lt;T&gt;  // Return type of useFormControl</code></pre>
</div>
