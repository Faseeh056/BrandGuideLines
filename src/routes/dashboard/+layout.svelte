<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Home, Palette, Search, Sparkles, User, Settings, LogOut } from 'lucide-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	// Removed client-side auth import - will handle logout differently
	import { goto } from '$app/navigation';

	let { children, data } = $props();

	// Redirect if not authenticated
	if (!data?.user) {
		goto('/auth/login');
	}

	const navItems = [
		{ href: '/dashboard', icon: Home, label: 'Dashboard', exact: true },
		{ href: '/dashboard/builder', icon: Palette, label: 'Builder' },
		{ href: '/dashboard/audit', icon: Search, label: 'Audit' },
		{ href: '/dashboard/creative', icon: Sparkles, label: 'Creative' }
	];

	function isActive(href: string, exact = false) {
		if (exact) {
			return $page.url.pathname === href;
		}
		return $page.url.pathname.startsWith(href);
	}
</script>

<div class="flex h-screen bg-background">
	<!-- Sidebar -->
	<aside class="flex w-64 flex-col border-r border-border bg-card">
		<!-- Logo -->
		<div class="border-b border-border p-6">
			<h1 class="text-xl font-bold text-foreground">EternaBrand</h1>
			<p class="text-sm text-muted-foreground">AI Brand Assistant</p>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 p-4">
			<ul class="space-y-2">
				{#each navItems as item}
					<li>
					<a
						href={item.href}
						class="flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors {isActive(
							item.href,
							item.exact
						)
							? 'bg-primary text-primary-foreground'
							: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}"
					>
							<item.icon class="mr-3 h-5 w-5" />
							{item.label}
						</a>
					</li>
				{/each}
			</ul>

			<Separator class="my-4" />

			<!-- User Section -->
			<div class="space-y-2">
				<div class="px-3 py-2">
					<p class="text-sm font-medium text-gray-900 dark:text-gray-100">{data?.user?.name || 'User'}</p>
					<p class="text-xs text-gray-500 dark:text-gray-400">{data?.user?.email}</p>
				</div>
				<div class="flex items-center justify-between px-3 py-2">
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
					<ThemeToggle />
				</div>
				<Button variant="ghost" class="w-full justify-start" size="sm" href="/auth/profile">
					<User class="mr-3 h-5 w-5" />
					Profile
				</Button>
				<Button variant="ghost" class="w-full justify-start" size="sm">
					<Settings class="mr-3 h-5 w-5" />
					Settings
				</Button>
				<Button variant="ghost" class="w-full justify-start" size="sm" href="/api/auth/logout">
					<LogOut class="mr-3 h-5 w-5" />
					Sign Out
				</Button>
			</div>
		</nav>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 overflow-auto">
		<div class="p-8">
			{@render children?.()}
		</div>
	</main>
</div>
