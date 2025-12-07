<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { useForm } from 'svelte-simple-form';

	let success = $state<null | boolean>(null);

	const { form } = useForm({
		initialValues: {
			name: '',
			email: '',
			age: 10
		},
		onSubmit: async (values) => {
			success = null;
			await new Promise((r) => setTimeout(r, 2000));
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
				label: 'Basic',
				current: true
			}
		]}
	/>
	<h1 class="fs-3 fw-semibold mt-2 mb-3">Form - Basic</h1>
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
					class="form-control"
					id="name"
					placeholder="Name"
					bind:value={form.data.name}
				/>
			</div>
			<div class="mb-3">
				<label for="email" class="form-label">Email</label>
				<input
					type="email"
					class="form-control"
					id="email"
					placeholder="Email"
					bind:value={form.data.email}
				/>
			</div>
			<div class="mb-3">
				<label for="age" class="form-label">Age</label>
				<input
					type="number"
					class="form-control"
					id="age"
					placeholder="Age"
					bind:value={form.data.age}
				/>
			</div>
			<button type="submit" class="btn btn-primary" disabled={form.isSubmitting}>
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
