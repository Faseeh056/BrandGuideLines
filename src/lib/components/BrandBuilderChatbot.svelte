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
	import { getEssentialQuestions } from '$lib/services/industry-questions';

	// Props
	export let questions: any[] = [];
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
	let textInput: HTMLInputElement | null = null;
	let textareaInput: HTMLTextAreaElement | null = null;
	let logoPreview: string | null = null;
	let logoFile: File | null = null;
	let isMultiline = false;
	let showSuggestions = false;
	let currentSuggestions: string[] = [];
	let conversationComplete = false;
	let waitingForConfirmation = false; // Changed: Start with prompt input
	let isEditingMode = false;
	let editingQuestionIndex = -1;
	let returnToQuestionIndex = -1; // Remember where we were before editing
	let isGeneratingGuidelines = false; // Track if we're in generation phase
	let waitingForStepFeedback = false; // Track if we're waiting for user feedback for regeneration
	let currentRegeneratingStepIndex = -1; // Track which step is being regenerated
	
	// New state for enhanced flow
	let waitingForInitialPrompt = true; // NEW: Wait for user's initial prompt
	let isAnalyzingPrompt = false; // NEW: Track if we're analyzing the prompt
	let promptAnalysis: any = null; // NEW: Store analysis results
	let industryQuestions: any[] = []; // NEW: Industry-specific questions
	let allQuestions: any[] = []; // NEW: Combined essential + industry questions
	let hasFetchedIndustryQuestions = false; // NEW: Track if we've already fetched industry questions
	let collectedInfo: {
		brandName?: string;
		industry?: string;
		style?: string;
		audience?: string;
		description?: string;
		values?: string;
		industrySpecificInfo?: Record<string, any>;
	} = {}; // NEW: Collected information

let groundingData: any = null;
let groundingIndustry: string | null = null;
let isFetchingGroundingData = false;
let hasAnnouncedGrounding = false;

	// Focus input when appropriate
	$: if ((!waitingForConfirmation && !conversationComplete) && (textInput || textareaInput)) {
		// Use setTimeout to avoid autofocus conflicts
		setTimeout(() => {
			const elementToFocus = textareaInput || textInput;
			if (elementToFocus && document.activeElement !== elementToFocus) {
				elementToFocus.focus();
			}
		}, 150);
	}

	// Initialize chat on mount
	onMount(async () => {
		// Check if we have saved messages in sessionStorage (browser only)
		let savedMessages: string | null = null;
		let savedState: string | null = null;
		
		if (typeof window !== 'undefined' && window.sessionStorage) {
			savedMessages = sessionStorage.getItem('brandBuilderChatMessages');
			savedState = sessionStorage.getItem('brandBuilderChatState');
		}
		
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
				waitingForInitialPrompt = parsedState.waitingForInitialPrompt ?? true;
				isAnalyzingPrompt = parsedState.isAnalyzingPrompt ?? false;
				allQuestions = parsedState.allQuestions ?? [];
				collectedInfo = parsedState.collectedInfo ?? {};
				hasFetchedIndustryQuestions = parsedState.hasFetchedIndustryQuestions ?? false;
				isGeneratingGuidelines = parsedState.isGeneratingGuidelines ?? false;
				waitingForStepFeedback = parsedState.waitingForStepFeedback ?? false;
				currentRegeneratingStepIndex = parsedState.currentRegeneratingStepIndex ?? -1;
				groundingData = parsedState.groundingData ?? null;
				groundingIndustry = parsedState.groundingIndustry ?? null;
				hasAnnouncedGrounding = parsedState.hasAnnouncedGrounding ?? false;
				
				// Restore UI state
				const questionsToUse = allQuestions.length > 0 ? allQuestions : questions;
				if (currentQuestionIndex >= 0 && currentQuestionIndex < questionsToUse.length) {
					const currentQ = questionsToUse[currentQuestionIndex];
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
			"👋 Hi! I'm your Brand Builder Assistant. I'll help you create comprehensive brand guidelines.\n\n**Please describe what you'd like to create.** You can tell me about your brand name, industry, style preferences, or any other details you have in mind. I'll analyze your input and ask any additional questions needed!"
		);
	});
	
	// Save messages to sessionStorage whenever they change (debounced to avoid too many writes)
	// Only run in browser (not during SSR)
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;
	$: if (typeof window !== 'undefined' && messages.length >= 0) { // Save even if empty to track state
		if (saveTimeout) clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			try {
				if (typeof window !== 'undefined' && window.sessionStorage) {
					sessionStorage.setItem('brandBuilderChatMessages', JSON.stringify(messages));
					sessionStorage.setItem('brandBuilderChatState', JSON.stringify({
						currentQuestionIndex,
						answers,
						conversationComplete,
						waitingForConfirmation,
						waitingForInitialPrompt,
						isAnalyzingPrompt,
						allQuestions,
						collectedInfo,
						hasFetchedIndustryQuestions,
						isGeneratingGuidelines,
						waitingForStepFeedback,
						currentRegeneratingStepIndex,
						groundingData,
						groundingIndustry,
						hasAnnouncedGrounding
					}));
				}
			} catch (error) {
				console.error('Failed to save chat state:', error);
			}
		}, 100); // Debounce by 100ms
	}

	// Delay helper
	function delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

