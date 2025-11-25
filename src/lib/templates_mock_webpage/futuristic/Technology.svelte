<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ImageWithFallback from './ImageWithFallback.svelte';
	
	export let techImage: string = '';
	export let techTitle: string = 'Cutting-Edge Technology';
	export let techDescription: string = 'Our proprietary quantum neural networks process data at unprecedented speeds, delivering insights in microseconds.';
	export let stats: Array<{ label: string; value: number }> = [];
	export let primaryColor: string = '#3b82f6';
	export let secondaryColor: string = '#9333ea';
</script>

<section id="technology" class="relative container mx-auto px-6 py-20">
	<div class="grid md:grid-cols-2 gap-12 items-center">
		<div class="relative">
			<div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
			<ImageWithFallback
				src={techImage}
				alt="Technology"
				className="relative rounded-2xl shadow-2xl"
			/>
		</div>

		<div>
			<h2 class="text-4xl md:text-5xl mb-6">{techTitle}</h2>
			<p class="text-xl text-slate-300 mb-6">
				{techDescription}
			</p>
			
			<div class="space-y-4 mb-8">
				{#each stats as stat, i}
					<div>
						<div class="flex justify-between mb-2">
							<span class="text-slate-300">{stat.label}</span>
							<span class="text-blue-400">{stat.value}%</span>
						</div>
						<div class="h-2 bg-slate-800 rounded-full overflow-hidden">
							<div class="h-full rounded-full transition-all duration-1000" style="width: {stat.value}%; background: linear-gradient(to right, {primaryColor}, {secondaryColor});"></div>
						</div>
					</div>
				{/each}
			</div>

			<Button style="background: linear-gradient(to right, {primaryColor}, {secondaryColor});" class="hover:opacity-90">
				Explore Technology
			</Button>
		</div>
	</div>
</section>

