<script lang="ts">
	import { Menu, X } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	
	let isMenuOpen = false;
	
	export let brandName: string = 'MONO';
	export let brandInitial: string = 'M';
	export let primaryColor: string = '#030213';
	export let menuItems: string[] = ['Sofas', 'Chairs', 'Tables', 'Collections'];
</script>

<nav class="sticky top-0 z-50 border-b border-neutral-200/50 bg-white/80 backdrop-blur-lg">
	<div class="mx-auto max-w-7xl px-6 py-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<div class="flex h-9 w-9 items-center justify-center rounded-lg" style="background-color: {primaryColor}">
					<span class="text-white">{brandInitial}</span>
				</div>
				<span class="text-neutral-900">{brandName}</span>
			</div>

			<!-- Desktop Menu -->
			<div class="hidden items-center gap-8 md:flex">
				{#each menuItems as item}
					<a href="#" class="text-neutral-600 transition-colors hover:text-neutral-900">
						{item}
					</a>
				{/each}
			</div>

			<div class="hidden items-center gap-4 md:flex">
				<Button variant="ghost" class="text-neutral-600">
					Cart
				</Button>
				<Button style="background-color: {primaryColor};" class="hover:opacity-90">
					Shop Now
				</Button>
			</div>

			<!-- Mobile Menu Button -->
			<button
				class="md:hidden"
				on:click={() => isMenuOpen = !isMenuOpen}
			>
				{#if isMenuOpen}
					<X class="h-6 w-6 text-neutral-900" />
				{:else}
					<Menu class="h-6 w-6 text-neutral-900" />
				{/if}
			</button>
		</div>

		<!-- Mobile Menu -->
		{#if isMenuOpen}
			<div class="mt-4 flex flex-col gap-4 border-t border-neutral-200 pt-4 md:hidden">
				{#each menuItems as item}
					<a href="#" class="text-neutral-600 transition-colors hover:text-neutral-900">
						{item}
					</a>
				{/each}
				<div class="flex flex-col gap-2 pt-2">
					<Button variant="outline">Sign In</Button>
					<Button style="background-color: {primaryColor};" class="hover:opacity-90">
						Get Started
					</Button>
				</div>
			</div>
		{/if}
	</div>
</nav>