async function ensureGroundingDataForIndustry(industry?: string) {
	const normalizedIndustry = typeof industry === 'string' ? industry.trim() : '';
	if (!normalizedIndustry) return;

	const industryChanged =
		!groundingIndustry || groundingIndustry.toLowerCase() !== normalizedIndustry.toLowerCase();

	if (!industryChanged && groundingData) {
		return;
	}

	if (isFetchingGroundingData) {
		return;
	}

	isFetchingGroundingData = true;

	try {
		if (!hasAnnouncedGrounding || industryChanged) {
			await sendBotMessage(
				`🌐 Let me research successful ${normalizedIndustry} brands so I can tailor the next questions.`
			);
			hasAnnouncedGrounding = true;
		}

		const response = await fetch('/api/grounding-search', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ industry: normalizedIndustry })
		});

		if (!response.ok) {
			throw new Error('Failed to fetch grounding search data');
		}

		const result = await response.json();
		if (result?.groundingData) {
			groundingData = result.groundingData;
			groundingIndustry = normalizedIndustry;
			await sendBotMessage(
				`📊 I analyzed ${groundingData.websites.length} real ${normalizedIndustry} brands. I'll keep those insights in mind for our follow-up questions.`
			);
		}
	} catch (error) {
		console.error('Grounding search failed:', error);
		if (industryChanged || !groundingData) {
			await sendBotMessage(
				`⚠️ I couldn't analyze ${normalizedIndustry} websites right now, but I'll continue with what we have.`
			);
		}
	} finally {
		isFetchingGroundingData = false;
	}
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
		
		// Use allQuestions if available, otherwise fall back to questions prop
		const questionsToUse = allQuestions.length > 0 ? allQuestions : questions;
		
		// Safety check: ensure question exists
		if (questionIndex < 0 || questionIndex >= questionsToUse.length) {
			console.error('Invalid question index for editing:', questionIndex);
			return;
		}
		
		const q = questionsToUse[questionIndex];
		if (!q) {
			console.error('Question not found at index:', questionIndex);
			return;
		}
		
		isEditingMode = true;
		editingQuestionIndex = questionIndex;
		currentQuestionIndex = questionIndex;
		
		// Pre-fill input with previous answer
		const previousAnswer = answers[q.id];
		if (previousAnswer && typeof previousAnswer === 'string') {
			userInput = previousAnswer;
		} else {
			userInput = '';
		}
		
		// Scroll to bottom to show input
		await scrollToBottom();
		
		// Re-show the question and update UI state
		showSuggestions = q.type === 'text-with-suggestions';
		if (showSuggestions && q.suggestions) {
			currentSuggestions = q.suggestions;
		} else {
			currentSuggestions = [];
		}
		isMultiline = q.type === 'textarea';
	}

	// NEW: Analyze user prompt and generate questions
	async function analyzePromptAndGenerateQuestions(userPrompt: string) {
		isAnalyzingPrompt = true;
		await sendBotMessage("🔍 Analyzing your prompt... Let me understand what you need!");
		
		try {
			// If conversation was already complete, reset state for new prompt
			if (conversationComplete) {
				// Reset conversation state for new prompt
				conversationComplete = false;
				isGeneratingGuidelines = false; // Reset generation state
				hasFetchedIndustryQuestions = false;
				answers = {}; // Clear old answers
				industryQuestions = []; // Clear old industry questions
				allQuestions = []; // Clear old questions
				currentQuestionIndex = -1; // Reset question index
				// Keep collectedInfo but will update it with new analysis
				groundingData = null;
				groundingIndustry = null;
				hasAnnouncedGrounding = false;
				isFetchingGroundingData = false;
			}
			
			// Analyze the prompt
			const response = await fetch('/api/brand-builder/analyze-prompt', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userPrompt })
			});

			if (!response.ok) {
				// Try to get error details from response
				let errorMessage = 'Failed to analyze prompt';
				try {
					const errorData = await response.json();
					errorMessage = errorData.error || errorData.message || errorMessage;
					console.error('[chatbot] Prompt analysis error:', errorData);
				} catch (e) {
					console.error('[chatbot] Failed to parse error response:', e);
				}
				throw new Error(errorMessage);
			}

			const result = await response.json();
			
			if (!result.success || !result.analysis) {
				throw new Error(result.error || 'Invalid response from analysis API');
			}
			
			promptAnalysis = result.analysis;

			// Store extracted info - OVERWRITE with new analysis (don't keep old values)
			collectedInfo = {}; // Reset collectedInfo first
			if (promptAnalysis.brandName) collectedInfo.brandName = promptAnalysis.brandName;
			if (promptAnalysis.industry) collectedInfo.industry = promptAnalysis.industry;
			if (promptAnalysis.style) collectedInfo.style = promptAnalysis.style;
			if (promptAnalysis.audience) collectedInfo.audience = promptAnalysis.audience;
			if (promptAnalysis.description) collectedInfo.description = promptAnalysis.description;
			if (promptAnalysis.values) collectedInfo.values = promptAnalysis.values;

			if (collectedInfo.industry) {
				await ensureGroundingDataForIndustry(collectedInfo.industry);
			}

			await delay(500);

			if (promptAnalysis.hasCompleteInfo) {
				await sendBotMessage(
					"✅ Great! I found most of the information in your prompt. Let me confirm a few details and ask some follow-up questions."
				);
			} else {
				await sendBotMessage(
					`I've analyzed your prompt. I found some information, but I need a few more details to create your brand guidelines. Let me ask you some questions!`
				);
			}

			await delay(800);

			// Get essential questions
			const essentialQuestions = getEssentialQuestions({
				brandName: promptAnalysis.brandName,
				industry: promptAnalysis.industry,
				style: promptAnalysis.style
			});

			allQuestions = [...essentialQuestions];

			// If industry is known, get industry-specific questions
			if (promptAnalysis.industry || essentialQuestions.find(q => q.id === 'industry')) {
				// We'll get industry questions after industry is selected
			}

			// Start asking questions
			if (allQuestions.length > 0) {
				currentQuestionIndex = -1;
				await askNextQuestion();
			} else {
				// No questions needed, proceed to industry questions or generation
				await handleQuestionsComplete();
			}
		} catch (error) {
			console.error('Error analyzing prompt:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			
			// Provide more specific error messages
			let userFriendlyMessage = "⚠️ I encountered an error analyzing your prompt. ";
			if (errorMessage.includes('API key') || errorMessage.includes('GOOGLE_GEMINI_API')) {
				userFriendlyMessage += "The AI service is not properly configured. Please contact support.";
			} else if (errorMessage.includes('Authentication')) {
				userFriendlyMessage += "Please make sure you're logged in and try again.";
			} else if (errorMessage.includes('Failed to analyze')) {
				userFriendlyMessage += "Please try again with a more detailed prompt.";
			} else {
				userFriendlyMessage += "Please try again or provide more details.";
			}
			
			await sendBotMessage(userFriendlyMessage);
		} finally {
			isAnalyzingPrompt = false;
		}
	}

	// NEW: Handle when essential questions are complete
	async function handleQuestionsComplete() {
		// Prevent multiple calls
		if (hasFetchedIndustryQuestions) {
			await finishConversation();
			return;
		}
		
		// Check if we have industry, then get industry-specific questions
		const industry = collectedInfo.industry || answers['industry'];
		
		if (industry) {
		await ensureGroundingDataForIndustry(industry);

			// Mark as fetched immediately to prevent duplicate calls
			hasFetchedIndustryQuestions = true;
			
			await delay(500);
			await sendBotMessage(`Great! Now let me ask a few ${industry}-specific questions to create more accurate guidelines.`);
			
			try {
				// Get already asked question IDs to prevent duplicates
				const alreadyAskedIds = allQuestions.map(q => q.id);
				const alreadyAskedTexts = allQuestions.map(q => q.question).filter(Boolean);
				
				const response = await fetch('/api/brand-builder/industry-questions', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						industry: industry,
						existingInfo: {
							brandName: collectedInfo.brandName || answers['brandName'],
							style: collectedInfo.style || answers['style'],
							audience: collectedInfo.audience || answers['audience']
						},
						alreadyAskedQuestionIds: alreadyAskedIds, // Pass already asked IDs
						askedQuestions: alreadyAskedTexts,
						groundingData
					})
				});

				if (response.ok) {
					const result = await response.json();
					const newIndustryQuestions: IndustryQuestion[] = result.questions || [];
					
					if (newIndustryQuestions.length > 0) {
						// Deduplicate: only add questions that don't already exist (by ID)
						const existingQuestionIds = new Set(allQuestions.map(q => q.id));
						const uniqueNewQuestions = newIndustryQuestions.filter(q => !existingQuestionIds.has(q.id));
						
						if (uniqueNewQuestions.length > 0) {
							industryQuestions = uniqueNewQuestions;
							// Add only unique questions to the queue
							allQuestions = [...allQuestions, ...uniqueNewQuestions];
							await askNextQuestion();
						} else {
							// All questions were duplicates, finish
							console.log('[chatbot] All industry questions were duplicates, finishing conversation');
							await finishConversation();
						}
					} else {
						// No industry questions, finish and start generation
						await finishConversation();
					}
				} else {
					// If industry questions fail, just proceed
					await finishConversation();
				}
			} catch (error) {
				console.error('Error getting industry questions:', error);
				await finishConversation();
			}
		} else {
			// No industry yet, finish conversation
			await finishConversation();
		}
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

		// Use allQuestions if available, otherwise fall back to questions prop
		const questionsToUse = allQuestions.length > 0 ? allQuestions : questions;

		// Check if we've reached the end of questions
		if (currentQuestionIndex >= questionsToUse.length) {
			// Only call handleQuestionsComplete if we haven't already fetched industry questions
			// This prevents infinite loops
			if (!hasFetchedIndustryQuestions) {
				await handleQuestionsComplete();
			} else {
				// Already fetched industry questions, just finish
				await finishConversation();
			}
			return;
		}

		const q = questionsToUse[currentQuestionIndex];
		
		// Safety check: ensure question exists
		if (!q) {
			console.error('Question is undefined at index:', currentQuestionIndex);
			await finishConversation();
			return;
		}
		
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

		// NEW: Handle initial prompt
		if (waitingForInitialPrompt) {
			if (!userInput.trim()) return;

			await sendUserMessage(userInput.trim());
			const prompt = userInput.trim();
			userInput = '';
			waitingForInitialPrompt = false;
			
			await delay(500);
			await analyzePromptAndGenerateQuestions(prompt);
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
		const questionsToUse = allQuestions.length > 0 ? allQuestions : questions;
		
		// Safety check: if we're in question mode, ensure currentQuestion exists
		if (currentQuestionIndex >= 0 && currentQuestionIndex < questionsToUse.length) {
			if (!userInput.trim()) {
				const q = questionsToUse[currentQuestionIndex];
				if (q && q.required) {
					await sendBotMessage("⚠️ This field is required. Please provide an answer.");
					return;
				}
			}

			if (userInput.trim()) {
				const currentQuestion = questionsToUse[currentQuestionIndex];
				if (!currentQuestion) {
					console.error('Current question is undefined at index:', currentQuestionIndex);
					return;
				}
				
				answers[currentQuestion.id] = userInput.trim();
			
				// Update collectedInfo for essential fields
				if (currentQuestion.id === 'brandName') collectedInfo.brandName = userInput.trim();
				if (currentQuestion.id === 'industry') {
					collectedInfo.industry = userInput.trim();
					// Industry changed, we'll get industry questions after this question
					await ensureGroundingDataForIndustry(userInput.trim());
				}
				if (currentQuestion.id === 'style') collectedInfo.style = userInput.trim();

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
		} else if (userInput.trim() && !waitingForInitialPrompt && !waitingForConfirmation) {
			// Free-form chat mode: allow user to send messages at any time (like a normal chatbot)
			// This handles cases where user wants to ask questions or provide additional info
			// OR start a completely new brand guideline generation
			
			const prompt = userInput.trim();
			await sendUserMessage(prompt);
			userInput = '';
			
			// Show typing indicator
			isTyping = true;
			await delay(500);
			
			// Analyze the prompt and respond accordingly
			try {
				// If conversation is complete, treat this as a new brand guideline request
				// but keep previous messages for context/history
				if (conversationComplete) {
					await sendBotMessage("🆕 Starting a fresh plan—I'll keep our previous conversation for reference.");
					conversationComplete = false;
				}
				
				await analyzePromptAndGenerateQuestions(prompt);
			} catch (error) {
				console.error('Error handling free-form prompt:', error);
				await sendBotMessage("I'm here to help you create brand guidelines. Please answer the questions above, or describe what you'd like to create!");
			} finally {
				isTyping = false;
			}
		}
	}

	// Handle suggestion chip click
	async function handleSuggestionClick(suggestion: string) {
		const questionsToUse = allQuestions.length > 0 ? allQuestions : questions;
		const currentQuestion = questionsToUse[currentQuestionIndex];
		answers[currentQuestion.id] = suggestion;
		
		// Update collectedInfo for essential fields
		if (currentQuestion.id === 'brandName') collectedInfo.brandName = suggestion;
		if (currentQuestion.id === 'industry') {
			collectedInfo.industry = suggestion;
			// Industry changed, we'll get industry questions after this question
		await ensureGroundingDataForIndustry(suggestion);
		}
		if (currentQuestion.id === 'style') collectedInfo.style = suggestion;

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
		const questionsToUse = allQuestions.length > 0 ? allQuestions : questions;
		const currentQuestion = questionsToUse[currentQuestionIndex];
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
		
		// Build summary from both collectedInfo and answers
		const summaryData: Record<string, any> = {};
		
		// Add collectedInfo first (from prompt analysis)
		if (collectedInfo.brandName) summaryData.brandName = collectedInfo.brandName;
		if (collectedInfo.industry) summaryData.industry = collectedInfo.industry;
		if (collectedInfo.style) summaryData.style = collectedInfo.style;
		if (collectedInfo.audience) summaryData.audience = collectedInfo.audience;
		
		// Add answers (from questions), but don't overwrite if already in summaryData
		Object.entries(answers).forEach(([key, value]) => {
			if (value && key !== 'logo' && !summaryData[key]) {
				summaryData[key] = value;
			}
		});
		
		// Also ensure essential fields from answers are included (they might override collectedInfo if user answered)
		if (answers['brandName']) summaryData.brandName = answers['brandName'];
		if (answers['industry']) summaryData.industry = answers['industry'];
		if (answers['style']) summaryData.style = answers['style'];
		
		await sendBotMessage(
			"Here's a quick summary of what you provided:\n\n" +
				Object.entries(summaryData)
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
		// Use collectedInfo and answers to build formData
		const brandName = collectedInfo.brandName || answers['brandName'] || '';
		const industry = collectedInfo.industry || answers['industry'] || '';
		const style = collectedInfo.style || answers['style'] || '';
		const audience = collectedInfo.audience || answers['audience'] || '';
		const description = collectedInfo.description || answers['shortDescription'] || '';
		const values = collectedInfo.values || answers['brandValues'] || '';
		
		// Build industry-specific info from answers
		const industrySpecificInfo: Record<string, any> = {};
		industryQuestions.forEach(q => {
			if (answers[q.id]) {
				industrySpecificInfo[q.id] = answers[q.id];
			}
		});
		
		// Map industry to brandDomain (required by progressive generation)
		const brandDomain = industry || answers['brandDomain'] || '';
		
		// Generate shortDescription if not provided
		// Combine brand info into a meaningful description
		let shortDescription = description;
		if (!shortDescription) {
			const descriptionParts: string[] = [];
			if (brandName) descriptionParts.push(brandName);
			if (industry) descriptionParts.push(`a ${industry} company`);
			if (style) descriptionParts.push(`with a ${style} aesthetic`);
			if (audience) {
				descriptionParts.push(`targeting ${audience}`);
			}
			shortDescription = descriptionParts.length > 0 
				? descriptionParts.join(', ')
				: `${brandName || 'A brand'} in the ${industry || 'business'} industry`;
		}
		
		// Map answers back to the expected format
		const formData = {
			brandName: brandName,
			brandDomain: brandDomain, // Industry is used as brandDomain
			shortDescription: shortDescription, // Auto-generated if not provided
			brandValues: values,
			selectedMood: style || answers['selectedMood'] || '', // Style is used as mood
			selectedAudience: audience || answers['selectedAudience'] || '',
			contactName: answers['contactName'] || '',
			contactEmail: answers['contactEmail'] || '',
			contactRole: answers['contactRole'] || '',
			contactCompany: answers['contactCompany'] || '',
			customPrompt: answers['customPrompt'] || collectedInfo.description || '',
			logoData: answers['logo'], // Already in correct format from server upload
			groundingData: groundingData,
			// Include industry-specific info so progressive generator can use it
			industrySpecificInfo: industrySpecificInfo
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
		waitingForConfirmation = false;
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
		
		// Clear new state variables
		waitingForInitialPrompt = true;
		isAnalyzingPrompt = false;
		promptAnalysis = null;
		industryQuestions = [];
		allQuestions = [];
		hasFetchedIndustryQuestions = false;
		collectedInfo = {};
	groundingData = null;
	groundingIndustry = null;
	isFetchingGroundingData = false;
	hasAnnouncedGrounding = false;
		
		// Clear input element references
		textInput = null;
		textareaInput = null;
		logoPreview = null;
		logoFile = null;
		
		// Clear sessionStorage (browser only)
		try {
			if (typeof window !== 'undefined' && window.sessionStorage) {
				sessionStorage.removeItem('brandBuilderChatMessages');
				sessionStorage.removeItem('brandBuilderChatState');
			}
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

	// Check if we can generate based on collected info and answers
	$: internalCanGenerate = (() => {
		const brandName = collectedInfo.brandName || answers['brandName'] || '';
		const industry = collectedInfo.industry || answers['industry'] || '';
		const style = collectedInfo.style || answers['style'] || '';
		const hasLogo = answers['logo'] !== undefined && answers['logo'] !== null;
		
		// We can generate if we have brand name, industry, style, and logo
		return brandName.trim() !== '' && industry.trim() !== '' && style.trim() !== '' && hasLogo;
	})();

	// Use internal canGenerate if available, otherwise fall back to prop
	$: effectiveCanGenerate = internalCanGenerate || canGenerate;

	// Clear chat messages only (keeps conversation state)
	function clearChatMessages() {
		messages = [];
		isTyping = false;
		scrollToBottom();
		
		// Clear sessionStorage messages (browser only)
		try {
			if (typeof window !== 'undefined' && window.sessionStorage) {
				sessionStorage.removeItem('brandBuilderChatMessages');
			}
		} catch (error) {
			console.error('Failed to clear chat messages:', error);
		}
	}
</script>

<Card class="border-border/50 shadow-xl border-orange-500/20 bg-card/50 backdrop-blur-sm h-[1000px] flex flex-col w-[580px]">
	<CardHeader class="space-y-4 pb-4 flex-shrink-0 border-b border-border/50">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div>
					<h2 class="text-lg font-bold text-foreground">Brand Builder Assistant</h2>
					<p class="text-xs text-muted-foreground">AI-powered questionnaire</p>
				</div>
				{#if messages.length > 0}
					<Button
						onclick={clearChatMessages}
						variant="ghost"
						size="sm"
						class="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
						title="Clear chat messages"
					>
						<Trash2 class="h-4 w-4" />
					</Button>
				{/if}
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
					{@const shouldShowEdit = !waitingForConfirmation && message.type === 'user' && message.questionIndex !== undefined && message.questionIndex >= 0}
					<ChatMessage 
						{message} 
						canEdit={shouldShowEdit}
						onEdit={() => {
							if (message.questionIndex !== undefined && message.questionIndex >= 0) {
								handleEditAnswer(message.questionIndex);
							}
						}}
					/>
				{/if}
			{/each}

			{#if isFetchingGroundingData}
				<div class="grounding-indicator">
					<div class="grounding-dots">
						<span class="grounding-dot delay-0"></span>
						<span class="grounding-dot delay-1"></span>
						<span class="grounding-dot delay-2"></span>
					</div>
					<span class="grounding-text">
						Researching {collectedInfo.industry || answers['industry'] || 'industry'} sites…
					</span>
				</div>
			{/if}

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
				{@const questionsToUse = allQuestions.length > 0 ? allQuestions : questions}
				{@const editingQuestion = questionsToUse[editingQuestionIndex]}
				{#if editingQuestion}
					<div class="flex items-center gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
						<Edit2 class="h-4 w-4 text-orange-500" />
						<span class="text-sm text-foreground">
							Editing: <strong>{editingQuestion.question}</strong>
						</span>
					</div>
				{/if}
			{/if}
			
			<!-- Logo Options UI -->
			{#if !waitingForConfirmation && currentQuestionIndex >= 0 && !conversationComplete}
				{@const questionsToUse = allQuestions.length > 0 ? allQuestions : questions}
				{#if questionsToUse[currentQuestionIndex]?.type === 'logo'}
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
				{/if}
			{/if}
			
			<!-- Regular Input - Always show input field, even after conversation complete -->
			{#if !waitingForConfirmation || conversationComplete}
				<div class="flex items-end gap-2">
					{#if isMultiline && !waitingForConfirmation}
						<Textarea
							bind:ref={textareaInput}
							bind:value={userInput}
							placeholder={conversationComplete ? "Add more details or ask questions about your brand..." : "Type your answer..."}
							rows={3}
							class="flex-1 resize-none"
							onkeydown={handleKeyPress}
						/>
					{:else}
						<Input
							bind:ref={textInput}
							bind:value={userInput}
							placeholder={
								waitingForInitialPrompt 
									? "Describe your brand (e.g., 'Create brand for TechFlow, SaaS company, minimalistic')..." 
									: waitingForConfirmation 
										? "Type 'yes' to start..." 
										: waitingForStepFeedback 
											? "Describe what you'd like to change..." 
											: isEditingMode 
												? "Edit your answer..." 
												: conversationComplete
													? "Add more details or ask questions about your brand..."
													: "Type your answer..."
							}
							class="flex-1 text-base"
							onkeydown={handleKeyPress}
						/>
					{/if}
					<Button
						onclick={handleSubmit}
						disabled={!userInput.trim() && (waitingForStepFeedback || (!waitingForInitialPrompt && !waitingForConfirmation && !conversationComplete && currentQuestionIndex >= 0 && (allQuestions.length > 0 ? allQuestions[currentQuestionIndex] : questions[currentQuestionIndex])?.required))}
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
									const questionsToUse = allQuestions.length > 0 ? allQuestions : questions;
									if (currentQuestionIndex >= 0 && currentQuestionIndex < questionsToUse.length) {
										const currentQ = questionsToUse[currentQuestionIndex];
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
					{:else if !waitingForConfirmation && !conversationComplete && isCurrentQuestionOptional}
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

			<!-- Generate Button (shown after conversation complete, but not when editing) -->
			{#if conversationComplete && !isEditingMode && !waitingForStepFeedback && !isGeneratingGuidelines && !userInput.trim()}
				<Button
					onclick={handleGenerate}
					disabled={!effectiveCanGenerate}
					class="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg mt-2"
					size="lg"
				>
					<Sparkles class="mr-2 h-5 w-5" />
					Generate Brand Guidelines
				</Button>
			{/if}
		</div>
	</CardContent>
</Card>

<style>
	.grounding-indicator {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		margin-left: 2.25rem;
		margin-top: 0.1rem;
		font-size: 0.78rem;
		color: var(--muted-foreground);
	}

	:global(.dark) .grounding-indicator {
		color: rgba(226, 232, 240, 0.9);
	}

	.grounding-dots {
		display: flex;
		gap: 6px;
		align-items: center;
	}

	.grounding-dot {
		width: 8px;
		height: 8px;
		border-radius: 9999px;
		background: rgba(249, 115, 22, 0.8);
		animation: grounding-bounce 1.2s infinite ease-in-out;
	}

	.grounding-dot.delay-1 {
		animation-delay: 0.2s;
	}

	.grounding-dot.delay-2 {
		animation-delay: 0.4s;
	}

	@keyframes grounding-bounce {
		0%, 80%, 100% {
			transform: scale(0.6);
			opacity: 0.5;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.grounding-text {
		font-size: 0.85rem;
		color: inherit;
	}
</style>
