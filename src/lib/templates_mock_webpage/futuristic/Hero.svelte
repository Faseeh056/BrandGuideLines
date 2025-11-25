<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Cpu, ArrowRight, Play, ChevronDown } from 'lucide-svelte';
	import FuturisticCube from './FuturisticCube.svelte';
	
	export let heroImage: string = '';
	export let heroTitle: string = 'The Future of Technology';
	export let heroDescription: string = 'Harness the power of next-generation AI and quantum computing. Transform your business with technology that\'s years ahead.';
	export let heroBadge: string = '🚀 Launching the Future';
	export let ctaPrimary: string = 'Start Your Journey';
	export let ctaSecondary: string = 'Watch Demo';
	export let primaryColor: string = '#3b82f6';
	export let secondaryColor: string = '#9333ea';
	export let stats: Array<{ value: string; label: string }> = [];
	export let brandName: string = 'NEXUS';
</script>

<div class="min-h-screen bg-slate-950 text-white overflow-hidden relative">
	<!-- Background gradient -->
	<div class="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
	
	<!-- Navigation -->
	<nav class="relative z-50 container mx-auto px-6 py-6">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<div class="w-10 h-10 rounded-lg flex items-center justify-center" style="background: linear-gradient(to bottom right, {primaryColor}, {secondaryColor});">
					<Cpu class="w-6 h-6" />
				</div>
				<span class="text-xl font-bold">{brandName}</span>
			</div>
			
			<div class="hidden md:flex items-center gap-8">
				<a href="#features" class="text-slate-300 hover:text-white transition-colors">Features</a>
				<a href="#technology" class="text-slate-300 hover:text-white transition-colors">Technology</a>
				<a href="#about" class="text-slate-300 hover:text-white transition-colors">About</a>
				<Button style="background: linear-gradient(to right, {primaryColor}, {secondaryColor});" class="hover:opacity-90">
					Get Started
				</Button>
			</div>
		</div>
	</nav>

	<!-- Hero Section -->
	<section class="relative container mx-auto px-6 py-8 md:py-12">
		<div class="grid md:grid-cols-2 gap-12 items-center">
			<div>
				<div class="inline-block px-4 py-2 rounded-full mb-6 border" style="background-color: rgba(59, 130, 246, 0.2); border-color: rgba(59, 130, 246, 0.3);">
					<span style="color: #60a5fa;">{heroBadge}</span>
				</div>
				
				<h1 class="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
					{heroTitle}
				</h1>
				
				<p class="text-xl text-slate-300 mb-8">
					{heroDescription}
				</p>
				
				<div class="flex flex-wrap gap-4">
					<Button size="lg" class="gap-2 text-white hover:opacity-90" style="background: linear-gradient(to right, {primaryColor}, {secondaryColor});">
						{ctaPrimary}
						<ArrowRight class="w-5 h-5" />
					</Button>
					
					<Button size="lg" variant="outline" class="border-blue-500/50 hover:bg-blue-500/10 gap-2">
						<Play class="w-5 h-5" />
						{ctaSecondary}
					</Button>
				</div>

				<!-- Stats -->
				{#if stats.length > 0}
					<div class="grid grid-cols-3 gap-6 mt-12">
						{#each stats as stat}
							<div>
								<div class="text-3xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{stat.value}</div>
								<div class="text-slate-400 text-sm">{stat.label}</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Rotating Cube on Right -->
			<div class="relative">
				<FuturisticCube />
			</div>
		</div>

		<!-- Scroll indicator -->
		<div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
			<ChevronDown class="w-8 h-8 text-blue-400" />
		</div>
	</section>
</div>

