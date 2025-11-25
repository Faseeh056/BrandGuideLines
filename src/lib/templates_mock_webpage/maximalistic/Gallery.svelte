<script lang="ts">
	import { Instagram, Heart, MessageCircle } from 'lucide-svelte';
	import ImageWithFallback from './ImageWithFallback.svelte';
	
	export let galleryImages: Array<{
		url: string;
		likes?: number;
		comments?: number;
	}> = [];
	export let accentColor: string = '#f59e0b';
	export let secondaryColor: string = '#ec4899';
</script>

<div class="relative py-24 bg-gradient-to-br from-rose-100 via-pink-100 to-orange-100 overflow-hidden">
	<!-- Background decorations -->
	<div class="absolute top-10 right-10 w-80 h-80 bg-pink-400 rounded-full opacity-20 blur-3xl" />
	<div class="absolute bottom-10 left-10 w-80 h-80 bg-orange-400 rounded-full opacity-20 blur-3xl" />

	<div class="container mx-auto px-4">
		<!-- Header -->
		<div class="text-center mb-16 space-y-6">
			<div class="inline-flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl transform rotate-2 text-white" style="background: linear-gradient(to right, {secondaryColor}, #f43f5e, {accentColor});">
				<Instagram class="w-8 h-8" />
				<span class="text-xl">Follow Our Delicious Journey!</span>
			</div>
			
			<h2 class="text-7xl">
				<span style="color: #f43f5e;">INSTAGRAM</span>
				<span class="block" style="color: {accentColor};">FEED 📸</span>
			</h2>
			
			<p class="text-xl text-gray-700">
				Tag us @foodbrand for a chance to be featured! 🌟
			</p>
		</div>

		<!-- Gallery Grid -->
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
			{#each galleryImages as image, index}
				<div
					class="group relative aspect-square rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 hover:rotate-2 transition-all duration-300 border-4 border-white"
				>
					<ImageWithFallback
						src={image.url}
						alt="Gallery image {index + 1}"
						className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
					/>
					
					<!-- Overlay -->
					<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
						<div class="flex gap-6 text-white">
							<div class="flex items-center gap-2">
								<Heart class="w-6 h-6 fill-white" />
								<span>{image.likes || 0}</span>
							</div>
							<div class="flex items-center gap-2">
								<MessageCircle class="w-6 h-6" />
								<span>{image.comments || 0}</span>
							</div>
						</div>
					</div>

					<!-- Corner decoration -->
					<div class="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full shadow-lg" />
				</div>
			{/each}
		</div>

		<!-- CTA -->
		<div class="text-center mt-16">
			<a
				href="https://instagram.com"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-3 px-10 py-5 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-all text-white"
				style="background: linear-gradient(to right, #9333ea, {secondaryColor}, {accentColor});"
			>
				<Instagram class="w-7 h-7" />
				Follow @foodbrand on Instagram
			</a>
		</div>
	</div>
</div>

