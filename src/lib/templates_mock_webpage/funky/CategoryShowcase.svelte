<script lang="ts">
	import { Shirt, Package, Sparkles, Star } from 'lucide-svelte';
	import ImageWithFallback from './ImageWithFallback.svelte';
	
	export let categories: Array<{
		icon: any;
		title: string;
		count: string;
		color: string;
	}> = [];
	export let showcaseImages: string[] = [];
	export let sectionTitle: string = 'Explore Our';
	export let sectionSubtitle: string = 'Categories';
	export let sectionDescription: string = 'From casual to formal, traditional to modern - find your perfect style match.';
	export let primaryColor: string = '#9333ea';
	export let secondaryColor: string = '#ec4899';
</script>

<section class="py-20 px-6 md:px-12 bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 text-white relative overflow-hidden">
	<!-- Animated Background Pattern -->
	<div class="absolute inset-0 opacity-10">
		{#each Array(20) as _, i}
			<div
				class="absolute w-32 h-32 border border-white rounded-full"
				style="left: {Math.random() * 100}%; top: {Math.random() * 100}%;"
			></div>
		{/each}
	</div>

	<div class="container mx-auto relative z-10">
		<div class="grid md:grid-cols-2 gap-12 items-center">
			<!-- Left Side - Image -->
			<div class="relative">
				<div class="absolute -inset-8 rounded-full blur-3xl opacity-40" style="background: linear-gradient(to right, #fbbf24, {secondaryColor}, {primaryColor});"></div>
				<div class="relative grid grid-cols-2 gap-4">
					{#if showcaseImages[0]}
						<div class="rounded-2xl overflow-hidden shadow-2xl">
							<ImageWithFallback
								src={showcaseImages[0]}
								alt="Showcase image 1"
								className="w-full h-64 object-cover"
							/>
						</div>
					{/if}
					{#if showcaseImages[1]}
						<div class="rounded-2xl overflow-hidden shadow-2xl mt-8">
							<ImageWithFallback
								src={showcaseImages[1]}
								alt="Showcase image 2"
								className="w-full h-64 object-cover"
							/>
						</div>
					{/if}
				</div>
			</div>

			<!-- Right Side - Categories -->
			<div class="space-y-8">
				<div>
					<h2 class="text-5xl md:text-6xl mb-4">
						{sectionTitle} <span class="text-yellow-400">{sectionSubtitle}</span>
					</h2>
					<p class="text-purple-200">
						{sectionDescription}
					</p>
				</div>

				<div class="grid grid-cols-2 gap-4">
					{#each categories as category, index}
						<div class="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 cursor-pointer group hover:scale-105 transition-transform">
							<div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style="background-color: {category.color};">
								<svelte:component this={category.icon} class="w-6 h-6 text-white" />
							</div>
							<h3 class="text-white mb-1">{category.title}</h3>
							<p class="text-purple-200 text-sm">{category.count}</p>
						</div>
					{/each}
				</div>

				<div class="flex gap-4 pt-4">
					<div class="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-full">
						<span class="text-yellow-400">⭐ 4.9</span> Rating
					</div>
					<div class="bg-white/20 backdrop-blur-lg px-6 py-3 rounded-full">
						<span class="text-pink-400">🎉 10K+</span> Happy Customers
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

