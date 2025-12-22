<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import z from 'zod';
	import { Trash2Icon } from '@lucide/svelte';
	import { useFormControl } from 'svelte-simple-form';
	import { standardSchemaValidator } from '@svelte-simple-form/validators/standard-schema';

	let success = $state<null | boolean>(null);

	const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10MB
	const MAX_GALLERY_SIZE = 5 * 1024 * 1024; // 5MB
	const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

	const schema = z.object({
		name: z.string().min(3),
		photo: z
			.instanceof(File)
			.refine((file) => {
				return (file.size <= MAX_PHOTO_SIZE, 'Max size 10MB');
			})
			.refine((file) => IMAGE_TYPES.includes(file.type), 'Only image allowed'),

		galleries: z
			.array(
				z
					.instanceof(File)
					.refine((file) => file.size <= MAX_GALLERY_SIZE, 'Max size 5MB')
					.refine((file) => {
						return IMAGE_TYPES.includes(file.type);
					}, 'Only images allowed')
			)
			.max(6)
			.optional(),
		cards: z.array(
			z.object({
				label: z.string().min(1),
				file: z
					.instanceof(File)
					.refine((file) => file.size <= MAX_GALLERY_SIZE, 'Max size 5MB')
					.refine((file) => IMAGE_TYPES.includes(file.type), 'Only images allowed')
					.optional()
			})
		)
	});

	const { form, control } = useFormControl({
		initialValues: {
			name: '',
			photo: undefined as File | undefined,
			galleries: [] as File[],
			cards: [] as { label: string; file: File | undefined }[]
		},
		validator: standardSchemaValidator(schema),
		// validator: {
		// 	validateField(field, form) {
		// 		console.log(form.data);
		// 		return true;
		// 	},
		// 	validateForm(form) {
		// 		console.log(form.data);
		// 		return true;
		// 	}
		// },
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
				label: 'File upload Validation',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Form - File upload Validation</h1>
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
				<label for="photo" class="form-label">Photo</label>
				<input
					type="file"
					class="form-control {form.errors.photo && 'is-invalid'}"
					id="photo"
					use:control={'photo'}
				/>
				{form.data.photo?.type}
				{#if form.errors.photo}
					<div class="invalid-feedback">{form.errors.photo?.join(', ')}</div>
				{/if}
			</div>

			<div class="mb-3">
				<label for="galleries" class="form-label">Galleries</label>
				<input
					type="file"
					class="form-control {form.data.galleries
						?.map((_, i) => form.errors[`galleries.${i}`]?.length)
						.some((x) => x) && 'is-invalid'}"
					id="galleries"
					multiple
					use:control={'galleries'}
				/>
				{#each form.data.galleries as _, i}
					{#if form.errors[`galleries.${i}`]}
						<div class="invalid-feedback">
							{_.name.slice(0, 20)}:
							{form.errors[`galleries.${i}`]?.join(', ')}
						</div>
					{/if}
				{/each}
			</div>

			<div class="mb-3">
				<label for="cards" class="form-label">Cards</label>
				<div class="d-flex gap-2 mb-2">
					<button
						type="button"
						class="btn btn-outline-success"
						onclick={() =>
							form.arrayAdd('cards', {
								label: 'Card ' + (form.data.cards?.length + 1),
								file: undefined
							})}
					>
						Add Card
					</button>
				</div>
				<div class="">
					{#each form.data.cards as card, i}
						{@const errorsLabel = form.errors[`cards.${i}.label`]}
						{@const errorsFile = form.errors[`cards.${i}.file`]}
						<div class="input-group" style="margin-top: -1px;">
							<span class="input-group-text" style="width: 40px;">{i + 1}</span>
							<input
								type="text"
								class="form-control {errorsLabel ? 'is-invalid' : ''}"
								placeholder="Label"
								use:control={`cards.${i}.label`}
							/>
							<input
								type="file"
								class="form-control {errorsFile ? 'is-invalid' : ''}"
								use:control={`cards.${i}.file`}
							/>
							<button
								type="button"
								class="btn btn-outline-danger"
								onclick={() => form.arrayRemove('cards', i)}
							>
								<Trash2Icon size={16} />
							</button>
						</div>
						{#if errorsLabel}
							<div class="invalid-feedback d-block mb-2">
								Label: {errorsLabel?.join(', ')}
							</div>
						{/if}
						{#if errorsFile}
							<div class="invalid-feedback d-block mb-2">
								File: {errorsFile?.join(', ')}
							</div>
						{/if}
					{:else}
						<p class="text-muted">No card yet</p>
					{/each}
				</div>
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
