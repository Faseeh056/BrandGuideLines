<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Sparkles, ArrowRight } from 'lucide-svelte';
	import ImageWithFallback from './ImageWithFallback.svelte';
	
	export let heroImage: string = '';
	export let heroTitle: string = 'BOLD. FUNKY. FEARLESS.';
	export let heroDescription: string = 'Express yourself with fashion that speaks your language. Bold designs, vibrant colors, and fearless style.';
	export let heroBadge: string = 'New Collection 2024';
	export let ctaPrimary: string = 'Shop Now';
	export let ctaSecondary: string = 'Explore';
	export let primaryColor: string = '#9333ea';
	export let secondaryColor: string = '#ec4899';
</script>

<section class="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
	<!-- Animated Background Elements -->
	<div class="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-3xl opacity-60" />
	<div class="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-60" />

	<!-- Navigation -->
	<nav class="relative z-20 flex items-center justify-between px-6 md:px-12 py-6">
		<div class="flex items-center gap-2">
			<Sparkles class="w-8 h-8" style="color: {primaryColor};" />
			<span class="tracking-wider font-bold" style="color: {primaryColor};">FUNKIFY</span>
		</div>
		<div class="hidden md:flex gap-8">
			<a href="#" class="text-gray-700 hover:opacity-70 transition-colors">Men</a>
			<a href="#" class="text-gray-700 hover:opacity-70 transition-colors">Women</a>
			<a href="#" class="text-gray-700 hover:opacity-70 transition-colors">Collections</a>
			<a href="#" class="text-gray-700 hover:opacity-70 transition-colors">About</a>
		</div>
		<Button variant="outline" style="border-color: {primaryColor}; color: {primaryColor};" class="hover:opacity-90">
			Shop Now
		</Button>
	</nav>

	<!-- Hero Content -->
	<div class="relative z-10 container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center mt-12 md:mt-0">
		<div class="space-y-6">
			<div class="inline-block px-4 py-2 rounded-full" style="background: linear-gradient(to right, {primaryColor}, {secondaryColor}); color: white;">
				{heroBadge}
			</div>
			<h1 class="text-6xl md:text-8xl text-gray-900 leading-tight">
				<span class="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
					{heroTitle.split('.')[0]}.
				</span>
				<br />
				<span class="text-gray-800">{heroTitle.split('.')[1]}.</span>
				<br />
				<span class="bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
					{heroTitle.split('.')[2]}.
				</span>
			</h1>
			<p class="text-xl text-gray-600 max-w-lg">
				{heroDescription}
			</p>
			<div class="flex flex-wrap gap-4">
				<Button size="lg" style="background: linear-gradient(to right, {primaryColor}, {secondaryColor});" class="text-white hover:opacity-90">
					{ctaPrimary}
					<ArrowRight class="ml-2 h-4 w-4" />
				</Button>
				<Button size="lg" variant="outline" class="border-2 hover:bg-gray-100">
					{ctaSecondary}
				</Button>
			</div>
		</div>

		<div class="relative">
			<ImageWithFallback
				src={heroImage}
				alt="Hero image"
				className="rounded-3xl shadow-2xl"
			/>
		</div>
	</div>
</section>

