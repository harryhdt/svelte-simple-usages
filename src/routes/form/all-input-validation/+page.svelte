<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import z from 'zod';
	import { useFormControl } from 'svelte-simple-form';
	import { standardSchemaValidator } from '@svelte-simple-form/validators/standard-schema';

	let success = $state<null | boolean>(null);

	const schema = z.object({
		name: z.string().min(3),
		email: z.email(),
		password: z.string().min(6),
		age: z.number().min(10),
		gender: z.enum(['male', 'female']),
		hobbies: z.array(z.string()),
		bio: z.string().min(5),
		file: z.any()
	});

	const { form, control } = useFormControl({
		initialValues: {
			name: 'Harry',
			email: 'mail@gmail.com',
			password: '123456',
			age: 10,
			gender: 'male',
			hobbies: [],
			country: '',
			countries: '',
			bio: 'Hello\nWorld',
			file: null // file cannot have default value inside input type=file
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
				label: 'All Input Validation',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Form - All Input Validation</h1>
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

			<!-- Text -->
			<div class="mb-3">
				<label for="name" class="form-label">Name</label>
				<input
					type="text"
					id="name"
					class="form-control {form.errors.name && 'is-invalid'}"
					use:control={'name'}
				/>
				{#if form.errors.name}<div class="invalid-feedback">
						{form.errors.name?.join(', ')}
					</div>{/if}
			</div>

			<!-- Email -->
			<div class="mb-3">
				<label for="email" class="form-label">Email</label>
				<input
					type="email"
					id="email"
					class="form-control {form.errors.email && 'is-invalid'}"
					use:control={'email'}
				/>
				{#if form.errors.email}<div class="invalid-feedback">
						{form.errors.email?.join(', ')}
					</div>{/if}
			</div>

			<!-- Password -->
			<div class="mb-3">
				<label for="password" class="form-label">Password</label>
				<input
					type="password"
					id="password"
					class="form-control {form.errors.password && 'is-invalid'}"
					use:control={'password'}
				/>
				{#if form.errors.password}<div class="invalid-feedback">
						{form.errors.password?.join(', ')}
					</div>{/if}
			</div>

			<!-- Number -->
			<div class="mb-3">
				<label for="age" class="form-label">Age</label>
				<input
					type="number"
					id="age"
					class="form-control {form.errors.age && 'is-invalid'}"
					use:control={{ field: 'age', valueAsNumber: true }}
				/>
				{#if form.errors.age}<div class="invalid-feedback">{form.errors.age?.join(', ')}</div>{/if}
			</div>

			<!-- Select -->
			<div class="mb-3">
				<label for="country" class="form-label">Country</label>
				<select
					id="country"
					class="form-select {form.errors.country && 'is-invalid'}"
					use:control={'country'}
				>
					<option value="">Select Country</option>
					<option value="USA">USA</option>
					<option value="Canada">Canada</option>
					<option value="Mexico">Mexico</option>
					<option value="Brazil">Brazil</option>
					<option value="Argentina">Argentina</option>
				</select>
				{#if form.errors.country}<div class="invalid-feedback">
						{form.errors.country?.join(', ')}
					</div>{/if}
			</div>

			<!-- Select -->
			<div class="mb-3">
				<label for="country" class="form-label">Countries</label>
				<select
					multiple
					id="countries"
					class="form-select {form.errors.countries && 'is-invalid'}"
					use:control={'countries'}
				>
					<option value="">Select Countries</option>
					<option value="USA">USA</option>
					<option value="Canada">Canada</option>
					<option value="Mexico">Mexico</option>
					<option value="Brazil">Brazil</option>
					<option value="Argentina">Argentina</option>
				</select>
				{#if form.errors.country}<div class="invalid-feedback">
						{form.errors.country?.join(', ')}
					</div>{/if}
			</div>

			<!-- Radio -->
			<div class="mb-3">
				<label for="gender" class="form-label">Gender</label>
				<div>
					<label class="form-check-label me-2">
						<input
							type="radio"
							name="gender"
							value="male"
							class="form-check-input"
							use:control={'gender'}
						/> Male
					</label>
					<label class="form-check-label">
						<input
							type="radio"
							name="gender"
							value="female"
							class="form-check-input"
							use:control={'gender'}
						/> Female
					</label>
				</div>
				{#if form.errors.gender}<div class="text-danger">{form.errors.gender?.join(', ')}</div>{/if}
			</div>

			<!-- Checkbox -->
			<div class="mb-3">
				<label for="hobbies" class="form-label">Hobbies</label>
				<div>
					<label class="form-check-label me-2">
						<input
							type="checkbox"
							value="reading"
							class="form-check-input"
							use:control={'hobbies'}
						/> Reading
					</label>
					<label class="form-check-label me-2">
						<input
							type="checkbox"
							value="sports"
							class="form-check-input"
							use:control={'hobbies'}
						/> Sports
					</label>
					<label class="form-check-label">
						<input
							type="checkbox"
							value="coding"
							class="form-check-input"
							use:control={'hobbies'}
						/> Coding
					</label>
				</div>
				{#if form.errors.hobbies}<div class="text-danger">
						{form.errors.hobbies?.join(', ')}
					</div>{/if}
			</div>

			<!-- Textarea -->
			<div class="mb-3">
				<label for="bio" class="form-label">Bio</label>
				<textarea
					id="bio"
					class="form-control {form.errors.bio && 'is-invalid'}"
					use:control={'bio'}
				></textarea>
				{#if form.errors.bio}<div class="invalid-feedback">{form.errors.bio?.join(', ')}</div>{/if}
			</div>

			<!-- ContentEditable -->
			<div class="mb-3">
				<label for="editable-bio" class="form-label">Editable Bio</label>
				<div
					class="border p-2"
					contenteditable="true"
					use:control={'bio'}
					style="min-height: 60px;"
				></div>
			</div>

			<!-- File -->
			<div class="mb-3">
				<label for="file" class="form-label">Upload File</label>
				<input type="file" id="file" class="form-control" use:control={'file'} />
				{#if form.errors.file}<div class="text-danger">{form.errors.file?.join(', ')}</div>{/if}
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
