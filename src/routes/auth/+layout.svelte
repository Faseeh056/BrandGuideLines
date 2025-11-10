<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 px-4 py-12 sm:px-6 lg:px-8"
>
	<div class="absolute top-4 right-4 z-10">
		<ThemeToggle />
	</div>
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<h1 class="mb-2 text-4xl font-bold text-foreground">EternaBrand</h1>
			<p class="text-lg font-medium text-primary">AI Brand Guideline Assistant</p>
		</div>

		<div class="rounded-lg bg-card px-6 py-8 shadow-xl border border-border">
			<slot />
		</div>

		<div class="text-center">
			<p class="text-sm text-muted-foreground">
				<a href="/" class="font-medium text-primary hover:text-primary/80"> ← Back to Home </a>
			</p>
		</div>
	</div>
</div>

<style>
	/* Global styles */
	:global(html, body) {
		height: 100%;
		font-family: 'Inter', sans-serif;
	}

	:global(body) {
		margin: 0;
	}
</style>
