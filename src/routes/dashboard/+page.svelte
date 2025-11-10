<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { ArrowRight, Palette, Search, Sparkles, TrendingUp } from 'lucide-svelte';

	let { data } = $props();
</script>

<div class="max-w-6xl">
	<!-- Welcome Header -->
	<div class="mb-8">
		<h1 class="mb-2 text-3xl font-bold text-foreground">
			Welcome back, {data?.user?.name || 'User'}!
		</h1>
		<p class="text-muted-foreground">Ready to create amazing brand experiences? Let's get started.</p>
	</div>

	<!-- Quick Stats -->
	<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
		<Card>
			<CardHeader class="pb-2">
				<CardTitle class="text-sm font-medium text-muted-foreground">Brand Guidelines</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-foreground">3</div>
				<p class="flex items-center text-xs text-muted-foreground">
					<TrendingUp class="mr-1 h-3 w-3 text-primary" />
					+2 this month
				</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader class="pb-2">
				<CardTitle class="text-sm font-medium text-muted-foreground">Audits Completed</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-foreground">12</div>
				<p class="flex items-center text-xs text-muted-foreground">
					<TrendingUp class="mr-1 h-3 w-3 text-primary" />
					+5 this week
				</p>
			</CardContent>
		</Card>

		<Card>
			<CardHeader class="pb-2">
				<CardTitle class="text-sm font-medium text-muted-foreground">Creatives Generated</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold text-foreground">47</div>
				<p class="flex items-center text-xs text-muted-foreground">
					<TrendingUp class="mr-1 h-3 w-3 text-primary" />
					+15 this week
				</p>
			</CardContent>
		</Card>
	</div>

	<!-- Quick Actions -->
	<div class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-foreground">Quick Actions</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<!-- Brand Builder -->
			<Card class="cursor-pointer transition-shadow hover:shadow-md">
				<CardHeader>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Palette class="h-6 w-6 text-primary" />
					</div>
					<CardTitle class="text-lg">Create Brand Guidelines</CardTitle>
					<CardDescription>
						Generate comprehensive brand guidelines for your business
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button class="w-full" href="/dashboard/builder">
						Start Building
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
				</CardContent>
			</Card>

			<!-- Brand Audit -->
			<Card class="cursor-pointer transition-shadow hover:shadow-md">
				<CardHeader>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Search class="h-6 w-6 text-primary" />
					</div>
					<CardTitle class="text-lg">Audit Website</CardTitle>
					<CardDescription>Analyze your website against brand guidelines</CardDescription>
				</CardHeader>
				<CardContent>
					<Button class="w-full" href="/dashboard/audit">
						Start Audit
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
				</CardContent>
			</Card>

			<!-- Creative Generator -->
			<Card class="cursor-pointer transition-shadow hover:shadow-md">
				<CardHeader>
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
						<Sparkles class="h-6 w-6 text-accent-foreground" />
					</div>
					<CardTitle class="text-lg">Generate Creative</CardTitle>
					<CardDescription>Create branded social media and campaign content</CardDescription>
				</CardHeader>
				<CardContent>
					<Button class="w-full" href="/dashboard/creative">
						Create Content
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
				</CardContent>
			</Card>
		</div>
	</div>

	<!-- Recent Activity -->
	<div>
		<h2 class="mb-4 text-xl font-semibold text-foreground">Recent Activity</h2>
		<Card>
			<CardContent class="p-6">
				<div class="space-y-4">
					<div class="flex items-center space-x-4">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
							<Palette class="h-4 w-4 text-primary" />
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium text-foreground">
								Brand guidelines created for "TechCorp"
							</p>
							<p class="text-xs text-muted-foreground">2 hours ago</p>
						</div>
					</div>

					<div class="flex items-center space-x-4">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
							<Search class="h-4 w-4 text-primary" />
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium text-foreground">
								Website audit completed for "example.com"
							</p>
							<p class="text-xs text-muted-foreground">5 hours ago</p>
						</div>
					</div>

					<div class="flex items-center space-x-4">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
							<Sparkles class="h-4 w-4 text-accent-foreground" />
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium text-foreground">
								Instagram post generated for summer campaign
							</p>
							<p class="text-xs text-muted-foreground">1 day ago</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	</div>
</div>
