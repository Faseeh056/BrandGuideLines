<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';

	let isLoading = $state(false);
	let error = $state('');
	let success = $state(false);

	const handleSubmit: SubmitFunction = async ({ formData, cancel }) => {
		isLoading = true;
		error = '';

		try {
			const response = await fetch('/auth/forgot-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: formData.get('email')
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Request failed');
			}

			success = true;
			cancel();
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
			isLoading = false;
			cancel();
		}
	};
</script>

<Card>
	<CardHeader class="text-center">
		<CardTitle class="text-2xl font-bold">Reset your password</CardTitle>
		<CardDescription>
			Enter your email address and we'll send you a link to reset your password
		</CardDescription>
	</CardHeader>
	<CardContent>
		{#if success}
			<div class="space-y-4 text-center">
				<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<svg class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
						></path>
					</svg>
				</div>
				<div>
					<h3 class="mb-2 text-lg font-medium text-foreground">Check your email</h3>
					<p class="mb-4 text-sm text-muted-foreground">
						We've sent a password reset link to your email address. Please check your inbox and
						follow the instructions.
					</p>
				</div>
				<Button variant="outline" href="/auth/login">Back to Sign In</Button>
			</div>
		{:else}
			{#if error}
				<div class="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3">
					<p class="text-sm text-destructive">{error}</p>
				</div>
			{/if}

			<form method="POST" action="/auth/forgot-password" use:enhance={handleSubmit}>
				<div class="space-y-4">
					<div>
						<Label for="email">Email Address</Label>
						<Input
							id="email"
							name="email"
							type="email"
							required
							placeholder="Enter your email"
							class="mt-1"
						/>
					</div>

					<Button type="submit" class="w-full" disabled={isLoading}>
						{isLoading ? 'Sending...' : 'Send Reset Link'}
					</Button>
				</div>
			</form>

			<div class="mt-6 text-center">
				<p class="text-sm text-muted-foreground">
					Remember your password?
					<a href="/auth/login" class="font-medium text-primary hover:text-primary/80"> Sign in </a>
				</p>
			</div>
		{/if}
	</CardContent>
</Card>
