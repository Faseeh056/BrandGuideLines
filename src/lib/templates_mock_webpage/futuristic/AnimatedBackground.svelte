<script lang="ts">
	// Simplified animated background without complex 3D animations
</script>

<div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
	<!-- Gradient overlay -->
	<div class="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />
	
	<!-- Animated rotating circles -->
	<div class="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl animate-pulse" />
	
	<div class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl animate-pulse" style="animation-delay: 1s;" />
	
	<!-- Grid pattern -->
	<div 
		class="absolute inset-0 opacity-10"
		style="background-image: linear-gradient(to right, rgb(59, 130, 246) 1px, transparent 1px), linear-gradient(to bottom, rgb(59, 130, 246) 1px, transparent 1px); background-size: 80px 80px;"
	></div>
</div>

<style>
	@keyframes pulse {
		0%, 100% { opacity: 0.3; transform: scale(1); }
		50% { opacity: 0.6; transform: scale(1.1); }
	}
	.animate-pulse {
		animation: pulse 4s ease-in-out infinite;
	}
</style>

