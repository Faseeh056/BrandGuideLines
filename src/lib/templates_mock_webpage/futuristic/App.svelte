<script lang="ts">
	import AnimatedBackground from './AnimatedBackground.svelte';
	import Hero from './Hero.svelte';
	import Features from './Features.svelte';
	import Technology from './Technology.svelte';
	import Innovation from './Innovation.svelte';
	import CTA from './CTA.svelte';
	import Footer from './Footer.svelte';
	import { Zap, Shield, Cpu, Sparkles } from 'lucide-svelte';
	
	export let brandData: any;
	export let images: {
		hero: string | null;
		gallery: string[];
	};
	export let content: Record<string, any>;
	
	$: brandName = brandData?.brand_name || brandData?.brandName || 'NEXUS';
	$: primaryColor = brandData?.colorPalette?.[0] || '#3b82f6';
	$: secondaryColor = brandData?.colorPalette?.[1] || '#9333ea';
	$: heroImage = images?.hero || '';
	$: techImage = images?.gallery?.[0] || '';
	$: innovationImage = images?.gallery?.[1] || '';
	$: features = content?.features || [];
	$: stats = content?.stats || [
		{ value: '99.9%', label: 'Uptime' },
		{ value: '10M+', label: 'Users' },
		{ value: '500+', label: 'Countries' }
	];
	$: techStats = content?.techStats || [
		{ label: 'Processing Speed', value: 98 },
		{ label: 'Accuracy Rate', value: 99 },
		{ label: 'Efficiency', value: 96 }
	];
</script>

<div class="min-h-screen bg-slate-950 text-white overflow-hidden">
	<AnimatedBackground />
	
	<Hero
		{heroImage}
		heroTitle={content?.heroTitle || 'The Future of Technology'}
		heroDescription={content?.heroDescription || 'Harness the power of next-generation AI and quantum computing. Transform your business with technology that\'s years ahead.'}
		heroBadge={content?.heroBadge || '🚀 Launching the Future'}
		ctaPrimary={content?.ctaPrimary || 'Start Your Journey'}
		ctaSecondary={content?.ctaSecondary || 'Watch Demo'}
		{primaryColor}
		{secondaryColor}
		{stats}
		{brandName}
	/>
	
	<Features
		{features}
		{primaryColor}
		{secondaryColor}
	/>
	
	<Technology
		techImage={techImage}
		techTitle={content?.techTitle || 'Cutting-Edge Technology'}
		techDescription={content?.techDescription || 'Our proprietary quantum neural networks process data at unprecedented speeds, delivering insights in microseconds.'}
		stats={techStats}
		{primaryColor}
		{secondaryColor}
	/>
	
	<Innovation
		innovationImage={innovationImage}
		innovationTitle={content?.innovationTitle || 'Innovation That Matters'}
		innovationDescription={content?.innovationDescription || 'Join thousands of forward-thinking companies already using our platform to revolutionize their operations.'}
		{primaryColor}
		{secondaryColor}
	/>
	
	<CTA
		ctaTitle={content?.ctaTitle || 'Ready to Transform?'}
		ctaDescription={content?.ctaDescription || 'Start your journey into the future. Experience the next evolution of technology.'}
		ctaPrimary={content?.ctaPrimary || 'Get Started Free'}
		ctaSecondary={content?.ctaSecondary || 'Contact Sales'}
		{primaryColor}
		{secondaryColor}
	/>
	
	<Footer
		{brandName}
		brandDescription={content?.footerDescription || 'Building the future of technology, one innovation at a time.'}
		{primaryColor}
		{secondaryColor}
	/>
</div>

