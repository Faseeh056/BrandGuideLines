<script lang="ts">
	import { Star, Quote } from 'lucide-svelte';
	import ImageWithFallback from './ImageWithFallback.svelte';
	
	export let testimonials: Array<{
		name: string;
		role: string;
		image: string;
		text: string;
		rating: number;
	}> = [];
	export let stats: Array<{ value: string; label: string; color: string }> = [];
	export let accentColor: string = '#f59e0b';
	export let secondaryColor: string = '#ec4899';
</script>

<div class="relative py-24 bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 overflow-hidden">
	<!-- Background decorations -->
	<div class="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full opacity-20 blur-3xl" />
	<div class="absolute bottom-20 right-10 w-72 h-72 bg-orange-300 rounded-full opacity-20 blur-3xl" />

	<div class="container mx-auto px-4">
		<!-- Header -->
		<div class="text-center mb-16 space-y-6">
			<div class="inline-block px-8 py-3 rounded-full shadow-xl transform -rotate-2 text-white" style="background: linear-gradient(to right, {secondaryColor}, {accentColor});">
				<span class="text-lg">💖 Customer Love Stories</span>
			</div>
			
			<h2 class="text-7xl">
				<span style="color: {secondaryColor};">WHAT OUR</span>
				<span class="block" style="color: {accentColor};">FANS SAY! 🎉</span>
			</h2>
		</div>

		<!-- Testimonials Grid -->
		<div class="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
			{#each testimonials as testimonial, index}
				<div
					class="relative p-8 bg-white rounded-3xl shadow-2xl border-8 transform hover:scale-105 hover:-rotate-1 transition-all duration-300"
					style="border-color: {index === 0 ? accentColor : index === 1 ? secondaryColor : '#fbbf24'};"
				>
					<!-- Quote icon -->
					<div class="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-xl border-4 border-orange-200">
						<Quote class="w-8 h-8" style="color: {accentColor};" />
					</div>

					<!-- Stars -->
					<div class="flex gap-1 mb-4">
						{#each Array(testimonial.rating) as _}
							<Star class="w-6 h-6 text-yellow-500 fill-yellow-500" />
						{/each}
					</div>

					<!-- Text -->
					<p class="text-gray-700 text-lg mb-6 leading-relaxed">
						"{testimonial.text}"
					</p>

					<!-- Author -->
					<div class="flex items-center gap-4 pt-6 border-t-2 border-gray-100">
						<div class="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg ring-4" style="ring-color: {index === 0 ? accentColor : index === 1 ? secondaryColor : '#fbbf24'};">
							<ImageWithFallback
								src={testimonial.image}
								alt={testimonial.name}
								className="w-full h-full object-cover"
							/>
						</div>
						<div>
							<div class="text-gray-900">{testimonial.name}</div>
							<div class="text-sm text-gray-600">{testimonial.role}</div>
						</div>
					</div>

					<!-- Decorative corner -->
					<div class="absolute bottom-0 right-0 w-20 h-20 rounded-tl-full opacity-10" style="background: linear-gradient(to top left, {index === 0 ? accentColor : index === 1 ? secondaryColor : '#fbbf24'}, transparent);" />
				</div>
			{/each}
		</div>

		<!-- Stats -->
		{#if stats.length > 0}
			<div class="grid md:grid-cols-4 gap-8 mt-20 max-w-5xl mx-auto">
				{#each stats as stat}
					<div class="p-8 rounded-3xl text-white text-center shadow-2xl transform hover:scale-105 transition-transform" style="background: linear-gradient(to bottom right, {stat.color}, {stat.color}dd);">
						<div class="text-5xl mb-2">{stat.value}</div>
						<div class="text-white/90">{stat.label}</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

