<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import z from 'zod';
	import { useFormControl } from '$lib/form/form.svelte';
	import { standardSchemaValidator } from '@svelte-simple-form/validators/standard-schema';

	const TAKEN_USERNAMES = ['admin', 'root', 'superuser', 'test', 'demo', 'user'];
	const TAKEN_EMAILS = ['admin@example.com', 'test@example.com', 'user@example.com', 'hello@example.com'];

	let success = $state<null | boolean>(null);
	let submitCount = $state(0);
	let blockedBySubmitting = $state(false);
	let validationDuration = $state(0);
	const initialValues = {
		username: '',
		email: '',
		password: ''
	};

	const schema = z
		.object({
			username: z.string().min(3, 'Username minimal 3 karakter'),
			email: z.string().email('Email tidak valid'),
			password: z.string().min(6, 'Password minimal 6 karakter')
		})
		.refine(
			async (data) => {
				await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1000));

				if (TAKEN_USERNAMES.includes(data.username.toLowerCase().trim())) return false;
				if (TAKEN_EMAILS.includes(data.email.toLowerCase().trim())) return false;
				return true;
			},
			{
				message: 'Username atau email sudah digunakan',
				path: ['_form']
			}
		);

	const { form, control } = useFormControl({
		initialValues,
		validator: standardSchemaValidator(schema),
		validateOn: ['submit'],
		onSubmit: async (values) => {
			success = null;
			const start = performance.now();

			submitCount++;
			await new Promise((r) => setTimeout(r, 1500));
			validationDuration = Math.round(performance.now() - start);
			console.log('Submit #' + submitCount, values);
			success = Math.random() > 0.5 ? true : false;
		}
	});

	function handleClick() {
		if (form.isSubmitting) blockedBySubmitting = true;
	}
</script>

<div class="p-2">
	<Breadcrumb
		items={[
			{ label: 'Home', href: '/' },
			{ label: 'Test', href: '/test' },
			{ label: 'Form', href: '/test/form' },
			{ label: 'Async Double Submit', current: true }
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Async Double Submit</h1>

	<div class="alert alert-info">
		<strong>Cara test:</strong> isi form valid lalu <strong>klik Submit cepat 2x</strong>.
		Tombol <strong>tidak di-disable</strong> — klik ke-2 harus ditolak oleh guard
		<code>if (form.isSubmitting) return</code> di library.
		Muncul alert ✅ hijau kalo berhasil ditolak.
	</div>

	<div class="row gap-4">
		<form use:form.handler class="col" style="max-width: 512px;">
			{#if success !== null}
				<div
					class="alert {success ? 'alert-success' : 'alert-danger'} alert-dismissible fade show"
					role="alert"
				>
					Submit #{submitCount}: {success ? 'Berhasil' : 'Gagal'} ({validationDuration}ms)
					<button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="alert"
					></button>
				</div>
			{/if}

			{#if (form.errors as Record<string, string[] | undefined>)['_form']}
				<div class="alert alert-warning">{(form.errors as Record<string, string[] | undefined>)['_form']?.join(', ')}</div>
			{/if}

			{#if blockedBySubmitting}
				<div class="alert alert-success">
					✅ Klik kedua ditolak! Guard <code>isSubmitting</code> berfungsi.
				</div>
			{/if}

			<div class="mb-3">
				<label for="username" class="form-label">Username</label>
				<input
					type="text"
					id="username"
					class="form-control {form.errors.username ? 'is-invalid' : ''}"
					placeholder="Cth: john"
					use:control={'username'}
				/>
				{#if form.errors.username}
					<div class="invalid-feedback d-block">{form.errors.username?.join(', ')}</div>
				{/if}
				<small class="text-muted">Taken: admin, root, superuser, test, demo, user</small>
			</div>

			<div class="mb-3">
				<label for="email" class="form-label">Email</label>
				<input
					type="email"
					id="email"
					class="form-control {form.errors.email ? 'is-invalid' : ''}"
					placeholder="Cth: john@example.com"
					use:control={'email'}
				/>
				{#if form.errors.email}
					<div class="invalid-feedback d-block">{form.errors.email?.join(', ')}</div>
				{/if}
				<small class="text-muted">Taken: admin@, test@, user@, hello@example.com</small>
			</div>

			<div class="mb-3">
				<label for="password" class="form-label">Password</label>
				<input
					type="password"
					id="password"
					class="form-control {form.errors.password ? 'is-invalid' : ''}"
					placeholder="Minimal 6 karakter"
					use:control={'password'}
				/>
				{#if form.errors.password}
					<div class="invalid-feedback d-block">{form.errors.password?.join(', ')}</div>
				{/if}
			</div>

			<div class="d-flex gap-2 align-items-center">
				<button
					type="submit"
					class="btn btn-primary"
					onclick={handleClick}
				>
					{#if form.isSubmitting}
						<div class="spinner-border text-white spinner-border-sm" role="status">
							<span class="visually-hidden">Validating...</span>
						</div>
						Validating...
					{:else}
						Submit
					{/if}
				</button>
				<button type="button" class="btn btn-danger" onclick={() => form.reset()}> Reset </button>
				<small class="text-muted">Submit diklik: {submitCount}x</small>
			</div>
		</form>

		<div class="col bg-light py-2" style="white-space: pre; font-size: 14px;">
			<code>
				{JSON.stringify(
					{
						data: form.data,
						errors: form.errors,
						isValid: form.isValid,
						isSubmitting: form.isSubmitting,
						isDirty: form.isDirty,
						submitCount,
						blockedBySubmitting
					},
					null,
					2
				)}
			</code>
		</div>
	</div>
</div>
