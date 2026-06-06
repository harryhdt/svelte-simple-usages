<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import z from 'zod';
	import { useFormControl } from '$lib/form/form.svelte';
	import { standardSchemaValidator } from '@svelte-simple-form/validators/standard-schema';

	const TAKEN_USERNAMES = ['admin', 'root', 'superuser', 'test', 'demo', 'user'];
	const TAKEN_EMAILS = [
		'admin@example.com',
		'test@example.com',
		'user@example.com',
		'hello@example.com'
	];

	let success = $state<null | boolean>(null);
	let submitCount = $state(0);
	let asyncChecking = $state<Record<string, boolean>>({});

	const initialValues = {
		username: '',
		email: '',
		password: ''
	};

	const schema = z.object({
		username: z.string().min(3, 'Username minimal 3 karakter'),
		email: z.string().email('Email tidak valid'),
		password: z.string().min(6, 'Password minimal 6 karakter')
	});

	const runAsyncCheck = async (field: 'username' | 'email', value: string) => {
		fetch(`/api/check/${field}?value=${encodeURIComponent(value)}`).catch(() => {});

		const taken = field === 'email' ? TAKEN_EMAILS : TAKEN_USERNAMES;
		const label = field === 'email' ? 'Email' : 'Username';
		const delay = 400 + Math.random() * 600;
		await new Promise((r) => setTimeout(r, delay));

		if (taken.includes(value.toLowerCase().trim())) {
			form.setError(field, [`${label} "${value}" sudah digunakan`]);
		} else {
			form.removeError(field);
			form.validateField(field);
		}
		asyncChecking[field] = false;
	};

	const handleAsyncCheck = (field: 'username' | 'email') => {
		const value = form.data[field];
		if (!value) return;

		const fieldSchema = field === 'email' ? z.string().email() : z.string().min(3);
		if (!fieldSchema.safeParse(value).success) return;

		asyncChecking[field] = true;
		runAsyncCheck(field, value);
	};

	const { form, control } = useFormControl({
		initialValues,
		validator: standardSchemaValidator(schema),
		onSubmit: async (values) => {
			success = null;

			const checks = ['username', 'email'] as const;
			let hasAsyncError = false;
			for (const field of checks) {
				asyncChecking[field] = true;
				await runAsyncCheck(field, values[field]);
				if (form.errors[field]?.length) hasAsyncError = true;
			}

			if (hasAsyncError) return;

			submitCount++;
			await new Promise((r) => setTimeout(r, 2000));
			console.log('Submit #' + submitCount, values);
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
				label: 'Async Validation',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Form - Async Validation</h1>
	<p class="text-muted mb-3">
		Demo async validation per-field. Sync rules via Zod + <code>standardSchemaValidator</code>,
		async check (availability) via custom inline handlers.
	</p>
	<div class="row gap-4">
		<form use:form.handler class="col" style="max-width: 512px;">
			{#if success !== null}
				<div
					class="alert {success ? 'alert-success' : 'alert-danger'} alert-dismissible fade show"
					role="alert"
				>
					Submit #{submitCount}: {success ? 'Berhasil' : 'Gagal'}
					<button type="button" class="btn-close" aria-label="Close" data-bs-dismiss="alert"
					></button>
				</div>
			{/if}

			<div class="mb-3">
				<label for="username" class="form-label">
					Username
					{#if asyncChecking.username}
						<span class="spinner-border spinner-border-sm text-primary ms-1" role="status"></span>
					{/if}
				</label>
				<input
					type="text"
					id="username"
					class="form-control {form.errors.username ? 'is-invalid' : ''}"
					placeholder="Cth: john"
					use:control={'username'}
					onblur={() => handleAsyncCheck('username')}
				/>
				{#if form.errors.username}
					<div class="invalid-feedback d-block">{form.errors.username?.join(', ')}</div>
				{/if}
				<small class="text-muted">Taken: admin, root, superuser, test, demo, user</small>
			</div>

			<div class="mb-3">
				<label for="email" class="form-label">
					Email
					{#if asyncChecking.email}
						<span class="spinner-border spinner-border-sm text-primary ms-1" role="status"></span>
					{/if}
				</label>
				<input
					type="email"
					id="email"
					class="form-control {form.errors.email ? 'is-invalid' : ''}"
					placeholder="Cth: john@example.com"
					use:control={'email'}
					onblur={() => handleAsyncCheck('email')}
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
				<small class="text-muted">Submit diklik: {submitCount}x</small>
			</div>
		</form>
		<div class="col bg-light py-2" style="white-space: pre; font-size: 14px;">
			<code>
				{JSON.stringify(
					{
						data: form.data,
						errors: form.errors,
						touched: form.touched,
						dirty: form.dirty,
						isValid: form.isValid,
						isSubmitting: form.isSubmitting,
						isDirty: form.isDirty,
						submitCount
					},
					null,
					2
				)}
			</code>
		</div>
	</div>
</div>
