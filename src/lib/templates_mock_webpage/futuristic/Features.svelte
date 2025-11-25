<script lang="ts">
	import FeatureCard from './FeatureCard.svelte';
	import { Zap, Shield, Cpu, Sparkles } from 'lucide-svelte';
	
	export let features: Array<{
		icon: any;
		title: string;
		description: string;
	}> = [];
	export let primaryColor: string = '#3b82f6';
	export let secondaryColor: string = '#9333ea';
	
	$: defaultFeatures = features.length > 0 ? features : [
		{ icon: Zap, title: 'Lightning Fast', description: 'Experience blazing speed with our cutting-edge infrastructure powered by quantum algorithms.' },
		{ icon: Shield, title: 'Ultra Secure', description: 'Military-grade encryption and blockchain verification keep your data impenetrable.' },
		{ icon: Cpu, title: 'AI-Powered', description: 'Advanced machine learning adapts to your needs, delivering personalized intelligence.' },
		{ icon: Sparkles, title: 'Next-Gen UX', description: 'Intuitive interfaces merged with augmented reality for seamless interaction.' }
	];
</script>

<section id="features" class="relative container mx-auto px-6 py-20">
	<div class="text-center mb-16">
		<h2 class="text-4xl md:text-5xl mb-4">Powerful Features</h2>
		<p class="text-xl text-slate-400">Built for tomorrow, available today</p>
	</div>

	<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each defaultFeatures as feature, index}
			<FeatureCard
				icon={feature.icon}
				title={feature.title}
				description={feature.description}
				{index}
				{primaryColor}
				{secondaryColor}
			/>
		{/each}
	</div>
</section>

