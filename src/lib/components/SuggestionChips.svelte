<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	export let suggestions: string[];
	export let onSelect: (suggestion: string) => void;
</script>

<div class="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
	{#each suggestions as suggestion}
		<Button
			variant="outline"
			size="sm"
			onclick={() => onSelect(suggestion)}
			class="border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500/50 hover:scale-105 transition-all duration-200"
		>
			{suggestion}
		</Button>
	{/each}
</div>

