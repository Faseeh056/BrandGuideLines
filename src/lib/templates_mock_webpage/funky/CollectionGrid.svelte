<script lang="ts">
	import ImageWithFallback from './ImageWithFallback.svelte';
	
	export let collections: Array<{
		title: string;
		description: string;
		image: string;
		color: string;
	}> = [];
	export let sectionTitle: string = 'Featured';
	export let sectionSubtitle: string = 'Collections';
	export let sectionDescription: string = 'Curated styles for every occasion. From boardrooms to celebrations, we\'ve got you covered.';
	export let primaryColor: string = '#9333ea';
	export let secondaryColor: string = '#ec4899';
</script>

<section class="py-20 px-6 md:px-12">
	<div class="container mx-auto">
		<div class="text-center mb-16">
			<h2 class="text-5xl md:text-6xl text-gray-900 mb-4">
				{sectionTitle} <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{sectionSubtitle}</span>
			</h2>
			<p class="text-gray-600 max-w-2xl mx-auto">
				{sectionDescription}
			</p>
		</div>

		<div class="grid md:grid-cols-3 gap-8">
			{#each collections as collection, index}
				<div
					class="group relative overflow-hidden rounded-3xl shadow-xl cursor-pointer"
				>
					<div class="aspect-[3/4] relative">
						<ImageWithFallback
							src={collection.image}
							alt={collection.title}
							className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
						
						<!-- Content -->
						<div class="absolute bottom-0 left-0 right-0 p-6 text-white">
							<p class="text-sm mb-2 opacity-90">{collection.description}</p>
							<h3 class="mb-4 text-xl font-bold">{collection.title}</h3>
							<div class="inline-block px-4 py-2 rounded-full text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300" style="background: {collection.color};">
								Shop Now →
							</div>
						</div>

						<!-- Decorative Corner -->
						<div class="absolute top-4 right-4 w-16 h-16 rounded-full blur-xl opacity-60" style="background: {collection.color};" />
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

