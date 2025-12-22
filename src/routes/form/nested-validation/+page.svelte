<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import z from 'zod';
	import { standardSchemaValidator } from '@svelte-simple-form/validators/standard-schema';
	import { useFormControl } from 'svelte-simple-form';

	let success = $state<null | boolean>(null);

	const schema = z.object({
		name: z.string().min(3),
		address: z.object({
			city: z.string().min(3)
		}),
		nested1: z.object({
			label: z.string().min(1),
			nested2: z.object({
				label: z.string().min(2),
				nested3: z.object({
					label: z.string().min(3)
				})
			})
		})
	});

	const { form, control } = useFormControl({
		initialValues: {
			name: '',
			address: {
				city: ''
			},
			nested1: {
				label: '',
				nested2: {
					label: '',
					nested3: {
						label: ''
					}
				}
			}
		},
		validator: standardSchemaValidator(schema) as any,
		onSubmit: async (values) => {
			success = null;
			await new Promise((r) => setTimeout(r, 2000));
			console.log(values);
			success = Math.random() > 0.5 ? true : false;
		}
	});
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
				label: 'Nested Validation',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Form - Nested Validation</h1>
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
				<label for="city" class="form-label">Address > City</label>
				<input
					type="text"
					class="form-control {form.errors['address.city'] && 'is-invalid'}"
					id="city"
					placeholder="City"
					use:control={'address.city'}
				/>
				{#if form.errors['address.city']}
					<div class="invalid-feedback">{form.errors['address.city']?.join(', ')}</div>
				{/if}
			</div>

			<div class="mb-3">
				<label for="label" class="form-label">Nested 1 > Label</label>
				<input
					type="text"
					class="form-control {form.errors['nested1.label'] && 'is-invalid'}"
					id="label"
					placeholder="Label"
					use:control={'nested1.label'}
				/>
				{#if form.errors['nested1.label']}
					<div class="invalid-feedback">{form.errors['nested1.label']?.join(', ')}</div>
				{/if}
			</div>

			<div class="mb-3">
				<label for="label" class="form-label">Nested 1 > Nested 2 > Label</label>
				<input
					type="text"
					class="form-control {form.errors['nested1.nested2.label'] && 'is-invalid'}"
					id="label"
					placeholder="Label"
					use:control={'nested1.nested2.label'}
				/>
				{#if form.errors['nested1.nested2.label']}
					<div class="invalid-feedback">{form.errors['nested1.nested2.label']?.join(', ')}</div>
				{/if}
			</div>

			<div class="mb-3">
				<label for="label" class="form-label">Nested 1 > Nested 2 > Nested 3 > Label</label>
				<input
					type="text"
					class="form-control {form.errors['nested1.nested2.nested3.label'] && 'is-invalid'}"
					id="label"
					placeholder="Label"
					use:control={'nested1.nested2.nested3.label'}
				/>
				{#if form.errors['nested1.nested2.nested3.label']}
					<div class="invalid-feedback">
						{form.errors['nested1.nested2.nested3.label']?.join(', ')}
					</div>
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
