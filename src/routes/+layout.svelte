<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { theme } from '$lib/stores/theme';
	import { browser } from '$app/environment';

	let { children } = $props();

	// Initialize theme immediately if in browser
	if (browser) {
		theme.init();
	}
</script>

<svelte:head>
	<title>EternaBrand - AI Brand Guideline Assistant</title>
	<meta
		name="description"
		content="Generate complete brand guidelines, audit websites, and create branded content with AI"
	/>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
