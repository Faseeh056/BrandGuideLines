<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Sparkles, Star, Award, Heart } from 'lucide-svelte';
	import ImageWithFallback from './ImageWithFallback.svelte';
	
	export let heroImages: string[] = [];
	export let heroTitle: string = 'FLAVOR EXPLOSION';
	export let heroSubtitle: string = 'IN EVERY BITE!';
	export let heroDescription: string = '🌟 Handcrafted with passion, served with love. Experience the ultimate food journey that will tantalize your taste buds and leave you craving for more!';
	export let heroBadge: string = 'Premium Quality Since 2020';
	export let ctaPrimary: string = 'Order Now 🍴';
	export let ctaSecondary: string = 'View Menu 📖';
	export let accentColor: string = '#f59e0b';
	export let secondaryColor: string = '#ec4899';
	export let stats: Array<{ value: string; label: string }> = [
		{ value: '500+', label: 'Happy Customers' },
		{ value: '50+', label: 'Signature Dishes' },
		{ value: '4.9★', label: 'Rating' }
	];
</script>

<div class="relative overflow-hidden bg-gradient-to-br from-orange-600 via-rose-600 to-pink-600 min-h-screen">
	<!-- Decorative elements -->
	<div class="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-3xl" />
	<div class="absolute bottom-20 right-20 w-40 h-40 bg-pink-400 rounded-full opacity-20 blur-3xl" />
	
	<div class="relative container mx-auto px-4 py-20">
		<div class="grid lg:grid-cols-2 gap-12 items-center">
			<!-- Left Content -->
			<div class="space-y-8 relative z-10">
				<div class="inline-block px-6 py-2 bg-yellow-400 text-orange-900 rounded-full rotate-2 shadow-lg">
					<span class="flex items-center gap-2">
						<Sparkles class="w-5 h-5" />
						{heroBadge}
					</span>
				</div>
				
				<h1 class="text-7xl lg:text-8xl text-white space-y-2">
					<div class="relative inline-block">
						<span class="relative z-10">{heroTitle}</span>
						<div class="absolute -bottom-2 left-0 w-full h-4 bg-yellow-400 -rotate-1" />
					</div>
					<div class="text-yellow-300">{heroSubtitle}</div>
				</h1>

				<p class="text-xl text-white/90 max-w-lg">
					{heroDescription}
				</p>

				<div class="flex flex-wrap gap-4">
					<Button size="lg" style="background-color: {accentColor};" class="hover:opacity-90 text-lg px-8 py-6 rounded-full">
						{ctaPrimary}
					</Button>
					<Button size="lg" variant="outline" class="bg-white/20 hover:bg-white/30 text-white border-white border-2 backdrop-blur-sm text-lg px-8 py-6 rounded-full">
						{ctaSecondary}
					</Button>
				</div>

				<div class="flex gap-8 pt-4">
					{#each stats as stat}
						<div class="text-center">
							<div class="text-4xl text-yellow-300">{stat.value}</div>
							<div class="text-white/80">{stat.label}</div>
						</div>
						{#if stat !== stats[stats.length - 1]}
							<div class="w-px bg-white/30" />
						{/if}
					{/each}
				</div>
			</div>

			<!-- Right Images -->
			<div class="relative h-[600px] lg:h-[700px]">
				{#if heroImages[0]}
					<div class="absolute top-0 right-0 w-80 h-96 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 border-8 border-white z-10">
						<ImageWithFallback
							src={heroImages[0]}
							alt="Hero image 1"
							className="w-full h-full object-cover"
						/>
					</div>
				{/if}
				{#if heroImages[1]}
					<div class="absolute top-24 left-0 w-64 h-72 rounded-3xl overflow-hidden shadow-2xl transform -rotate-6 border-8 border-yellow-400 z-20">
						<ImageWithFallback
							src={heroImages[1]}
							alt="Hero image 2"
							className="w-full h-full object-cover"
						/>
					</div>
				{/if}
				{#if heroImages[2]}
					<div class="absolute bottom-0 right-20 w-72 h-64 rounded-3xl overflow-hidden shadow-2xl transform rotate-6 border-8 border-pink-400 z-15">
						<ImageWithFallback
							src={heroImages[2]}
							alt="Hero image 3"
							className="w-full h-full object-cover"
						/>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Bottom wave -->
	<div class="absolute bottom-0 left-0 right-0">
		<svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#FFF7ED"/>
		</svg>
	</div>
</div>

