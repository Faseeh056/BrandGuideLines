<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Star, ShoppingCart } from 'lucide-svelte';
	import ImageWithFallback from './ImageWithFallback.svelte';
	
	export let products: Array<{
		name: string;
		description: string;
		price: string;
		image: string;
		badge?: string;
		rating?: number;
	}> = [];
	export let sectionTitle: string = 'SIGNATURE CREATIONS';
	export let sectionSubtitle: string = '✨';
	export let sectionDescription: string = '🎯 Handpicked favorites that will make your taste buds dance with joy!';
	export let accentColor: string = '#f59e0b';
	export let secondaryColor: string = '#ec4899';
</script>

<div class="relative py-24 bg-gradient-to-br from-yellow-50 via-orange-50 to-rose-50 overflow-hidden">
	<!-- Background decorations -->
	<div class="absolute top-10 left-20 w-96 h-96 bg-orange-300 rounded-full opacity-10 blur-3xl" />
	<div class="absolute bottom-20 right-20 w-96 h-96 bg-pink-300 rounded-full opacity-10 blur-3xl" />

	<div class="container mx-auto px-4">
		<!-- Header -->
		<div class="text-center mb-16 space-y-6">
			<div class="inline-block">
				<div class="px-6 py-3 text-lg shadow-xl rounded-full text-white" style="background: linear-gradient(to right, {accentColor}, {secondaryColor});">
					⚡ Our Menu Highlights
				</div>
			</div>
			
			<h2 class="text-7xl">
				<span style="color: {accentColor};">{sectionTitle}</span>
				<span class="block" style="color: {secondaryColor};">{sectionSubtitle}</span>
			</h2>
			
			<p class="text-xl text-gray-700 max-w-2xl mx-auto">
				{sectionDescription}
			</p>
		</div>

		<!-- Products Grid -->
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each products as product, index}
				<div
					class="group relative bg-white rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 border-8 border-transparent hover:border-orange-200"
				>
					{#if product.badge}
						<div class="absolute top-4 left-4 z-20">
							<div class="px-4 py-2 shadow-xl rounded-full text-white text-sm" style="background: linear-gradient(to right, {accentColor}, {secondaryColor});">
								{product.badge}
							</div>
						</div>
					{/if}

					<!-- Image -->
					<div class="relative h-64 overflow-hidden">
						<ImageWithFallback
							src={product.image}
							alt={product.name}
							className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
					</div>

					<!-- Content -->
					<div class="p-6 space-y-4">
						{#if product.rating}
							<div class="flex items-center gap-2">
								{#each Array(5) as _, i}
									<Star
										class="w-5 h-5 {i < Math.floor(product.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}"
									/>
								{/each}
								<span class="text-sm text-gray-600">({product.rating})</span>
							</div>
						{/if}

						<h3 class="text-2xl text-gray-900">{product.name}</h3>
						
						<p class="text-gray-600">{product.description}</p>

						<div class="flex items-center justify-between pt-4 border-t-2 border-orange-100">
							<div class="text-3xl" style="color: {accentColor};">{product.price}</div>
							<Button class="rounded-full px-6 shadow-lg text-white" style="background: linear-gradient(to right, {accentColor}, {secondaryColor});">
								<ShoppingCart class="w-5 h-5 mr-2" />
								Add to Cart
							</Button>
						</div>
					</div>

					<!-- Decorative corner -->
					<div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-orange-200 to-transparent rounded-tl-full opacity-20" />
				</div>
			{/each}
		</div>

		<!-- CTA -->
		<div class="text-center mt-16">
			<Button size="lg" class="px-12 py-6 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-transform text-white" style="background: linear-gradient(to right, {accentColor}, {secondaryColor}, #f43f5e);">
				View Full Menu 📋
			</Button>
		</div>
	</div>
</div>

