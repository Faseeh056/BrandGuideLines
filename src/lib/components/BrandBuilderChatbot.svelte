<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Send, Upload, Trash2, Bot, User, Sparkles, Edit2, CheckCircle, RefreshCw } from 'lucide-svelte';
	import ChatMessage from './ChatMessage.svelte';
	import TypingIndicator from './TypingIndicator.svelte';
	import SuggestionChips from './SuggestionChips.svelte';

	// Props
	export let questions: any[];
	export let onComplete: (data: any) => void;
	export let canGenerate: boolean;
	
	// Step approval callbacks (from ProgressiveGenerator)
	export let onApproveStep: ((stepIndex: number) => void) | null = null;
	export let onRegenerateStep: ((stepIndex: number, feedback: string) => void) | null = null;
	export let totalSteps: number = 7;

	// Message interface
	interface ChatMessage {
		id: string;
		type: 'bot' | 'user' | 'step';
		content: string;
		timestamp: Date;
		questionId?: string;
		suggestions?: string[];
		inputType?: string;
		isLogo?: boolean;
		questionIndex?: number; // Track which question this answer belongs to
		edited?: boolean; // Track if message was edited
		// Step-specific fields
		stepData?: {
			stepId: string;
			stepTitle: string;
			stepDescription: string;
			content: any;
			stepIndex: number;
			isGenerating: boolean;
			isApproved: boolean;
		};
		waitingForFeedback?: boolean; // If true, user can type feedback for regeneration
	}

	// State
	let messages: ChatMessage[] = [];
	let currentQuestionIndex = -1;
	let answers: Record<string, any> = {};
	let isTyping = false;
	let userInput = '';
	let chatContainer: HTMLElement;
	let fileInput: HTMLInputElement;
	let logoPreview: string | null = null;
	let logoFile: File | null = null;
	let isMultiline = false;
	let showSuggestions = false;
	let currentSuggestions: string[] = [];
	let conversationComplete = false;
	let waitingForConfirmation = true;
	let isEditingMode = false;
	let editingQuestionIndex = -1;
	let returnToQuestionIndex = -1; // Remember where we were before editing
	let isGeneratingGuidelines = false; // Track if we're in generation phase
	let waitingForStepFeedback = false; // Track if we're waiting for user feedback for regeneration
	let currentRegeneratingStepIndex = -1; // Track which step is being regenerated

	// Initialize chat on mount
	onMount(async () => {
		// Check if we have saved messages in sessionStorage
		const savedMessages = sessionStorage.getItem('brandBuilderChatMessages');
		const savedState = sessionStorage.getItem('brandBuilderChatState');
		
		if (savedMessages && savedState) {
			try {
				// Restore messages
				const parsedMessages = JSON.parse(savedMessages);
				messages = parsedMessages.map((msg: any) => ({
					...msg,
					timestamp: new Date(msg.timestamp)
				}));
				
				// Restore state
				const parsedState = JSON.parse(savedState);
				currentQuestionIndex = parsedState.currentQuestionIndex ?? -1;
				answers = parsedState.answers ?? {};
				conversationComplete = parsedState.conversationComplete ?? false;
				waitingForConfirmation = parsedState.waitingForConfirmation ?? false;
				isGeneratingGuidelines = parsedState.isGeneratingGuidelines ?? false;
				waitingForStepFeedback = parsedState.waitingForStepFeedback ?? false;
				currentRegeneratingStepIndex = parsedState.currentRegeneratingStepIndex ?? -1;
				
				// Restore UI state
				if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
					const currentQ = questions[currentQuestionIndex];
					isMultiline = currentQ.type === 'textarea';
					showSuggestions = currentQ.type === 'text-with-suggestions';
					if (showSuggestions && currentQ.suggestions) {
						currentSuggestions = currentQ.suggestions;
					}
				}
				
				await scrollToBottom();
				return; // Don't send initial message if we restored state
			} catch (error) {
				console.error('Failed to restore chat state:', error);
				// Fall through to send initial message
			}
		}
		
		// Only send initial message if no saved state exists
		await delay(500);
		await sendBotMessage(
			"👋 Hi! I'm your Brand Builder Assistant. I'll help you create comprehensive brand guidelines by asking a few questions. Ready to get started?"
		);
	});
	
	// Save messages to sessionStorage whenever they change (debounced to avoid too many writes)
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;
	$: if (messages.length >= 0) { // Save even if empty to track state
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			try {
				sessionStorage.setItem('brandBuilderChatMessages', JSON.stringify(messages));
				sessionStorage.setItem('brandBuilderChatState', JSON.stringify({
					currentQuestionIndex,
					answers,
					conversationComplete,
					waitingForConfirmation,
					isGeneratingGuidelines,
					waitingForStepFeedback,
					currentRegeneratingStepIndex
				}));
			} catch (error) {
				console.error('Failed to save chat state:', error);
			}
		}, 100); // Debounce by 100ms
	}

	// Delay helper
	function delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// Scroll to bottom of chat
	async function scrollToBottom() {
		await tick();
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}

	// Send bot message
	async function sendBotMessage(
		content: string,
		questionId?: string,
		suggestions?: string[],
		inputType?: string
	) {
		isTyping = true;
		await scrollToBottom();
		await delay(800);

		const message: ChatMessage = {
			id: Date.now().toString(),
			type: 'bot',
			content,
			timestamp: new Date(),
			questionId,
			suggestions,
			inputType,
			isLogo: inputType === 'logo'
		};

		messages = [...messages, message];
		isTyping = false;

		// Show suggestions if available
		if (suggestions && suggestions.length > 0) {
			showSuggestions = true;
			currentSuggestions = suggestions;
		} else {
			showSuggestions = false;
			currentSuggestions = [];
		}

		// Check if it's a textarea question
		isMultiline = inputType === 'textarea';

		await scrollToBottom();
	}

	// Send user message
	async function sendUserMessage(content: string, questionIndex?: number) {
		const message: ChatMessage = {
			id: Date.now().toString(),
			type: 'user',
			content,
			timestamp: new Date(),
			questionIndex: questionIndex ?? currentQuestionIndex
		};

		messages = [...messages, message];
		await scrollToBottom();
	}

	// Handle editing a previous answer
	async function handleEditAnswer(questionIndex: number) {
		// Save where we currently are so we can restore after editing
		returnToQuestionIndex = currentQuestionIndex;
		
		isEditingMode = true;
		editingQuestionIndex = questionIndex;
		currentQuestionIndex = questionIndex;
		
		// Pre-fill input with previous answer
		const q = questions[questionIndex];
		const previousAnswer = answers[q.id];
		if (previousAnswer && typeof previousAnswer === 'string') {
			userInput = previousAnswer;
		}
		
		// Scroll to bottom to show input
		await scrollToBottom();
		
		// Re-show the question
		const questionText = `${q.icon} **${q.question}**`;
		showSuggestions = q.type === 'text-with-suggestions';
		if (showSuggestions && q.suggestions) {
			currentSuggestions = q.suggestions;
		}
		isMultiline = q.type === 'textarea';
	}

	// Update the summary after an edit
	async function updateSummary() {
		// Find the summary messages (there are 3 in finishConversation)
		const summaryStartIndex = messages.findIndex(m => 
			m.type === 'bot' && m.content.includes('🎉 **All done!**')
		);
		
		if (summaryStartIndex !== -1) {
			// Remove old summary messages (3 messages total)
			messages = messages.slice(0, summaryStartIndex);
			
			// Re-add updated summary
			await delay(300);
			await sendBotMessage(
				"🎉 **All done!** I've collected all the information needed to generate your brand guidelines."
			);
			await delay(500);
			await sendBotMessage(
				"Here's your updated summary:\n\n" +
					Object.entries(answers)
						.filter(([key, value]) => value && key !== 'logo')
						.map(([key, value]) => `• **${key}**: ${typeof value === 'string' ? value.substring(0, 50) : value}`)
						.join('\n') +
					"\n\n_💡 Tip: You can hover over any of your answers above and click the edit icon to make changes!_"
			);
			await delay(500);
			await sendBotMessage(
				"✨ Ready to generate your comprehensive brand guidelines? Click the button below!"
			);
		}
	}

	// Ask next question
	async function askNextQuestion() {
		currentQuestionIndex++;

		if (currentQuestionIndex >= questions.length) {
			await finishConversation();
			return;
		}

		const q = questions[currentQuestionIndex];
		showSuggestions = false;

		await delay(500);

		// Build question message
		let questionText = `${q.icon} **${q.question}**`;
		if (q.helper) {
			questionText += `\n\n_${q.helper}_`;
		}

		await sendBotMessage(
			questionText,
			q.id,
			q.type === 'text-with-suggestions' ? q.suggestions : undefined,
			q.type
		);
	}

	// Handle user input submission
	async function handleSubmit() {
		const input = userInput.trim().toLowerCase();
		
		// Handle step regeneration feedback
		if (waitingForStepFeedback && currentRegeneratingStepIndex >= 0) {
			if (!userInput.trim()) {
				await sendBotMessage("Please provide feedback on what you'd like to change.");
				return;
			}
			await handleRegenerateStep(userInput.trim());
			return;
		}

		// Handle initial confirmation
		if (waitingForConfirmation) {
			if (!userInput.trim()) return;

			await sendUserMessage(userInput.trim());
			userInput = '';

			// Check for positive responses
			if (input === 'yes' || input === 'y' || input === 'yeah' || input === 'sure' || input === 'ok' || input === 'okay' || input === 'let\'s go' || input === 'start' || input === 'ready') {
				waitingForConfirmation = false;
				await delay(500);
				await askNextQuestion();
			} else if (input === 'no' || input === 'n' || input === 'nope' || input === 'not yet') {
				await delay(500);
				await sendBotMessage("No problem! Take your time. Just type 'yes' when you're ready to begin! 😊");
			} else {
				await delay(500);
				await sendBotMessage("I didn't quite catch that. Please type 'yes' to start or 'no' if you need more time.");
			}
			return;
		}

		// Handle regular question answers
		if (!userInput.trim() && currentQuestionIndex >= 0) {
			const q = questions[currentQuestionIndex];
			if (q.required) {
				await sendBotMessage("⚠️ This field is required. Please provide an answer.");
				return;
			}
		}

		if (userInput.trim()) {
			const currentQuestion = questions[currentQuestionIndex];
			answers[currentQuestion.id] = userInput.trim();

			// If we were editing, update the existing message
			if (isEditingMode) {
				// Find and update the existing message for this question
				const messageIndex = messages.findIndex(
					(m) => m.type === 'user' && m.questionIndex === currentQuestionIndex
				);
				
				if (messageIndex !== -1) {
					// Update the existing message content
					messages[messageIndex] = {
						...messages[messageIndex],
						content: userInput.trim(),
						edited: true
					};
					messages = [...messages]; // Trigger reactivity
				}
				
				userInput = '';
				isMultiline = false;
				isEditingMode = false;
				showSuggestions = false;
				currentSuggestions = [];
				editingQuestionIndex = -1;
				
				// Restore to where we were before editing
				if (returnToQuestionIndex >= 0) {
					currentQuestionIndex = returnToQuestionIndex;
					returnToQuestionIndex = -1;
					
					// Restore the UI state for the current question
					if (currentQuestionIndex < questions.length) {
						const currentQ = questions[currentQuestionIndex];
						isMultiline = currentQ.type === 'textarea';
						showSuggestions = currentQ.type === 'text-with-suggestions';
						if (showSuggestions && currentQ.suggestions) {
							currentSuggestions = currentQ.suggestions;
						}
					}
				}
				
				// If conversation is complete, update the summary
				if (conversationComplete) {
					await updateSummary();
				}
				
				await scrollToBottom();
			} else {
				// Normal flow - create new message and move to next question
				await sendUserMessage(userInput.trim(), currentQuestionIndex);
				userInput = '';
				isMultiline = false;

				await delay(500);
				await askNextQuestion();
			}
		}
	}

	// Handle suggestion chip click
	async function handleSuggestionClick(suggestion: string) {
		const currentQuestion = questions[currentQuestionIndex];
		answers[currentQuestion.id] = suggestion;

		// If we were editing, update the existing message
		if (isEditingMode) {
			// Find and update the existing message for this question
			const messageIndex = messages.findIndex(
				(m) => m.type === 'user' && m.questionIndex === currentQuestionIndex
			);
			
			if (messageIndex !== -1) {
				// Update the existing message content
				messages[messageIndex] = {
					...messages[messageIndex],
					content: suggestion,
					edited: true
				};
				messages = [...messages]; // Trigger reactivity
			}
			
			userInput = '';
			showSuggestions = false;
			currentSuggestions = [];
			isEditingMode = false;
			editingQuestionIndex = -1;
			
			// Restore to where we were before editing
			if (returnToQuestionIndex >= 0) {
				currentQuestionIndex = returnToQuestionIndex;
				returnToQuestionIndex = -1;
				
				// Restore the UI state for the current question
				if (currentQuestionIndex < questions.length) {
					const currentQ = questions[currentQuestionIndex];
					isMultiline = currentQ.type === 'textarea';
					showSuggestions = currentQ.type === 'text-with-suggestions';
					if (showSuggestions && currentQ.suggestions) {
						currentSuggestions = currentQ.suggestions;
					}
				}
			}
			
			// If conversation is complete, update the summary
			if (conversationComplete) {
				await updateSummary();
			}
			
			await scrollToBottom();
		} else {
			// Normal flow - create new message and move to next question
			await sendUserMessage(suggestion, currentQuestionIndex);
			userInput = '';
			showSuggestions = false;

			await delay(500);
			await askNextQuestion();
		}
	}

	// Handle skip
	async function handleSkip() {
		const currentQuestion = questions[currentQuestionIndex];
		if (currentQuestion.required) return;

		await sendUserMessage('_[Skipped]_');
		await delay(500);
		await askNextQuestion();
	}

	// Handle logo upload
	async function handleLogoUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			const file = target.files[0];

			if (!file.type.startsWith('image/')) {
				await sendBotMessage("⚠️ Please select a valid image file.");
				return;
			}

			if (file.size > 5 * 1024 * 1024) {
				await sendBotMessage("⚠️ File size must be less than 5MB.");
				return;
			}

			logoFile = file;

			// Upload to server first
			try {
				const formData = new FormData();
				formData.append('logo', file);

				const response = await fetch('/api/upload-logo', {
					method: 'POST',
					body: formData
				});

				if (response.ok) {
					const result = await response.json();
					
					// Store the server response with base64 data
					logoPreview = result.fileData;
					answers['logo'] = {
						filename: result.filename,
						filePath: result.filePath,
						fileData: result.fileData,
						usageTag: 'primary'
					};

					await sendUserMessage(`📎 Uploaded: ${file.name}`);
					await delay(500);
					await askNextQuestion();
				} else {
					const error = await response.json();
					await sendBotMessage(`⚠️ Failed to upload logo: ${error.error || 'Unknown error'}`);
				}
			} catch (error) {
				console.error('Logo upload error:', error);
				await sendBotMessage("⚠️ Failed to upload logo. Please try again.");
			}
		}
	}

	// Trigger file input
	function triggerFileUpload() {
		fileInput?.click();
	}

	// Handle AI logo generation
	async function handleGenerateLogo() {
		// Mark that user chose AI generation
		answers['logo'] = {
			type: 'ai-generated',
			status: 'pending'
		};

		await sendUserMessage('🎨 Generate logo with AI', currentQuestionIndex);
		await delay(500);
		await sendBotMessage("Great! I'll generate a logo for you based on your brand details. We'll create it during the brand guidelines generation process. ✨");
		await delay(800);
		await askNextQuestion();
	}

	// Finish conversation and show summary
	async function finishConversation() {
		conversationComplete = true;
		await delay(500);
		await sendBotMessage(
			"🎉 **All done!** I've collected all the information needed to generate your brand guidelines."
		);
		await delay(1000);
		await sendBotMessage(
			"Here's a quick summary of what you provided:\n\n" +
				Object.entries(answers)
					.filter(([key, value]) => value && key !== 'logo')
					.map(([key, value]) => `• **${key}**: ${typeof value === 'string' ? value.substring(0, 50) : value}`)
					.join('\n') +
				"\n\n_💡 Tip: You can hover over any of your answers above and click the edit icon to make changes!_"
		);
		await delay(1000);
		await sendBotMessage(
			"✨ Ready to generate your comprehensive brand guidelines? Click the button below!"
		);
	}

	// Handle generation
	function handleGenerate() {
		// Map answers back to the expected format
		const formData = {
			brandName: answers['brandName'] || '',
			brandDomain: answers['brandDomain'] || '',
			shortDescription: answers['shortDescription'] || '',
			brandValues: answers['brandValues'] || '',
			selectedMood: answers['selectedMood'] || '',
			selectedAudience: answers['selectedAudience'] || '',
			contactName: answers['contactName'] || '',
			contactEmail: answers['contactEmail'] || '',
			contactRole: answers['contactRole'] || '',
			contactCompany: answers['contactCompany'] || '',
			customPrompt: answers['customPrompt'] || '',
			logoData: answers['logo'] // Already in correct format from server upload
		};

		isGeneratingGuidelines = true;
		onComplete(formData);
	}
	
	// Export function to clear chat state (for reset)
	export function clearChatState() {
		messages = [];
		currentQuestionIndex = -1;
		answers = {};
		conversationComplete = false;
		waitingForConfirmation = true;
		isGeneratingGuidelines = false;
		waitingForStepFeedback = false;
		currentRegeneratingStepIndex = -1;
		isEditingMode = false;
		editingQuestionIndex = -1;
		returnToQuestionIndex = -1;
		userInput = '';
		isMultiline = false;
		showSuggestions = false;
		currentSuggestions = [];
		
		// Clear sessionStorage
		try {
			sessionStorage.removeItem('brandBuilderChatMessages');
			sessionStorage.removeItem('brandBuilderChatState');
		} catch (error) {
			console.error('Failed to clear chat state:', error);
		}
	}
	
	// Handle step generation event (called from ProgressiveGenerator)
	export function handleStepGenerated(step: {
		stepId: string;
		stepTitle: string;
		stepDescription: string;
		content: any;
		stepIndex: number;
		isGenerating: boolean;
		isApproved: boolean;
	}) {
		// Find if this step already exists in messages
		const existingMessageIndex = messages.findIndex(
			m => m.type === 'step' && m.stepData?.stepIndex === step.stepIndex
		);
		
		const stepMessage: ChatMessage = {
			id: `step-${step.stepIndex}-${Date.now()}`,
			type: 'step',
			content: '', // Will be rendered from stepData
			timestamp: new Date(),
			stepData: {
				stepId: step.stepId,
				stepTitle: step.stepTitle,
				stepDescription: step.stepDescription,
				content: step.content,
				stepIndex: step.stepIndex,
				isGenerating: step.isGenerating,
				isApproved: step.isApproved
			}
		};
		
		if (existingMessageIndex !== -1) {
			// Update existing step message
			messages[existingMessageIndex] = stepMessage;
			messages = [...messages]; // Trigger reactivity
		} else {
			// Append new step message so it appears after the approval confirmation
			messages = [...messages, stepMessage];
		}
		
		scrollToBottom();
	}
	
	// Handle step approval
	async function handleApproveStep(stepIndex: number) {
		if (!onApproveStep) return;
		
		// Check if step is still generating - don't allow approval
		const messageIndex = messages.findIndex(
			m => m.type === 'step' && m.stepData?.stepIndex === stepIndex
		);
		
		if (messageIndex !== -1) {
			const stepMessage = messages[messageIndex];
			if (stepMessage.stepData?.isGenerating || !stepMessage.stepData?.content) {
				await sendBotMessage("⏳ Please wait for the step to finish generating before approving.");
				return;
			}
		}
		
		// Update message to show approved state
		if (messageIndex !== -1) {
			messages[messageIndex] = {
				...messages[messageIndex],
				stepData: {
					...messages[messageIndex].stepData!,
					isApproved: true
				}
			};
			messages = [...messages];
		}
		
		// Determine if this is the final step
		const isLastStep = totalSteps ? stepIndex >= totalSteps - 1 : false;
		
		if (isLastStep) {
			await delay(300);
			await sendBotMessage("✅ Final step approved! Would you like to save your brand guidelines now?");
			
			await delay(700);
			onApproveStep(stepIndex);
		} else {
			// Show approval message immediately, before next step appears
			await delay(300);
			await sendBotMessage("✅ Step approved! Generating next step...");
			
			// Small pause before triggering next step generation
			await delay(700);
			
			// Call the approve function (this will trigger next step generation)
			onApproveStep(stepIndex);
		}
	}
	
	// Handle step regeneration request
	async function handleRequestRegenerate(stepIndex: number) {
		waitingForStepFeedback = true;
		currentRegeneratingStepIndex = stepIndex;
		
		// Update input placeholder
		await delay(300);
		await sendBotMessage("What would you like to change? Please describe your feedback in the input below.");
	}
	
	// Handle step regeneration with feedback
	async function handleRegenerateStep(feedback: string) {
		if (!onRegenerateStep || currentRegeneratingStepIndex === -1 || !feedback.trim()) {
			return;
		}
		
		// Show user's feedback
		await sendUserMessage(`Feedback: ${feedback}`);
		
		// Update message to show regenerating state
		const messageIndex = messages.findIndex(
			m => m.type === 'step' && m.stepData?.stepIndex === currentRegeneratingStepIndex
		);
		
		if (messageIndex !== -1) {
			messages[messageIndex] = {
				...messages[messageIndex],
				stepData: {
					...messages[messageIndex].stepData!,
					isGenerating: true
				}
			};
			messages = [...messages];
		}
		
		// Call the regenerate function
		onRegenerateStep(currentRegeneratingStepIndex, feedback);
		
		// Reset state
		waitingForStepFeedback = false;
		currentRegeneratingStepIndex = -1;
		userInput = '';
		
		await delay(300);
		await sendBotMessage("🔄 Regenerating step with your feedback...");
	}

	// Handle Enter key
	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			// Enter without Shift = Submit
			event.preventDefault();
			handleSubmit();
		}
		// Shift+Enter = New line (default textarea behavior)
	}

	// Check if current question is optional
	$: isCurrentQuestionOptional =
		currentQuestionIndex >= 0 ? !questions[currentQuestionIndex]?.required : false;

	// Progress percentage
	$: progressPercentage =
		currentQuestionIndex >= 0
			? Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
			: 0;
