<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowRight } from 'lucide-svelte';
	
	export let ctaTitle: string = 'Ready to Transform?';
	export let ctaDescription: string = 'Start your journey into the future. Experience the next evolution of technology.';
	export let ctaPrimary: string = 'Get Started Free';
	export let ctaSecondary: string = 'Contact Sales';
	export let primaryColor: string = '#3b82f6';
	export let secondaryColor: string = '#9333ea';
</script>

<section class="relative container mx-auto px-6 py-20">
	<div class="text-center">
		<h2 class="text-4xl md:text-6xl mb-6">{ctaTitle}</h2>
		<p class="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
			{ctaDescription}
		</p>
		
		<div class="flex flex-wrap gap-4 justify-center">
			<Button size="lg" class="gap-2 text-white hover:opacity-90" style="background: linear-gradient(to right, {primaryColor}, {secondaryColor});">
				{ctaPrimary}
				<ArrowRight class="w-5 h-5" />
			</Button>
			
			<Button size="lg" variant="outline" class="border-blue-500/50 hover:bg-blue-500/10 text-slate-300">
				{ctaSecondary}
			</Button>
		</div>

		<!-- Trusted by badges -->
		<div class="mt-16 flex flex-wrap justify-center gap-8 items-center opacity-60">
			<span class="text-slate-400">Trusted by industry leaders worldwide</span>
		</div>
	</div>
</section>

