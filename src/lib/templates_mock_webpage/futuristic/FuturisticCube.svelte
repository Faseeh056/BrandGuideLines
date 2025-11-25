<script lang="ts">
	// Simplified cube without complex 3D transforms
</script>

<div class="relative w-full h-[600px] flex items-center justify-center">
	<div class="relative w-[300px] h-[300px]">
		<!-- Simplified cube representation -->
		<div class="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm border border-cyan-400/40 rounded-lg">
			<div class="absolute inset-[20%] border border-cyan-300/30 rounded-sm bg-blue-400/5">
				<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full blur-sm" />
			</div>
		</div>
		<!-- Outer glow -->
		<div class="absolute inset-0 rounded-lg" style="background: radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%);"></div>
	</div>
</div>

