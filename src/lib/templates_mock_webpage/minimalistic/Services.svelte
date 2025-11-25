<script lang="ts">
	import { Sofa, Armchair, Table2, Lamp, Bed, ShoppingBag } from 'lucide-svelte';
	
	export let sectionTitle: string = 'Shop by Category';
	export let sectionDescription: string = 'Every piece designed to enhance your space with minimal aesthetics';
	export let primaryColor: string = '#030213';
	
	export let categories: Array<{
		icon: any;
		title: string;
		description: string;
	}> = [
		{
			icon: Sofa,
			title: 'Sofas',
			description: 'Premium sectionals and couches in monochrome elegance.'
		},
		{
			icon: Armchair,
			title: 'Chairs',
			description: 'Iconic seating designs that blend form and function.'
		},
		{
			icon: Table2,
			title: 'Tables',
			description: 'Dining and coffee tables with clean, minimalist lines.'
		},
		{
			icon: Bed,
			title: 'Beds',
			description: 'Sleek bedroom furniture for restful sanctuaries.'
		},
		{
			icon: Lamp,
			title: 'Lighting',
			description: 'Statement pieces that illuminate with sophistication.'
		},
		{
			icon: ShoppingBag,
			title: 'Accessories',
			description: 'Curated decor items to complete your minimal space.'
		}
	];
</script>

<section class="px-6 py-20 md:py-24">
	<div class="mx-auto max-w-7xl">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-neutral-900">{sectionTitle}</h2>
			<p class="mx-auto max-w-2xl text-neutral-600">
				{sectionDescription}
			</p>
		</div>
		
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each categories as category, index}
				<div
					class="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-300 hover:shadow-xl"
				>
					<div class="mb-4 inline-flex rounded-xl p-3" style="background-color: {primaryColor};">
						{#if category.icon}
							<svelte:component this={category.icon} class="h-6 w-6 text-white" />
						{:else}
							<span class="text-white text-lg">●</span>
						{/if}
					</div>
					<h3 class="mb-3 text-neutral-900">{category.title}</h3>
					<p class="text-neutral-600">{category.description}</p>
					
					<!-- Hover effect gradient -->
					<div class="absolute -bottom-24 -right-24 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-10" style="background-color: {primaryColor};"></div>
				</div>
			{/each}
		</div>
	</div>
</section>

