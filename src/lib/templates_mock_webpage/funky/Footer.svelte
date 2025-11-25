<script lang="ts">
	import { Sparkles, Instagram, Facebook, Twitter, Youtube } from 'lucide-svelte';
	
	export let brandName: string = 'FUNKIFY';
	export let brandDescription: string = 'Bold. Funky. Fearless. Express yourself with fashion that speaks your language.';
	export let primaryColor: string = '#9333ea';
	export let secondaryColor: string = '#ec4899';
	
	const footerLinks = {
		Shop: ["Men's Collection", "Women's Collection", "Shalwar Kameez", "Suits & Formals", "Casual Wear"],
		About: ["Our Story", "Designers", "Sustainability", "Careers", "Press"],
		Support: ["Contact Us", "FAQs", "Shipping Info", "Returns", "Size Guide"],
		Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"]
	};
	
	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white pt-20 pb-10 px-6 md:px-12">
	<div class="container mx-auto">
		<div class="grid md:grid-cols-5 gap-12 mb-16">
			<!-- Brand Column -->
			<div class="md:col-span-1">
				<div class="space-y-4">
					<div class="flex items-center gap-2">
						<Sparkles class="w-8 h-8 text-yellow-400" />
						<span class="tracking-wider">{brandName}</span>
					</div>
					<p class="text-purple-200 text-sm">
						{brandDescription}
					</p>
					<div class="flex gap-4">
						{#each [
							{ icon: Instagram, color: 'hover:text-pink-400' },
							{ icon: Facebook, color: 'hover:text-blue-400' },
							{ icon: Twitter, color: 'hover:text-cyan-400' },
							{ icon: Youtube, color: 'hover:text-red-400' }
						] as social}
							<a href="#" class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center {social.color} transition-colors">
								<svelte:component this={social.icon} class="w-5 h-5" />
							</a>
						{/each}
					</div>
				</div>
			</div>

			<!-- Links Columns -->
			{#each Object.entries(footerLinks) as [category, links]}
				<div>
					<h4 class="mb-4 text-yellow-400">{category}</h4>
					<ul class="space-y-2">
						{#each links as link}
							<li>
								<a href="#" class="text-purple-200 hover:text-white text-sm transition-colors">
									{link}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<!-- Bottom Bar -->
		<div class="border-t border-white/10 pt-8">
			<div class="flex flex-col md:flex-row justify-between items-center gap-4">
				<p class="text-purple-200 text-sm">
					© {currentYear} {brandName} Fashion. All rights reserved.
				</p>
				<div class="flex gap-6 text-sm text-purple-200">
					<a href="#" class="hover:text-white transition-colors">Privacy</a>
					<a href="#" class="hover:text-white transition-colors">Terms</a>
					<a href="#" class="hover:text-white transition-colors">Cookies</a>
				</div>
			</div>
		</div>

		<!-- Decorative Elements -->
		<div class="absolute bottom-0 left-0 right-0 h-1" style="background: linear-gradient(to right, {primaryColor}, {secondaryColor}, #fbbf24);" />
	</div>
</footer>

