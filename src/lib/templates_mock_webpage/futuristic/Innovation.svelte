<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ImageWithFallback from './ImageWithFallback.svelte';
	
	export let innovationImage: string = '';
	export let innovationTitle: string = 'Innovation That Matters';
	export let innovationDescription: string = 'Join thousands of forward-thinking companies already using our platform to revolutionize their operations.';
	export let primaryColor: string = '#3b82f6';
	export let secondaryColor: string = '#9333ea';
</script>

<section class="relative container mx-auto px-6 py-20">
	<div class="relative rounded-3xl overflow-hidden backdrop-blur-sm border border-blue-500/20 p-12 md:p-16" style="background: linear-gradient(to bottom right, rgba(30, 58, 138, 0.3), rgba(88, 28, 135, 0.3));">
		<div class="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-40" style="background: linear-gradient(to bottom right, {primaryColor}30, {secondaryColor}30);"></div>
		
		<div class="relative z-10 grid md:grid-cols-2 gap-12 items-center">
			<div>
				<h2 class="text-4xl md:text-5xl mb-6">{innovationTitle}</h2>
				<p class="text-xl text-slate-300 mb-8">
					{innovationDescription}
				</p>
				<Button size="lg" class="bg-white text-slate-900 hover:bg-slate-100">
					Schedule a Demo
				</Button>
			</div>

			<div class="relative">
				<ImageWithFallback
					src={innovationImage}
					alt="Innovation"
					className="rounded-2xl shadow-2xl"
				/>
			</div>
		</div>
	</div>
</section>

