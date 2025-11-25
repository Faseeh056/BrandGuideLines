<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import ImageWithFallback from './ImageWithFallback.svelte';
	
	export let heroImage: string = '';
	export let heroTitle: string = 'Pure Design, Timeless Comfort';
	export let heroDescription: string = 'Discover our curated collection of minimalist furniture. Each piece crafted in classic black and white to bring elegance and simplicity to your space.';
	export let heroBadge: string = 'Minimal Living Collection';
	export let ctaPrimary: string = 'Explore Collection';
	export let ctaSecondary: string = 'View Lookbook';
	export let primaryColor: string = '#030213';
	export let stats: Array<{ value: string; label: string }> = [
		{ value: '500+', label: 'Products' },
		{ value: '50k+', label: 'Happy Homes' },
		{ value: 'Free', label: 'Delivery' }
	];
</script>

<section class="relative overflow-hidden px-6 py-12 md:py-16">
	<div class="mx-auto max-w-7xl">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<div>
				<div class="mb-6 inline-block rounded-full border border-neutral-200 px-4 py-1.5 text-neutral-600">
					{heroBadge}
				</div>
				
				<h1 class="mb-6 text-neutral-900">
					{heroTitle}
				</h1>
				
				<p class="mb-8 max-w-xl text-neutral-600">
					{heroDescription}
				</p>
				
				<div class="flex flex-wrap items-center gap-4">
					<Button style="background-color: {primaryColor};" class="hover:opacity-90">
						{ctaPrimary}
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
					<Button variant="outline" class="border-neutral-300 text-neutral-900 hover:bg-neutral-50">
						{ctaSecondary}
					</Button>
				</div>

				<!-- Stats -->
				<div class="mt-12 grid grid-cols-3 gap-8 border-t border-neutral-200 pt-8">
					{#each stats as stat}
						<div>
							<div class="mb-1 text-neutral-900">
								{stat.value}
							</div>
							<div class="text-neutral-600">{stat.label}</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="relative">
				<ImageWithFallback
					src={heroImage}
					alt="Hero image"
					className="relative rounded-2xl shadow-xl"
				/>
			</div>
		</div>
	</div>
</section>