</script>

<Card class="border-border/50 shadow-xl border-orange-500/20 bg-card/50 backdrop-blur-sm h-[1000px] flex flex-col w-[580px]">
	<CardHeader class="space-y-4 pb-4 flex-shrink-0 border-b border-border/50">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-lg font-bold text-foreground">Brand Builder Assistant</h2>
				<p class="text-xs text-muted-foreground">AI-powered questionnaire</p>
			</div>
			{#if !waitingForConfirmation && currentQuestionIndex >= 0 && currentQuestionIndex < questions.length}
				<div class="text-right">
					<div class="text-xs text-muted-foreground">
						Question {currentQuestionIndex + 1} of {questions.length}
					</div>
					<div class="text-sm font-bold text-orange-500">{progressPercentage}%</div>
				</div>
			{/if}
		</div>

		<!-- Progress Bar -->
		{#if !waitingForConfirmation && currentQuestionIndex >= 0}
			<div class="relative h-1 bg-muted/30 rounded-full overflow-hidden">
				<div
					class="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out"
					style="width: {progressPercentage}%"
				></div>
			</div>
		{/if}
	</CardHeader>

	<CardContent class="flex-1 flex flex-col overflow-hidden p-0">
		<!-- Messages Container -->
		<div
			bind:this={chatContainer}
			class="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
		>
			{#each messages as message (message.id)}
				{#if message.type === 'step' && message.stepData}
					<!-- Step Message -->
					<div class="flex items-start gap-3">
						<div class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
							<Bot class="h-5 w-5 text-white" />
						</div>
						<div class="flex-1 space-y-3">
							<div class="bg-card border border-border/50 rounded-lg p-4 space-y-3">
								<div class="space-y-1">
									<h3 class="font-semibold text-foreground">{message.stepData.stepTitle}</h3>
									<p class="text-sm text-muted-foreground">{message.stepData.stepDescription}</p>
								</div>
								
								{#if message.stepData.isGenerating || !message.stepData.content}
									<div class="flex items-center gap-2 text-sm text-muted-foreground">
										<div class="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
										<span>Generating step content...</span>
									</div>
								{:else if message.stepData.content}
									<div class="text-sm text-foreground whitespace-pre-wrap max-h-60 overflow-y-auto">
										{typeof message.stepData.content === 'string' 
											? message.stepData.content.substring(0, 500) + (message.stepData.content.length > 500 ? '...' : '')
											: JSON.stringify(message.stepData.content, null, 2).substring(0, 500) + '...'}
									</div>
									
									{#if !message.stepData.isApproved && !message.stepData.isGenerating && message.stepData.content}
										<div class="flex items-center gap-2 pt-2 border-t border-border/50">
											<Button
												onclick={() => handleApproveStep(message.stepData!.stepIndex)}
												class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
												size="sm"
											>
												<CheckCircle class="mr-2 h-4 w-4" />
												Approve
											</Button>
											<Button
												onclick={() => handleRequestRegenerate(message.stepData!.stepIndex)}
												variant="outline"
												size="sm"
											>
												<RefreshCw class="mr-2 h-4 w-4" />
												Change
											</Button>
										</div>
									{:else if message.stepData.isApproved}
										<div class="flex items-center gap-2 pt-2 border-t border-border/50">
											<div class="flex items-center gap-2 text-sm text-green-600">
												<CheckCircle class="h-4 w-4" />
												<span>Approved</span>
											</div>
										</div>
									{/if}
								{/if}
							</div>
						</div>
					</div>
				{:else}
					{@const shouldShowEdit = !waitingForConfirmation && message.type === 'user' && message.questionIndex !== undefined}
					<ChatMessage 
						{message} 
						canEdit={shouldShowEdit}
						onEdit={() => message.questionIndex !== undefined && handleEditAnswer(message.questionIndex)}
					/>
				{/if}
			{/each}

			{#if isTyping}
				<TypingIndicator />
			{/if}

			<!-- Suggestion Chips -->
			{#if showSuggestions && currentSuggestions.length > 0 && (!conversationComplete || isEditingMode)}
				<SuggestionChips
					suggestions={currentSuggestions}
					onSelect={handleSuggestionClick}
				/>
			{/if}
		</div>

		<!-- Input Area -->
		<div class="p-4 border-t border-border/50 flex-shrink-0 space-y-3 bg-card/50">
			<!-- Edit Mode Indicator -->
			{#if isEditingMode && editingQuestionIndex >= 0}
				<div class="flex items-center gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
					<Edit2 class="h-4 w-4 text-orange-500" />
					<span class="text-sm text-foreground">
						Editing: <strong>{questions[editingQuestionIndex].question}</strong>
					</span>
				</div>
			{/if}
			
			<!-- Logo Options UI -->
			{#if !waitingForConfirmation && currentQuestionIndex >= 0 && questions[currentQuestionIndex]?.type === 'logo' && !conversationComplete}
				<div class="space-y-3">
					<div class="grid grid-cols-2 gap-3">
						<Button
							onclick={triggerFileUpload}
							variant="outline"
							class="flex-1 border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500/50"
							size="lg"
						>
							<Upload class="mr-2 h-5 w-5" />
							Upload Logo
						</Button>
						<Button
							onclick={handleGenerateLogo}
							variant="outline"
							class="flex-1 border-orange-500/30 hover:bg-orange-500/10 hover:border-orange-500/50"
							size="lg"
						>
							<Sparkles class="mr-2 h-5 w-5" />
							Generate with AI
						</Button>
					</div>
					<!-- Skip button removed for logo - logo is required -->
				</div>
				<input
					bind:this={fileInput}
					type="file"
					class="hidden"
					accept="image/*"
					onchange={handleLogoUpload}
				/>
			<!-- Regular Input -->
			{:else if !conversationComplete || isEditingMode || waitingForStepFeedback}
				<div class="flex items-end gap-2">
					{#if isMultiline && !waitingForConfirmation}
						<Textarea
							bind:value={userInput}
							placeholder="Type your answer..."
							rows={3}
							class="flex-1 resize-none"
							onkeydown={handleKeyPress}
							autofocus
						/>
					{:else}
						<Input
							bind:value={userInput}
							placeholder={waitingForConfirmation ? "Type 'yes' to start..." : waitingForStepFeedback ? "Describe what you'd like to change..." : isEditingMode ? "Edit your answer..." : "Type your answer..."}
							class="flex-1 text-base"
							onkeydown={handleKeyPress}
							autofocus
						/>
					{/if}
					<Button
						onclick={handleSubmit}
						disabled={!userInput.trim() && (waitingForStepFeedback || (!waitingForConfirmation && currentQuestionIndex >= 0 && questions[currentQuestionIndex]?.required))}
						class="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
						size="lg"
					>
						{#if isEditingMode}
							<Edit2 class="h-5 w-5" />
						{:else}
							<Send class="h-5 w-5" />
						{/if}
					</Button>
					{#if isEditingMode}
						<Button 
							variant="ghost" 
							onclick={() => {
								isEditingMode = false;
								editingQuestionIndex = -1;
								userInput = '';
								showSuggestions = false;
								currentSuggestions = [];
								
								// Restore to where we were before editing
								if (returnToQuestionIndex >= 0) {
									currentQuestionIndex = returnToQuestionIndex;
									returnToQuestionIndex = -1;
									
									// Restore the UI state for the current question
									if (currentQuestionIndex < questions.length) {
										const currentQ = questions[currentQuestionIndex];
										isMultiline = currentQ.type === 'textarea';
										showSuggestions = currentQ.type === 'text-with-suggestions';
										if (showSuggestions && currentQ.suggestions) {
											currentSuggestions = currentQ.suggestions;
										}
									}
								}
							}} 
							size="lg"
						>
							Cancel
						</Button>
					{:else if !waitingForConfirmation && isCurrentQuestionOptional}
						<Button variant="ghost" onclick={handleSkip} size="lg">Skip</Button>
					{/if}
				</div>
				<!-- Keyboard Shortcuts Hint -->
				<div class="text-xs text-muted-foreground text-left mt-2">
					<kbd class="px-1.5 py-0.5 rounded bg-muted border border-border text-xs">Enter</kbd> to send • 
					<kbd class="px-1.5 py-0.5 rounded bg-muted border border-border text-xs">Shift</kbd> + 
					<kbd class="px-1.5 py-0.5 rounded bg-muted border border-border text-xs">Enter</kbd> for new line
				</div>
			{/if}

			<!-- Generate Button (shown after conversation complete) -->
			{#if conversationComplete && !isEditingMode && !waitingForStepFeedback && !isGeneratingGuidelines}
				<Button
					onclick={handleGenerate}
					disabled={!canGenerate}
					class="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
					size="lg"
				>
					<Sparkles class="mr-2 h-5 w-5" />
					Generate Brand Guidelines
				</Button>
			{/if}
		</div>
	</CardContent>
</Card>

