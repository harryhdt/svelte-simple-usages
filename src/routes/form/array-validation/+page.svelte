<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import z from 'zod';
	import { Trash2Icon } from '@lucide/svelte';
	import { useFormControl } from 'svelte-simple-form';
	import { standardSchemaValidator } from '@svelte-simple-form/validators/standard-schema';

	let success = $state<null | boolean>(null);

	const schema = z.object({
		name: z.string().min(3),
		code: z.array(z.number().min(500)).min(2),
		contacts: z
			.array(
				z.object({
					label: z.string().min(1),
					value: z.string().min(1)
				})
			)
			.optional(),
		encrypt: z.array(z.array(z.number())),
		encrypt2: z.array(
			z.array(
				z.object({
					name: z.string().optional(),
					code: z.number().min(200)
				})
			)
		)
	});
	type Schema = z.infer<typeof schema>;

	const { form, control } = useFormControl<Schema>({
		initialValues: {
			name: '',
			code: [],
			contacts: undefined,
			encrypt: [[]],
			encrypt2: [[]]
		},
		validator: standardSchemaValidator(schema),
		onSubmit: async (values) => {
			success = null;
			await new Promise((r) => setTimeout(r, 2000));
			console.log(values);
			success = Math.random() > 0.5 ? true : false;
		}
	});
	form.setData('encrypt2', [[{ code: 0 }]]);
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
				label: 'Array Validation',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Form - Array Validation</h1>
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
				<label for="code" class="form-label">Code</label>
				<div class="d-flex gap-2 mb-2">
					<button
						type="button"
						class="btn btn-outline-success"
						onclick={() => {
							form.arrayAdd('code', Math.floor(Math.random() * 1000), undefined, {
								shouldValidate: true
							});
						}}
					>
						Add
					</button>
					<button
						type="button"
						class="btn btn-outline-danger"
						onclick={() =>
							form.arrayRemove('code', form.data.code.length - 1, {
								shouldValidate: true
							})}
					>
						Delete
					</button>
				</div>
				<div>
					{#each form.data.code as code, i}
						<span class="badge me-1 {form.errors[`code.${i}`] ? 'bg-danger' : 'bg-success'}">
							{code}
						</span>
					{:else}
						<p class="text-muted">No code yet</p>
					{/each}
				</div>
				{#if form.data.code.length > 3}
					<div class="mt-2">
						<button
							onclick={() => form.arraySwap('code', 0, 3)}
							type="button"
							class="btn btn-sm btn-light border"
						>
							Swap 1 & 4
						</button>
					</div>
				{/if}
				{#if form.errors.code}
					<div class="invalid-feedback d-block">{form.errors.code?.join(', ')}</div>
				{/if}
			</div>
			<div class="mb-3">
				<label for="contacts" class="form-label">Contacts</label>
				<div class="d-flex gap-2 mb-2">
					<button
						type="button"
						class="btn btn-outline-success"
						onclick={() => {
							if (!form.data.contacts) form.setData('contacts', []);
							form.arrayAdd('contacts', {
								label: 'Data ' + ((form.data.contacts?.length || 0) + 1),
								value: ''
							});
						}}
					>
						Add Contact
					</button>
				</div>
				<div class="">
					{#each form.data.contacts as contact, i}
						{@const errorsLabel = form.errors[`contacts.${i}.label`]}
						{@const errorsValue = form.errors[`contacts.${i}.value`]}
						<div class="input-group" style="margin-top: -1px;">
							<span class="input-group-text" style="width: 40px;">{i + 1}</span>
							<input
								type="text"
								class="form-control {errorsLabel ? 'is-invalid' : ''}"
								placeholder="Label"
								use:control={`contacts.${i}.label`}
							/>
							<input
								type="text"
								class="form-control {errorsValue ? 'is-invalid' : ''}"
								placeholder="Value"
								use:control={`contacts.${i}.value`}
							/>
							<button
								type="button"
								class="btn btn-outline-danger"
								onclick={() => form.arrayRemove('contacts', i)}
							>
								<Trash2Icon size={16} />
							</button>
						</div>
						{#if errorsLabel}
							<div class="invalid-feedback d-block mb-2">
								Label: {errorsLabel?.join(', ')}
							</div>
						{/if}
						{#if errorsValue}
							<div class="invalid-feedback d-block mb-2">
								Value: {errorsValue?.join(', ')}
							</div>
						{/if}
					{:else}
						<p class="text-muted">No contacts yet</p>
					{/each}
				</div>
				{#if (form.data.contacts || []).length > 3}
					<div class="mt-2">
						<button
							onclick={() => form.arrayMove('contacts', 0, 3)}
							type="button"
							class="btn btn-sm btn-light border"
						>
							Move no 1 to no 4 (NOT SWAP)
						</button>
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
