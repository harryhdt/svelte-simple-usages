<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import z from 'zod';
	import { useFormControl } from 'svelte-simple-form';
	import { standardSchemaValidator } from '@svelte-simple-form/validators/standard-schema';

	let success = $state<null | boolean>(null);

	const schema = z.object({
		name: z.string().min(3),
		email: z.email()
	});

	const { form, control } = useFormControl({
		initialValues: {
			name: 'Poya',
			email: 'invalid-email'
		},
		validator: standardSchemaValidator(schema),
		// validateAfter: 'touched-or-dirty',
		onSubmit: async (values) => {
			success = null;
			await new Promise((r) => setTimeout(r, 2000));
			console.log(values);
			success = Math.random() > 0.5 ? true : false;
		}
	});
	form.validate();
</script>

<div class="p-2">
	<Breadcrumb
		items={[
			{
				label: 'Home',
				href: '/'
			},
			{
				label: 'Form',
				href: '/form'
			},
			{
				label: 'Basic Default Values with Validation',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Form - Basic Default Values with Validation</h1>
	<div class="row gap-4">
		<form use:form.handler class="col" style="max-width: 512px;">
			{#if success !== null}
				<div
					class="alert {success ? 'alert-success' : 'alert-danger'} alert-dismissible fade show"
					role="alert"
				>
					A simple primary alert—check it out!
					<button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="alert"
					></button>
				</div>
			{/if}
			<div class="mb-3">
				<label for="name" class="form-label">Name</label>
				<input
					type="text"
					class="form-control {form.errors.name && 'is-invalid'}"
					id="name"
					placeholder="Name"
					use:control={'name'}
				/>
				{#if form.errors.name}
					<div class="invalid-feedback">{form.errors.name?.join(', ')}</div>
				{/if}
			</div>
			<div class="mb-3">
				<label for="email" class="form-label">Email</label>
				<input
					type="email"
					class="form-control {form.errors.email && 'is-invalid'}"
					id="email"
					placeholder="Email"
					use:control={'email'}
				/>
				{#if form.errors.email}
					<div class="invalid-feedback">{form.errors.email?.join(', ')}</div>
				{/if}
			</div>
			<button type="submit" class="btn btn-primary" disabled={form.isSubmitting || !form.isValid}>
				{#if form.isSubmitting}
					<div class="spinner-border text-white spinner-border-sm" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
				{:else}
					Submit
				{/if}
			</button>
			<button type="button" class="btn btn-danger" onclick={() => form.reset()}> Reset </button>
		</form>
		<div class="col bg-light py-2" style="white-space: pre; font-size: 14px;">
			<code>
				{JSON.stringify(form, null, 2)}
			</code>
		</div>
	</div>
</div>
