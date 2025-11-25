<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from 'lucide-svelte';
	
	export let brandName: string = 'FOOD BRAND';
	export let brandPart1: string = 'FOOD';
	export let brandPart2: string = 'BRAND';
	export let brandDescription: string = '🌟 Serving happiness one dish at a time since 2020!';
	export let accentColor: string = '#fbbf24';
	export let secondaryColor: string = '#ec4899';
	export let contactAddress: string = '123 Food Street, Culinary City, FC 12345';
	export let contactPhone: string = '+1 (555) 123-4567';
	export let contactEmail: string = 'hello@foodbrand.com';
	
	const currentYear = new Date().getFullYear();
</script>

<footer class="relative bg-gradient-to-br from-gray-900 via-orange-900 to-pink-900 text-white overflow-hidden">
	<!-- Decorative elements -->
	<div class="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full opacity-10 blur-3xl" />
	<div class="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full opacity-10 blur-3xl" />

	<div class="relative container mx-auto px-4 py-16">
		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
			<!-- Brand -->
			<div class="space-y-6">
				<div>
					<h3 class="text-4xl mb-2">
						<span style="color: {accentColor};">{brandPart1}</span>
						<span style="color: {secondaryColor};">{brandPart2}</span>
					</h3>
					<p class="text-white/70">
						{brandDescription}
					</p>
				</div>
				
				<div class="flex gap-4">
					<a href="#" class="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg" style="background: linear-gradient(to bottom right, {accentColor}, {secondaryColor});">
						<Facebook class="w-6 h-6" />
					</a>
					<a href="#" class="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg" style="background: linear-gradient(to bottom right, {secondaryColor}, #9333ea);">
						<Instagram class="w-6 h-6" />
					</a>
					<a href="#" class="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg" style="background: linear-gradient(to bottom right, #3b82f6, #06b6d4);">
						<Twitter class="w-6 h-6" />
					</a>
				</div>
			</div>

			<!-- Quick Links -->
			<div>
				<h4 class="text-2xl mb-6" style="color: {accentColor};">Quick Links 🔗</h4>
				<ul class="space-y-3">
					{#each ['About Us', 'Our Menu', 'Catering', 'Franchise', 'Careers', 'Blog'] as link}
						<li>
							<a href="#" class="text-white/70 hover:opacity-100 transition-colors hover:translate-x-2 inline-block">
								→ {link}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Contact -->
			<div>
				<h4 class="text-2xl mb-6" style="color: {secondaryColor};">Contact Us 📞</h4>
				<ul class="space-y-4">
					<li class="flex items-start gap-3">
						<MapPin class="w-6 h-6 flex-shrink-0 mt-1" style="color: {accentColor};" />
						<span class="text-white/70">{contactAddress}</span>
					</li>
					<li class="flex items-center gap-3">
						<Phone class="w-6 h-6 flex-shrink-0" style="color: {secondaryColor};" />
						<span class="text-white/70">{contactPhone}</span>
					</li>
					<li class="flex items-center gap-3">
						<Mail class="w-6 h-6 flex-shrink-0" style="color: {accentColor};" />
						<span class="text-white/70">{contactEmail}</span>
					</li>
				</ul>
			</div>

			<!-- Newsletter -->
			<div>
				<h4 class="text-2xl mb-6" style="color: {accentColor};">Newsletter 💌</h4>
				<p class="text-white/70 mb-4">
					Subscribe for exclusive deals and updates!
				</p>
				<div class="space-y-3">
					<Input
						type="email"
						placeholder="Your email..."
						class="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full px-6"
					/>
					<Button class="w-full rounded-full py-6 shadow-xl text-white" style="background: linear-gradient(to right, {accentColor}, {secondaryColor});">
						Subscribe Now! 🎉
					</Button>
				</div>
			</div>
		</div>

		<!-- Opening Hours Banner -->
		<div class="rounded-3xl p-8 mb-12 shadow-2xl transform hover:scale-105 transition-transform text-white" style="background: linear-gradient(to right, {accentColor}, {accentColor}dd, {secondaryColor});">
			<div class="text-center space-y-2">
				<h4 class="text-3xl">⏰ Opening Hours</h4>
				<p class="text-white/90 text-xl">Monday - Friday: 9AM - 10PM | Saturday - Sunday: 10AM - 11PM</p>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="border-t border-white/20 pt-8">
			<div class="flex flex-col md:flex-row justify-between items-center gap-4 text-white/60">
				<p class="flex items-center gap-2">
					Made with <Heart class="w-4 h-4 fill-pink-400 animate-pulse" style="color: {secondaryColor};" /> by {brandName} Team
				</p>
				<p>© {currentYear} {brandName}. All rights reserved.</p>
				<div class="flex gap-6">
					<a href="#" class="hover:opacity-100 transition-colors" style="color: {accentColor};">Privacy Policy</a>
					<a href="#" class="hover:opacity-100 transition-colors" style="color: {accentColor};">Terms of Service</a>
				</div>
			</div>
		</div>
	</div>
</footer>

