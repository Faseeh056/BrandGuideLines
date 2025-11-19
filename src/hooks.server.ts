import { handle as authHandle } from '$lib/auth';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env file explicitly (Vite may not load all variables into process.env)
// This ensures Google_Gemini_Api and other variables are available
try {
	const envPath = resolve(process.cwd(), '.env');
	config({ path: envPath });
	console.log('[hooks] ✓ .env file loaded from:', envPath);
} catch (error) {
	console.warn('[hooks] ⚠️ Could not load .env file:', error);
}

export const handle = authHandle;
