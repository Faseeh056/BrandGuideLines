<script lang="ts">
	import { Bot } from 'lucide-svelte';
</script>

<div class="flex items-start gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
	<!-- Bot Avatar -->
	<div class="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20">
		<Bot class="h-5 w-5 text-white" />
	</div>

	<!-- Typing Animation -->
	<div class="flex-1 max-w-[80%]">
		<div class="bg-muted/50 backdrop-blur-sm rounded-2xl rounded-tl-none px-4 py-3 border border-border/50">
			<div class="flex items-center gap-1">
				<div class="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style="animation-delay: 0ms;"></div>
				<div class="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style="animation-delay: 150ms;"></div>
				<div class="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style="animation-delay: 300ms;"></div>
			</div>
		</div>
	</div>
</div>

