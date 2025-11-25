<script lang="ts">
	import { ChefHat, Leaf, Clock, Heart } from 'lucide-svelte';
	import ImageWithFallback from './ImageWithFallback.svelte';
	
	export let aboutImages: string[] = [];
	export let aboutTitle: string = 'OUR STORY OF';
	export let aboutSubtitle1: string = 'DELICIOUS';
	export let aboutSubtitle2: string = 'EXCELLENCE!';
	export let aboutDescription1: string = '🎨 Born from a passion for creating extraordinary food experiences, we blend traditional recipes with modern culinary innovation. Every dish tells a story, crafted with love and served with pride!';
	export let aboutDescription2: string = '🌈 Our commitment to using only the freshest, locally-sourced ingredients ensures that every bite is bursting with authentic flavors and nutritional goodness.';
	export let accentColor: string = '#f59e0b';
	export let secondaryColor: string = '#ec4899';
</script>

<div class="relative py-24 overflow-hidden bg-gradient-to-br from-orange-50 via-rose-50 to-yellow-50">
	<!-- Background decorations -->
	<div class="absolute top-20 right-10 w-64 h-64 bg-orange-200 rounded-full opacity-20 blur-3xl" />
	<div class="absolute bottom-20 left-10 w-64 h-64 bg-pink-200 rounded-full opacity-20 blur-3xl" />

	<div class="container mx-auto px-4">
		<div class="grid lg:grid-cols-2 gap-16 items-center">
			<!-- Image Collage -->
			<div class="relative h-[600px]">
				{#if aboutImages[0]}
					<div class="absolute top-0 left-0 w-72 h-80 rounded-3xl overflow-hidden shadow-2xl transform -rotate-6 border-8" style="border-color: {accentColor};">
						<ImageWithFallback
							src={aboutImages[0]}
							alt="About image 1"
							className="w-full h-full object-cover"
						/>
					</div>
				{/if}
				{#if aboutImages[1]}
					<div class="absolute top-32 right-0 w-80 h-72 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 border-8 z-10" style="border-color: {secondaryColor};">
						<ImageWithFallback
							src={aboutImages[1]}
							alt="About image 2"
							className="w-full h-full object-cover"
						/>
					</div>
				{/if}
				{#if aboutImages[2]}
					<div class="absolute bottom-0 left-16 w-64 h-64 rounded-3xl overflow-hidden shadow-2xl transform rotate-6 border-8 z-20" style="border-color: #fbbf24;">
						<ImageWithFallback
							src={aboutImages[2]}
							alt="About image 3"
							className="w-full h-full object-cover"
						/>
					</div>
				{/if}

				<!-- Floating badge -->
				<div class="absolute top-10 right-10 rounded-full p-6 shadow-2xl transform rotate-12 z-30 text-white" style="background: linear-gradient(to bottom right, {accentColor}, {secondaryColor});">
					<ChefHat class="w-12 h-12" />
				</div>
			</div>

			<!-- Content -->
			<div class="space-y-8">
				<div class="flex flex-wrap gap-3">
					<div class="px-4 py-2 text-sm rounded-full text-white" style="background-color: {accentColor};">
						🌟 Award Winning
					</div>
					<div class="px-4 py-2 text-sm rounded-full text-white" style="background-color: {secondaryColor};">
						💯 100% Fresh
					</div>
					<div class="px-4 py-2 text-sm rounded-full text-white" style="background-color: #fbbf24;">
						🏆 Top Rated
					</div>
				</div>

				<div>
					<h2 class="text-6xl mb-4" style="color: {accentColor}dd;">
						{aboutTitle}
						<span class="block" style="color: {secondaryColor};">{aboutSubtitle1}</span>
						<span class="block" style="color: {accentColor};">{aboutSubtitle2}</span>
					</h2>
				</div>

				<div class="space-y-4 text-lg text-gray-700">
					<p class="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border-l-8 shadow-lg" style="border-color: {accentColor};">
						{aboutDescription1}
					</p>
					
					<p class="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border-l-8 shadow-lg" style="border-color: {secondaryColor};">
						{aboutDescription2}
					</p>
				</div>

				<div class="grid grid-cols-2 gap-6">
					<div class="p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-transform" style="background: linear-gradient(to bottom right, {accentColor}, {accentColor}dd);">
						<ChefHat class="w-12 h-12 mb-3" />
						<h3 class="text-2xl mb-2">Master Chefs</h3>
						<p class="text-white/90">Award-winning culinary experts</p>
					</div>

					<div class="p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-transform" style="background: linear-gradient(to bottom right, {secondaryColor}, {secondaryColor}dd);">
						<Leaf class="w-12 h-12 mb-3" />
						<h3 class="text-2xl mb-2">Fresh Daily</h3>
						<p class="text-white/90">Farm to table goodness</p>
					</div>

					<div class="p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-transform" style="background: linear-gradient(to bottom right, #fbbf24, #fbbf24dd);">
						<Clock class="w-12 h-12 mb-3" />
						<h3 class="text-2xl mb-2">Quick Service</h3>
						<p class="text-white/90">Fast & efficient delivery</p>
					</div>

					<div class="p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-transform" style="background: linear-gradient(to bottom right, #f43f5e, #f43f5edd);">
						<Heart class="w-12 h-12 mb-3" />
						<h3 class="text-2xl mb-2">Made with Love</h3>
						<p class="text-white/90">Every dish is special</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

