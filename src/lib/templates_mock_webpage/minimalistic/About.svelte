<script lang="ts">
	import ImageWithFallback from './ImageWithFallback.svelte';
	import { CheckCircle2 } from 'lucide-svelte';
	
	export let aboutImage: string = '';
	export let aboutTitle: string = 'Why Choose MONO';
	export let aboutDescription: string = 'We believe in the philosophy of less is more. Our furniture collection embodies timeless design, exceptional quality, and the perfect balance of black and white aesthetics.';
	export let features: string[] = [
		'Handcrafted with premium materials',
		'Timeless monochrome design',
		'Free shipping on all orders',
		'30-day easy returns',
		'Lifetime warranty on select pieces',
		'Expert interior design consultation'
	];
	export let primaryColor: string = '#030213';
</script>

<section class="bg-neutral-50 px-6 py-20 md:py-24">
	<div class="mx-auto max-w-7xl">
		<div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
			<div class="relative order-2 lg:order-1">
				<ImageWithFallback
					src={aboutImage}
					alt="About section image"
					className="relative rounded-2xl shadow-xl"
				/>
			</div>
			
			<div class="order-1 lg:order-2">
				<h2 class="mb-6 text-neutral-900">{aboutTitle}</h2>
				<p class="mb-8 text-neutral-600">
					{aboutDescription}
				</p>
				
				<div class="space-y-4">
					{#each features as item}
						<div class="flex items-start gap-3">
							<div class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style="background-color: {primaryColor};">
								<CheckCircle2 class="h-4 w-4 text-white" />
							</div>
							<span class="text-neutral-700">{item}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

