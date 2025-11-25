<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Mail, Gift } from 'lucide-svelte';
	
	export let sectionTitle: string = 'Get 20% Off Your First Order! 🎉';
	export let sectionDescription: string = 'Join our funky fashion community and be the first to know about new collections, exclusive deals, and style tips. Plus, get an instant discount!';
	export let primaryColor: string = '#9333ea';
	export let secondaryColor: string = '#ec4899';
</script>

<section class="py-20 px-6 md:px-12">
	<div class="container mx-auto">
		<div class="relative overflow-hidden rounded-3xl p-12 md:p-16 text-white" style="background: linear-gradient(to bottom right, {primaryColor}, {secondaryColor}, #f97316);">
			<!-- Animated Background Shapes -->
			<div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
			<div class="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

			<div class="relative z-10 max-w-3xl mx-auto text-center">
				<div class="inline-block mb-6">
					<div class="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center mx-auto">
						<Gift class="w-10 h-10" />
					</div>
				</div>

				<h2 class="text-4xl md:text-5xl mb-4">
					{sectionTitle}
				</h2>

				<p class="text-purple-100 mb-8 max-w-2xl mx-auto">
					{sectionDescription}
				</p>

				<div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
					<div class="flex-1 relative">
						<Mail class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
						<Input
							type="email"
							placeholder="Enter your email"
							class="pl-12 h-14 rounded-full bg-white text-gray-900 border-none"
						/>
					</div>
					<Button class="h-14 px-8 rounded-full bg-gray-900 hover:bg-gray-800 text-white">
						Subscribe Now
					</Button>
				</div>

				<div class="flex items-center justify-center gap-6 mt-8 text-sm text-purple-100">
					<div class="flex items-center gap-2">
						<div class="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">✓</div>
						No spam
					</div>
					<div class="flex items-center gap-2">
						<div class="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">✓</div>
						Unsubscribe anytime
					</div>
					<div class="flex items-center gap-2">
						<div class="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">✓</div>
						Exclusive deals
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

