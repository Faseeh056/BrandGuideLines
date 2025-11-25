<script lang="ts">
	import { Github, Twitter, Linkedin, Mail } from 'lucide-svelte';
	
	export let brandName: string = 'MONO';
	export let brandInitial: string = 'M';
	export let brandDescription: string = 'Minimalist furniture for modern living.';
	export let primaryColor: string = '#030213';
	
	const currentYear = new Date().getFullYear();
</script>

<footer class="border-t border-neutral-200 bg-neutral-50 px-6 py-16">
	<div class="mx-auto max-w-7xl">
		<div class="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
			<!-- Brand -->
			<div>
				<div class="mb-4 flex items-center gap-2">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg" style="background-color: {primaryColor};">
						<span class="text-white">{brandInitial}</span>
					</div>
					<span class="text-neutral-900">{brandName}</span>
				</div>
				<p class="mb-6 text-neutral-600">
					{brandDescription}
				</p>
				<div class="flex gap-4">
					<a href="#" class="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-all hover:border-neutral-300 hover:text-neutral-900">
						<Twitter class="h-4 w-4" />
					</a>
					<a href="#" class="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-all hover:border-neutral-300 hover:text-neutral-900">
						<Github class="h-4 w-4" />
					</a>
					<a href="#" class="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-all hover:border-neutral-300 hover:text-neutral-900">
						<Linkedin class="h-4 w-4" />
					</a>
					<a href="#" class="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-all hover:border-neutral-300 hover:text-neutral-900">
						<Mail class="h-4 w-4" />
					</a>
				</div>
			</div>

			<!-- Products -->
			<div>
				<div class="mb-4 text-neutral-900">Products</div>
				<div class="flex flex-col gap-3">
					<a href="#" class="text-neutral-600 transition-colors hover:text-neutral-900">
						Web Development
					</a>
					<a href="#" class="text-neutral-600 transition-colors hover:text-neutral-900">
						Mobile Apps
					</a>
					<a href="#" class="text-neutral-600 transition-colors hover:text-neutral-900">
						Cloud Services
					</a>
					<a href="#" class="text-neutral-600 transition-colors hover:text-neutral-900">
						AI Solutions
					</a>
				</div>
			</div>

			<!-- Company -->
			<div>
				<div class="mb-4 text-neutral-900">Company</div>
				<div class="flex flex-col gap-3">
					<a href="#" class="text-neutral-600 transition-colors hover:text-neutral-900">
						About Us
					</a>
					<a href="#" class="text-neutral-600 transition-colors hover:text-neutral-900">
						Careers
					</a>
					<a href="#" class="text-neutral-600 transition-colors hover:text-neutral-900">
						Blog
					</a>
					<a href="#" class="text-neutral-600 transition-colors hover:text-neutral-900">
						Press Kit
					</a>
				</div>
			</div>

			<!-- Resources -->
			<div>
				<div class="mb-4 text-neutral-900">Resources</div>
				<div class="flex flex-col gap-3">
					<a href="#" class="text-neutral-600 transition-colors hover:text-neutral-900">
						Documentation
					</a>
					<a href="#" class="text-neutral-600 transition-colors hover:text-neutral-900">
						Support
					</a>
					<a href="#" class="text-neutral-600 transition-colors hover:text-neutral-900">
						Privacy Policy
					</a>
					<a href="#" class="text-neutral-600 transition-colors hover:text-neutral-900">
						Terms of Service
					</a>
				</div>
			</div>
		</div>

		<div class="mt-12 border-t border-neutral-200 pt-8 text-center text-neutral-500">
			© {currentYear} {brandName}. All rights reserved.
		</div>
	</div>
</footer>

