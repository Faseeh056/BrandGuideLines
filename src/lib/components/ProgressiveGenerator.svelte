<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import StepSlide from '$lib/components/StepSlide.svelte';
	import {
		CheckCircle,
		XCircle,
		Loader2,
		ArrowRight,
		RefreshCw,
		ThumbsUp,
		ThumbsDown
	} from 'lucide-svelte';
	import type { BrandGuidelinesInput } from '$lib/types/brand-guidelines';
	import { GENERATION_STEPS, type GenerationStep } from '$lib/utils/progressive-generation';
	import { getDomainSpecificStepInfo } from '$lib/utils/domain-specific-steps';

	export let brandInput: BrandGuidelinesInput;
	export let logoFiles: Array<{ filename: string; fileData: string; usageTag: string }> = [];
	export let onComplete: (guidelines: any) => void;
	export let chatbotControlled: boolean = false; // If true, chatbot handles approval
	export let onStepGenerated: ((step: any) => void) | null = null; // Callback when step is generated

	// Progressive generation state - store all generated steps
	interface GeneratedStep {
		stepId: string;
		stepTitle: string;
		stepDescription: string;
		content: any;
		isGenerating: boolean;
		isApproved: boolean;
		previousContent: any | null;
		hasBeenEdited: boolean;
	}
	
	let generatedSteps: GeneratedStep[] = [];
	let isGeneratingNewStep = false;
	let hasStarted = false;
	
	// Navigation state - which step is currently visible
	let currentStepIndex = 0;

	// Available step definitions (without final-review)
	let stepDefinitions = [
		{
			id: 'brand-positioning',
			defaultTitle: 'Brand Positioning',
			defaultDescription: 'Define your brand identity'
		},
		{
			id: 'logo-guidelines',
			defaultTitle: 'Logo Guidelines',
			defaultDescription: 'Logo usage and specifications'
		},
		{
			id: 'color-palette',
			defaultTitle: 'Color Palette',
			defaultDescription: 'Brand color system'
		},
		{
			id: 'typography',
			defaultTitle: 'Typography',
			defaultDescription: 'Font selection and usage'
		},
		{
			id: 'iconography',
			defaultTitle: 'Iconography',
			defaultDescription: 'Icon style and examples'
		},
		{
			id: 'photography',
			defaultTitle: 'Photography',
			defaultDescription: 'Photo style guidelines'
		},
		{
			id: 'applications',
			defaultTitle: 'Applications',
			defaultDescription: 'Brand applications'
		}
	];

	// Store AI-generated titles
	let aiGeneratedTitles: Array<{ id: string; title: string; description: string }> = [];

	// Function to generate dynamic step titles via AI
	async function generateStepTitles() {
		try {
			const response = await fetch('/api/generate-step-titles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					brand_domain: brandInput.brand_domain,
					brand_name: brandInput.brand_name,
					short_description: brandInput.short_description,
					selectedMood: brandInput.selectedMood,
					selectedAudience: brandInput.selectedAudience
				})
			});

			if (response.ok) {
				const generatedSteps = await response.json();
				// Filter out final-review from AI generated titles
				aiGeneratedTitles = generatedSteps.filter((s: any) => s.id !== 'final-review');
			}
		} catch (error) {
			console.error('Failed to generate step titles:', error);
		}
	}

	// Generate step titles when component mounts or input changes
	$: if (brandInput.brand_name && brandInput.brand_domain && !hasStarted) {
		generateStepTitles();
	}

	// Get step info (AI-generated or default)
	function getStepInfo(stepId: string) {
		const aiTitle = aiGeneratedTitles.find((s) => s.id === stepId);
		const defaultInfo = stepDefinitions.find((s) => s.id === stepId);
		
		return {
			title: aiTitle?.title || defaultInfo?.defaultTitle || 'Generating...',
			description: aiTitle?.description || defaultInfo?.defaultDescription || 'Please wait...'
		};
	}

	async function startProgressiveGeneration() {
		hasStarted = true;
		generatedSteps = [];
		currentStepIndex = 0;
		await generateNextStep();
	}
	
	// Export function for external calls
	export { startProgressiveGeneration, approveStep, regenerateStep };
	
	// Navigation functions
	function nextStepNavigation() {
		if (currentStepIndex < generatedSteps.length - 1) {
			currentStepIndex++;
		}
	}
	
	function prevStepNavigation() {
		if (currentStepIndex > 0) {
			currentStepIndex--;
		}
	}

	async function generateNextStep() {
		// Check if all steps are generated
		if (generatedSteps.length >= stepDefinitions.length) {
			// All steps complete - trigger completion
			await completeGeneration();
			return;
		}

		isGeneratingNewStep = true;
		const nextStepDef = stepDefinitions[generatedSteps.length];
		const stepInfo = getStepInfo(nextStepDef.id);

		// Add a placeholder for the new step
		const newStepIndex = generatedSteps.length;
		generatedSteps = [
			...generatedSteps,
			{
				stepId: nextStepDef.id,
				stepTitle: stepInfo.title,
				stepDescription: stepInfo.description,
				content: null,
				isGenerating: true,
				isApproved: false,
				previousContent: null,
				hasBeenEdited: false
			}
		];
		
		// Focus the generator view on the newly created step
		currentStepIndex = newStepIndex;
		
		// Notify chatbot if in chatbot-controlled mode (show generating state)
		if (chatbotControlled && onStepGenerated) {
			onStepGenerated({
				stepId: nextStepDef.id,
				stepTitle: stepInfo.title,
				stepDescription: stepInfo.description,
				content: null,
				stepIndex: newStepIndex,
				isGenerating: true,
				isApproved: false
			});
		}

		try {
			const response = await fetch('/api/brand-guidelines/progressive', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					step: nextStepDef.id,
					previousSteps: {
						...brandInput,
						// Ensure all fields are included
						selectedMood: brandInput.selectedMood,
						selectedAudience: brandInput.selectedAudience,
						brandValues: brandInput.brandValues,
						customPrompt: brandInput.customPrompt,
						logo_files: logoFiles.map((logo) => ({
							filename: logo.filename,
							usage_tag: logo.usageTag,
							fileData: logo.fileData,
							file_size: 0
						}))
					},
					userApproval: false
				})
			});

			const result = await response.json();

			console.log('API Response received:', {
				step: nextStepDef.id,
				success: result.success,
				hasContent: !!result.content,
				contentType: typeof result.content,
				contentPreview: typeof result.content === 'string' ? result.content.substring(0, 200) : result.content,
				contentLength: typeof result.content === 'string' ? result.content.length : 'N/A',
				message: result.message
			});

			if (result.success) {
				// Update the step with generated content
				generatedSteps = generatedSteps.map((step, idx) =>
					idx === generatedSteps.length - 1
						? { ...step, content: result.content, isGenerating: false, isApproved: false, previousContent: null, hasBeenEdited: false }
						: step
				);
				
				console.log('Updated generatedSteps for step:', nextStepDef.id, {
					stepIndex: generatedSteps.length - 1,
					hasContent: !!generatedSteps[generatedSteps.length - 1]?.content,
					contentType: typeof generatedSteps[generatedSteps.length - 1]?.content
				});
				
				// Notify chatbot if in chatbot-controlled mode
				if (chatbotControlled && onStepGenerated) {
					const newStep = generatedSteps[generatedSteps.length - 1];
					onStepGenerated({
						stepId: newStep.stepId,
						stepTitle: newStep.stepTitle,
						stepDescription: newStep.stepDescription,
						content: newStep.content,
						stepIndex: generatedSteps.length - 1,
						isGenerating: false,
						isApproved: false
					});
				}
			} else {
				throw new Error(result.error || 'Failed to generate step');
			}
		} catch (error) {
			console.error('Error generating step:', error);
			// Remove the failed step
			generatedSteps = generatedSteps.slice(0, -1);
			alert('Failed to generate this step. Please try again.');
		} finally {
			isGeneratingNewStep = false;
		}
	}

	// Approve a step and generate the next one
	async function approveStep(stepIndex: number) {
		// Mark the step as approved
		generatedSteps = generatedSteps.map((s, idx) =>
			idx === stepIndex ? { ...s, isApproved: true } : s
		);
		
		// Notify chatbot about approval update
		if (chatbotControlled && onStepGenerated && generatedSteps[stepIndex]) {
			const approvedStep = generatedSteps[stepIndex];
			onStepGenerated({
				stepId: approvedStep.stepId,
				stepTitle: approvedStep.stepTitle,
				stepDescription: approvedStep.stepDescription,
				content: approvedStep.content,
				stepIndex: stepIndex,
				isGenerating: approvedStep.isGenerating,
				isApproved: true
			});
		}
		
		// Generate next step if there are more
		if (generatedSteps.length < stepDefinitions.length) {
			await generateNextStep();
			// Advance to the newly generated step
			currentStepIndex = generatedSteps.length - 1;
		} else {
			// All steps generated, advance to next (or complete)
			if (currentStepIndex < generatedSteps.length - 1) {
				currentStepIndex++;
			}
		}
	}

	// Regenerate a specific step with feedback
	async function regenerateStep(stepIndex: number, feedback: string) {
		const step = generatedSteps[stepIndex];
		if (!step) return;

		// Save current content as previous before regenerating
		const currentContent = step.content;

		// Mark step as generating
		generatedSteps = generatedSteps.map((s, idx) =>
			idx === stepIndex ? { ...s, isGenerating: true, previousContent: currentContent, hasBeenEdited: true } : s
		);

		try {
			const response = await fetch('/api/brand-guidelines/progressive', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					step: step.stepId,
					previousSteps: {
						...brandInput,
						// Ensure all fields are included
						selectedMood: brandInput.selectedMood,
						selectedAudience: brandInput.selectedAudience,
						brandValues: brandInput.brandValues,
						customPrompt: brandInput.customPrompt,
						logo_files: logoFiles.map((logo) => ({
							filename: logo.filename,
							usage_tag: logo.usageTag,
							fileData: logo.fileData,
							file_size: 0
						}))
					},
					userApproval: false,
					feedback: feedback
				})
			});

			const result = await response.json();

			if (result.success) {
				// Update the step with new content (keep previous content for revert)
				generatedSteps = generatedSteps.map((s, idx) =>
					idx === stepIndex ? { ...s, content: result.content, isGenerating: false } : s
				);
				
				// Notify chatbot if in chatbot-controlled mode
				if (chatbotControlled && onStepGenerated) {
					const updatedStep = generatedSteps[stepIndex];
					onStepGenerated({
						stepId: updatedStep.stepId,
						stepTitle: updatedStep.stepTitle,
						stepDescription: updatedStep.stepDescription,
						content: updatedStep.content,
						stepIndex: stepIndex,
						isGenerating: false,
						isApproved: updatedStep.isApproved
					});
				}
			} else {
				throw new Error(result.error || 'Failed to regenerate step');
			}
		} catch (error) {
			console.error('Error regenerating step:', error);
			alert('Failed to regenerate this step. Please try again.');
			// Reset generating state and restore previous content
			generatedSteps = generatedSteps.map((s, idx) =>
				idx === stepIndex ? { ...s, isGenerating: false, previousContent: null } : s
			);
		}
	}

	// Revert a step to its previous content
	function revertStep(stepIndex: number) {
		const step = generatedSteps[stepIndex];
		if (!step || !step.previousContent) return;

		// Restore previous content
		generatedSteps = generatedSteps.map((s, idx) =>
			idx === stepIndex
				? { ...s, content: s.previousContent, previousContent: null, hasBeenEdited: false }
				: s
		);
	}

	async function completeGeneration() {
		try {
			console.log('Starting completeGeneration with generatedSteps:', generatedSteps);

			// Build step history from generated steps
			const cleanStepHistory = generatedSteps.map((step) => {
				// Keep content as-is (should be a string from the AI)
				console.log('Processing step for save:', {
					stepId: step.stepId,
					stepTitle: step.stepTitle,
					contentType: typeof step.content,
					contentPreview: typeof step.content === 'string' ? step.content.substring(0, 100) : step.content
				});

				return {
					step: step.stepId,
					title: step.stepTitle,  // Save AI-generated title!
					description: step.stepDescription,  // Save AI-generated description!
					content: step.content, // Keep raw content (string from AI)
					approved: true
				};
			});
			
			console.log('Clean step history for saving:', {
				stepCount: cleanStepHistory.length,
				steps: cleanStepHistory.map((s: any) => ({
					step: s.step,
					title: s.title,
					contentType: typeof s.content,
					contentLength: typeof s.content === 'string' ? s.content.length : 'N/A'
				}))
			});

			// Save to database via the comprehensive endpoint
			const payload = {
				...brandInput,
				logo_files: logoFiles.map((logo) => ({
					filename: logo.filename,
					usage_tag: logo.usageTag,
					fileData: logo.fileData,
					file_size: 0
				})),
				stepHistory: cleanStepHistory
			};
			
			console.log('Payload being sent to comprehensive API:', {
				brand_name: payload.brand_name,
				hasStepHistory: !!payload.stepHistory,
				stepHistoryCount: payload.stepHistory?.length || 0,
				logoFilesCount: payload.logo_files?.length || 0
			});

			const response = await fetch('/api/brand-guidelines/comprehensive', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('API Error Response:', errorText);
				throw new Error(`API Error: ${response.status} - ${errorText}`);
			}

			const result = await response.json();
			console.log('API Response result:', result);

			if (result.success && result.brandGuidelines) {
				console.log('Generation completed successfully, calling onComplete');
				onComplete({
					stepHistory: cleanStepHistory,
					brandInput: brandInput,
					logoFiles: logoFiles,
					completeGuidelines: result.brandGuidelines,
					savedGuidelines: result.savedGuidelines // Pass the saved DB record with ID
				});
			} else {
				throw new Error(
					result.error || 'Failed to complete generation - no brandGuidelines returned'
				);
			}
		} catch (error) {
			console.error('Error completing generation:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			alert(`Failed to complete generation: ${errorMessage}`);
		}
	}

	function getProgressPercentage(): number {
		if (!hasStarted) return 0;
		// Count fully generated steps (not currently generating)
		const completedSteps = generatedSteps.filter(s => !s.isGenerating).length;
		return Math.round((completedSteps / stepDefinitions.length) * 100);
	}
	
	// Reactive statement to log progress
	$: if (hasStarted) {
		console.log('Progress update:', {
			completedSteps: generatedSteps.filter(s => !s.isGenerating).length,
			totalSteps: stepDefinitions.length,
			percentage: getProgressPercentage()
		});
	}
</script>

<div class="progressive-generator h-full">
	{#if !hasStarted}
		<!-- Start Button -->
		<Card class="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm h-full w-[580px] flex flex-col">
			<CardContent class="p-8 text-center flex-1 flex flex-col justify-center">
				<div class="start-generation">
					<h2 class="text-2xl font-bold text-foreground mb-3">Progressive Brand Guidelines Generation</h2>
					<p class="text-muted-foreground mb-6">
						Steps will appear one by one. Review and approve each to continue, or edit any step anytime.
					</p>
					<div class="mb-6 inline-flex p-4 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/10">
						<ArrowRight class="h-12 w-12 text-orange-500" />
					</div>
					<p class="mb-6 text-base text-muted-foreground">
						Ready to start generating your brand guidelines step by step?
					</p>
					<Button 
						onclick={startProgressiveGeneration} 
						class="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30"
						size="lg"
					>
						<ArrowRight class="mr-2 h-5 w-5" />
						Start Progressive Generation
					</Button>
				</div>
			</CardContent>
		</Card>
	{:else}
		<!-- Single Step Display -->
		{#if generatedSteps[currentStepIndex]}
			{@const step = generatedSteps[currentStepIndex]}
			<div class="single-step-view">
				{#if step.content || step.isGenerating}
					<StepSlide
						stepData={step.content}
						stepTitle={step.stepTitle}
						stepDescription={step.stepDescription}
						stepId={step.stepId}
						isGenerating={step.isGenerating}
						onApprove={() => approveStep(currentStepIndex)}
						onRegenerate={(feedback) => regenerateStep(currentStepIndex, feedback)}
						onRevert={() => revertStep(currentStepIndex)}
						{logoFiles}
						stepIndex={currentStepIndex}
						isLastStep={currentStepIndex === stepDefinitions.length - 1}
						isApproved={step.isApproved}
						canRevert={step.hasBeenEdited && step.previousContent !== null}
						showApproveButton={!step.isGenerating && !step.isApproved && !chatbotControlled}
						readOnly={chatbotControlled}
						showNavigationButtons={true}
						onPrevious={prevStepNavigation}
						onNext={nextStepNavigation}
						canGoNext={step.isApproved && currentStepIndex < generatedSteps.length - 1}
						canGoPrevious={currentStepIndex > 0}
						showCompleteButton={currentStepIndex === stepDefinitions.length - 1 && generatedSteps.length === stepDefinitions.length && step.isApproved}
						onComplete={completeGeneration}
						showProgressIndicator={true}
						currentStep={currentStepIndex + 1}
						totalSteps={stepDefinitions.length}
						progressPercentage={Math.round(((currentStepIndex + 1) / stepDefinitions.length) * 100)}
						allSteps={stepDefinitions.map((stepDef, idx) => ({
							...getStepInfo(stepDef.id),
							isApproved: generatedSteps[idx]?.isApproved || false,
							isCurrent: idx === currentStepIndex
						}))}
					/>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style>
	.progressive-generator {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0;
	}

	.progress-header {
		margin-bottom: 2rem;
	}

	.progress-info {
		margin-bottom: 1rem;
	}

	.progress-bar {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.progress-track {
		flex: 1;
		height: 8px;
		background: oklch(var(--muted));
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, oklch(var(--primary)), oklch(var(--primary) / 0.8));
		border-radius: 4px;
		transition: width 0.3s ease;
	}

	.progress-text {
		font-size: 0.875rem;
		font-weight: 600;
		color: oklch(var(--muted-foreground));
		min-width: 10rem;
	}

	.generated-steps-stack {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.step-container {
		animation: slideIn 0.4s ease-out;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.completion-section {
		margin-top: 2rem;
		animation: fadeIn 0.5s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.complete-btn {
		background: oklch(var(--primary));
		border-color: oklch(var(--primary));
		padding: 0.75rem 2rem;
	}

	.complete-btn:hover {
		background: oklch(var(--primary) / 0.9);
		border-color: oklch(var(--primary) / 0.9);
	}

	.start-generation {
		text-align: center;
		padding: 2rem;
	}

	.start-btn {
		background: oklch(var(--primary));
		border-color: oklch(var(--primary));
		padding: 0.75rem 2rem;
	}

	.start-btn:hover {
		background: oklch(var(--primary) / 0.9);
		border-color: oklch(var(--primary) / 0.9);
	}

	@media (max-width: 768px) {
		.progressive-generator {
			padding: 1rem;
		}

		.progress-text {
			font-size: 0.75rem;
			min-width: 8rem;
		}
	}
</style>
