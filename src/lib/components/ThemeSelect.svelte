<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		id?: string;
		name?: string;
		value?: string;
		placeholder?: string;
		options: string[];
		required?: boolean;
		disabled?: boolean;
		class?: string;
	}

	let {
		id,
		name,
		value = $bindable(''),
		placeholder = 'Select an option',
		options,
		required = false,
		disabled = false,
		class: className = ''
	}: Props = $props();

	const dispatch = createEventDispatcher();

	let isOpen = $state(false);
	let triggerElement: HTMLButtonElement | null = $state(null);
	let dropdownElement: HTMLDivElement | null = $state(null);

	function toggleDropdown() {
		if (disabled) return;
		isOpen = !isOpen;
	}

	function selectOption(option: string) {
		value = option;
		isOpen = false;
		dispatch('change', { value: option });
	}

	function handleClickOutside(event: MouseEvent) {
		if (
			triggerElement &&
			dropdownElement &&
			!triggerElement.contains(event.target as Node) &&
			!dropdownElement.contains(event.target as Node)
		) {
			isOpen = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (disabled) return;

		if (event.key === 'Escape') {
			isOpen = false;
			triggerElement?.focus();
			return;
		}

		if (event.key === 'Enter' || event.key === ' ') {
			if (!isOpen) {
				event.preventDefault();
				toggleDropdown();
			}
			return;
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (!isOpen) {
				isOpen = true;
			} else {
				// Focus next option
				const currentIndex = value ? options.indexOf(value) : -1;
				const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
				value = options[nextIndex];
			}
			return;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (isOpen) {
				const currentIndex = value ? options.indexOf(value) : -1;
				const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
				value = options[prevIndex];
			}
			return;
		}
	}

	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});
</script>

<div class="relative w-full {className}">
	<button
		type="button"
		bind:this={triggerElement}
		{id}
		{name}
		{disabled}
		{required}
		onclick={toggleDropdown}
		onkeydown={handleKeydown}
		class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
		aria-haspopup="listbox"
		aria-expanded={isOpen}
		aria-required={required}
	>
		<span class="block truncate text-left">
			{#if value}
				{value}
			{:else}
				<span class="text-muted-foreground">{placeholder}</span>
			{/if}
		</span>
		<ChevronDown
			class="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 {isOpen
				? 'rotate-180'
				: ''}"
		/>
	</button>

	{#if isOpen}
		<div
			bind:this={dropdownElement}
			role="listbox"
			class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md"
			style="scrollbar-width: thin; scrollbar-color: oklch(var(--muted-foreground) / 0.3) oklch(var(--muted));"
		>
			{#each options as option (option)}
				<button
					type="button"
					role="option"
					aria-selected={value === option}
					onclick={() => selectOption(option)}
					class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 {value ===
					option
						? 'bg-accent text-accent-foreground'
						: ''}"
				>
					{option}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* Custom scrollbar styling for dropdown */
	div[role="listbox"]::-webkit-scrollbar {
		width: 8px;
	}

	div[role="listbox"]::-webkit-scrollbar-track {
		background: oklch(var(--muted));
		border-radius: 4px;
	}

	div[role="listbox"]::-webkit-scrollbar-thumb {
		background: oklch(var(--muted-foreground) / 0.3);
		border-radius: 4px;
	}

	div[role="listbox"]::-webkit-scrollbar-thumb:hover {
		background: oklch(var(--muted-foreground) / 0.5);
	}
</style>

