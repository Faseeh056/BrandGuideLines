<script lang="ts">
	import { Cpu } from 'lucide-svelte';
	
	export let brandName: string = 'NEXUS';
	export let brandDescription: string = 'Building the future of technology, one innovation at a time.';
	export let primaryColor: string = '#3b82f6';
	export let secondaryColor: string = '#9333ea';
	
	const currentYear = new Date().getFullYear();
</script>

<footer class="relative border-t border-slate-800 py-12">
	<div class="container mx-auto px-6">
		<div class="grid md:grid-cols-4 gap-8 mb-8">
			<div>
				<div class="flex items-center gap-2 mb-4">
					<div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: linear-gradient(to bottom right, {primaryColor}, {secondaryColor});">
						<Cpu class="w-5 h-5" />
					</div>
					<span>{brandName}</span>
				</div>
				<p class="text-slate-400 text-sm">{brandDescription}</p>
			</div>
			
			<div>
				<div class="mb-4">Product</div>
				<div class="space-y-2 text-sm text-slate-400">
					<div>Features</div>
					<div>Pricing</div>
					<div>Security</div>
					<div>Enterprise</div>
				</div>
			</div>
			
			<div>
				<div class="mb-4">Company</div>
				<div class="space-y-2 text-sm text-slate-400">
					<div>About</div>
					<div>Careers</div>
					<div>Blog</div>
					<div>Press</div>
				</div>
			</div>
			
			<div>
				<div class="mb-4">Connect</div>
				<div class="space-y-2 text-sm text-slate-400">
					<div>Twitter</div>
					<div>LinkedIn</div>
					<div>GitHub</div>
					<div>Discord</div>
				</div>
			</div>
		</div>
		
		<div class="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
			© {currentYear} {brandName}. All rights reserved.
		</div>
	</div>
</footer>

