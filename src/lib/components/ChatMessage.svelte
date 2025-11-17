<script lang="ts">
	import { Bot, User, Edit2 } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	export let message: {
		id: string;
		type: 'bot' | 'user';
		content: string;
		timestamp: Date;
		questionId?: string;
		edited?: boolean;
	};
	export let onEdit: (() => void) | undefined = undefined;
	export let canEdit: boolean = false;

	// Format timestamp
	function formatTime(date: Date): string {
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	// Parse markdown-style bold and italic
	function parseContent(content: string): string {
		return content
			.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
			.replace(/_(.*?)_/g, '<em class="italic text-muted-foreground">$1</em>')
			.replace(/\n/g, '<br>');
	}
</script>

{#if message.type === 'bot'}
	<div class="flex items-start gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
		<!-- Bot Avatar -->
		<div class="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20">
			<Bot class="h-5 w-5 text-white" />
		</div>

		<!-- Message Content -->
		<div class="flex-1 max-w-[80%]">
			<div class="bg-muted/50 backdrop-blur-sm rounded-2xl rounded-tl-none px-4 py-3 border border-border/50">
				<div class="text-sm text-foreground leading-relaxed">
					{@html parseContent(message.content)}
				</div>
			</div>
			<div class="text-xs text-muted-foreground mt-1 ml-2">
				{formatTime(message.timestamp)}
			</div>
		</div>
	</div>
{:else}
	<div class="flex items-start gap-3 justify-end animate-in fade-in slide-in-from-right-4 duration-300 group">
		<!-- Message Content -->
		<div class="flex-1 max-w-[80%] flex flex-col items-end">
			<div class="relative bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl rounded-tr-none px-4 py-3 shadow-lg shadow-orange-500/20">
				<div class="text-sm text-white leading-relaxed">
					{@html parseContent(message.content)}
				</div>
			</div>
			<div class="flex items-center gap-2 mt-1 mr-2">
				{#if canEdit && onEdit}
					<button
						onclick={onEdit}
						class="p-1 rounded hover:bg-muted transition-colors duration-200"
						title="Edit this answer"
					>
						<Edit2 class="h-3.5 w-3.5 text-orange-500 hover:text-orange-600" />
					</button>
				{/if}
				<span class="text-xs text-muted-foreground">
					{formatTime(message.timestamp)}
				</span>
			</div>
		</div>

		<!-- User Avatar -->
		<div class="flex-shrink-0 p-2 rounded-lg bg-card border border-border">
			<User class="h-5 w-5 text-muted-foreground" />
		</div>
	</div>
{/if}

