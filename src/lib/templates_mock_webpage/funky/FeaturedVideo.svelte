<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Play, Volume2, Maximize } from 'lucide-svelte';
	
	let isPlaying = false;
	
	export let sectionTitle: string = 'Behind The';
	export let sectionSubtitle: string = 'Scenes';
	export let sectionDescription: string = 'Watch our latest fashion show and see how we bring funky fashion to life';
	export let primaryColor: string = '#9333ea';
	export let secondaryColor: string = '#ec4899';
</script>

<section class="py-20 px-6 md:px-12">
	<div class="container mx-auto">
		<div class="text-center mb-12">
			<h2 class="text-5xl md:text-6xl text-gray-900 mb-4">
				{sectionTitle} <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{sectionSubtitle}</span>
			</h2>
			<p class="text-gray-600 max-w-2xl mx-auto">
				{sectionDescription}
			</p>
		</div>

		<div class="relative max-w-5xl mx-auto group">
			<!-- Video Container -->
			<div class="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
				<div class="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900">
					<div class="w-full h-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
						<div class="text-center text-white">
							<div class="relative inline-block mb-6">
								<!-- Pulsing Rings -->
								<div class="absolute inset-0 bg-white rounded-full opacity-30 animate-ping" />
								<div class="absolute inset-0 bg-white rounded-full opacity-20 animate-ping" style="animation-delay: 0.5s;" />
								
								<!-- Play Button -->
								<button
									on:click={() => isPlaying = !isPlaying}
									class="relative w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:opacity-90 transition-all duration-300"
									style="background: {isPlaying ? 'linear-gradient(to right, ' + primaryColor + ', ' + secondaryColor + ')' : 'white'};"
								>
									<Play class="w-8 h-8 ml-1" style="color: {isPlaying ? 'white' : primaryColor};" />
								</button>
							</div>

							<h3 class="mb-2 text-xl">Fashion Show 2024</h3>
							<p class="text-purple-200">Click to watch the runway experience</p>
						</div>
					</div>
				</div>

				<!-- Video Controls Overlay -->
				<div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-4">
							<Button size="sm" variant="ghost" class="text-white hover:opacity-70">
								<Play class="w-4 h-4" />
							</Button>
							<Button size="sm" variant="ghost" class="text-white hover:opacity-70">
								<Volume2 class="w-4 h-4" />
							</Button>
							<span class="text-white text-sm">0:00 / 5:23</span>
						</div>
						<Button size="sm" variant="ghost" class="text-white hover:opacity-70">
							<Maximize class="w-4 h-4" />
						</Button>
					</div>
					
					<!-- Progress Bar -->
					<div class="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
						<div class="h-full transition-all duration-300" style="width: {isPlaying ? '100%' : '0%'}; background: linear-gradient(to right, {primaryColor}, {secondaryColor});"></div>
					</div>
				</div>
			</div>

			<!-- Decorative Elements -->
			<div class="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-50" />
			<div class="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-2xl opacity-50" />
		</div>

		<!-- Stats Below Video -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
			{#each [
				{ label: 'Collections', value: '25+' },
				{ label: 'Designers', value: '50+' },
				{ label: 'Countries', value: '15+' },
				{ label: 'Shows/Year', value: '100+' }
			] as stat}
				<div class="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
					<div class="text-3xl md:text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
						{stat.value}
					</div>
					<div class="text-gray-600">{stat.label}</div>
				</div>
			{/each}
		</div>
	</div>
</section>

