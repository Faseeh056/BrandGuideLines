<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { Sun, Moon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	let currentTheme: 'light' | 'dark' = 'light';

	onMount(() => {
		// Initialize theme on mount
		theme.init();
		
		// Subscribe to theme changes
		const unsubscribe = theme.subscribe((value) => {
			currentTheme = value;
		});

		return unsubscribe;
	});

	function toggleTheme() {
		theme.toggle();
	}
</script>

<Button
	variant="ghost"
	size="icon"
	onclick={toggleTheme}
	class="relative"
	aria-label="Toggle theme"
	title={currentTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
>
	<Sun
		class="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 dark:text-black"
	/>
	<Moon
		class="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:text-black"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>

<style>
	:global(html.dark) {
		color-scheme: dark;
	}
	
	:global(.dark) :global(button) svg {
		color: black;
		stroke: black;
	}
	
	:global(.dark) :global(button) svg path {
		stroke: black;
		fill: black;
	}
</style>

