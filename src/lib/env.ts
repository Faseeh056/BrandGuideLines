// Environment variable loader for SvelteKit
// This file should only be used server-side
// For client-side, use $env/static/public or import.meta.env

// Note: Vite automatically loads .env files for server-side code in SvelteKit
// All variables from .env are available in process.env on the server
// No need to manually load dotenv - Vite handles it automatically

// Helper to safely access process.env (server-side only)
function getEnvVar(key: string, fallback: string = ''): string {
	// Check if we're in a Node.js environment
	if (typeof process !== 'undefined' && process.env) {
		// Try exact key first
		let value = process.env[key];
		
		// If not found, try common variations (case-insensitive search)
		if (!value) {
			const upperKey = key.toUpperCase();
			const lowerKey = key.toLowerCase();
			// Check all possible variations
			value = process.env[upperKey] || 
			        process.env[lowerKey] || 
			        process.env[key] ||
			        Object.keys(process.env).find(k => k.toUpperCase() === upperKey) 
			          ? process.env[Object.keys(process.env).find(k => k.toUpperCase() === upperKey)!]
			          : undefined;
		}
		
		if (!value) return fallback;
		// Trim whitespace and remove surrounding quotes if present
		return value.trim().replace(/^["']|["']$/g, '');
	}
	// Client-side fallback (shouldn't happen, but safe)
	return fallback;
}

// Export environment variables with fallbacks
// This object is created at module load time, so it's safe
// Using a function to ensure it's always defined even if process.env is not available
function createEnv() {
	const authTrustHostValue = getEnvVar('AUTH_TRUST_HOST');
	const isDevelopment = getEnvVar('NODE_ENV', 'development').toLowerCase() !== 'production';
	
	return {
		// Auth
		AUTH_SECRET: getEnvVar('AUTH_SECRET', 'fallback-secret-key'),
		// Trust host if explicitly set to 'true', or default to true in development
		AUTH_TRUST_HOST: authTrustHostValue ? authTrustHostValue.toLowerCase() === 'true' : isDevelopment,

		// Google OAuth - Check process.env directly with fallbacks
		AUTH_GOOGLE_ID: (() => {
			if (typeof process !== 'undefined' && process.env) {
				// Try all possible variable names
				const possibleKeys = [
					'GOOGLE_CLIENT_ID',
					'AUTH_GOOGLE_ID',
					'google_client_id'
				];
				
				for (const key of possibleKeys) {
					const value = process.env[key];
					if (value) {
						const cleaned = value.trim().replace(/^["']|["']$/g, '').replace(/^https?:\/\//, '');
						if (cleaned) {
							console.log(`[env] ✓ Found ${key} in process.env`);
							return cleaned;
						}
					}
				}
				
				// Case-insensitive search
				const envKeys = Object.keys(process.env);
				const googleIdKey = envKeys.find(k => 
					k.toUpperCase().includes('GOOGLE_CLIENT_ID') || 
					k.toUpperCase().includes('AUTH_GOOGLE_ID')
				);
				if (googleIdKey && process.env[googleIdKey]) {
					const cleaned = process.env[googleIdKey].trim().replace(/^["']|["']$/g, '').replace(/^https?:\/\//, '');
					if (cleaned) {
						console.log(`[env] ✓ Found ${googleIdKey} (case-insensitive) in process.env`);
						return cleaned;
					}
				}
			}
			// Fallback to getEnvVar
			const fallback = (getEnvVar('AUTH_GOOGLE_ID') || getEnvVar('GOOGLE_CLIENT_ID', '')).replace(/^https?:\/\//, '');
			if (!fallback) {
				console.error('[env] ✗ GOOGLE_CLIENT_ID NOT FOUND in process.env!');
			}
			return fallback;
		})(),
		AUTH_GOOGLE_SECRET: (() => {
			if (typeof process !== 'undefined' && process.env) {
				// Try all possible variable names
				const possibleKeys = [
					'GOOGLE_CLIENT_SECRET',
					'AUTH_GOOGLE_SECRET',
					'google_client_secret'
				];
				
				for (const key of possibleKeys) {
					const value = process.env[key];
					if (value) {
						const cleaned = value.trim().replace(/^["']|["']$/g, '');
						if (cleaned) {
							console.log(`[env] ✓ Found ${key} in process.env`);
							return cleaned;
						}
					}
				}
				
				// Case-insensitive search
				const envKeys = Object.keys(process.env);
				const googleSecretKey = envKeys.find(k => 
					k.toUpperCase().includes('GOOGLE_CLIENT_SECRET') || 
					k.toUpperCase().includes('AUTH_GOOGLE_SECRET')
				);
				if (googleSecretKey && process.env[googleSecretKey]) {
					const cleaned = process.env[googleSecretKey].trim().replace(/^["']|["']$/g, '');
					if (cleaned) {
						console.log(`[env] ✓ Found ${googleSecretKey} (case-insensitive) in process.env`);
						return cleaned;
					}
				}
			}
			// Fallback to getEnvVar
			const fallback = getEnvVar('AUTH_GOOGLE_SECRET') || getEnvVar('GOOGLE_CLIENT_SECRET', '');
			if (!fallback) {
				console.error('[env] ✗ GOOGLE_CLIENT_SECRET NOT FOUND in process.env!');
			}
			return fallback;
		})(),

		// GitHub OAuth
		AUTH_GITHUB_ID: getEnvVar('AUTH_GITHUB_ID'),
		AUTH_GITHUB_SECRET: getEnvVar('AUTH_GITHUB_SECRET'),

		// Database
		DATABASE_URL: getEnvVar('DATABASE_URL'),

		// Email
		EMAIL_SERVER_HOST: getEnvVar('EMAIL_SERVER_HOST'),
		EMAIL_SERVER_PORT: getEnvVar('EMAIL_SERVER_PORT') ? Number(getEnvVar('EMAIL_SERVER_PORT')) : 587,
		EMAIL_SERVER_USER: getEnvVar('EMAIL_SERVER_USER'),
		EMAIL_SERVER_PASSWORD: getEnvVar('EMAIL_SERVER_PASSWORD'),
		EMAIL_FROM: getEnvVar('EMAIL_FROM') || getEnvVar('EMAIL_SERVER_USER'),

		// Google Gemini API - PRIMARY: Use Google_Gemini_Api (as specified in .env)
		// IMPORTANT: Restart dev server after changing .env file!
		GOOGLE_GEMINI_API: (() => {
			if (typeof process !== 'undefined' && process.env) {
				// PRIMARY: Try Google_Gemini_Api first (as user specified)
				const primaryKey = 'Google_Gemini_Api';
				let value = process.env[primaryKey];
				
				if (value) {
					const cleaned = value.trim().replace(/^["']|["']$/g, '');
					if (cleaned) {
						console.log('[env] ✓ Found Google_Gemini_Api in process.env');
						return cleaned;
					}
				}
				
				// Fallback: Try all other possible variable names
				const possibleKeys = [
					'GOOGLE_GEMINI_API',
					'GOOGLE_AI_API_KEY',
					'google_gemini_api',
					'GOOGLE_GEMINI_API_KEY'
				];
				
				for (const key of possibleKeys) {
					value = process.env[key];
					if (value) {
						const cleaned = value.trim().replace(/^["']|["']$/g, '');
						if (cleaned) {
							console.log(`[env] ✓ Found ${key} in process.env`);
							return cleaned;
						}
					}
				}
				
				// Also try case-insensitive search as last resort
				const envKeys = Object.keys(process.env);
				const geminiKey = envKeys.find(k => 
					k.toUpperCase().includes('GEMINI') || 
					k.toUpperCase().includes('GOOGLE_AI')
				);
				if (geminiKey && process.env[geminiKey]) {
					const cleaned = process.env[geminiKey].trim().replace(/^["']|["']$/g, '');
					if (cleaned) {
						console.log(`[env] ✓ Found ${geminiKey} (case-insensitive) in process.env`);
						return cleaned;
					}
				}
			}
			// Fallback to getEnvVar helper
			const fallback = getEnvVar('Google_Gemini_Api') || 
			                 getEnvVar('GOOGLE_GEMINI_API') || 
			                 getEnvVar('GOOGLE_AI_API_KEY') || '';
			if (!fallback) {
				console.error('[env] ✗ Google_Gemini_Api NOT FOUND in process.env!');
				console.error('[env] Make sure:');
				console.error('[env]   1. .env file exists in project root');
				console.error('[env]   2. Variable is named: Google_Gemini_Api="your-key"');
				console.error('[env]   3. Dev server has been RESTARTED after changing .env');
			}
			return fallback;
		})(),

		// Environment
		NODE_ENV: getEnvVar('NODE_ENV', 'development')
	};
}

// Create and export env object
export const env = createEnv();

// Debug log (only on server-side, and only if process is available)
if (typeof process !== 'undefined' && process.env && typeof console !== 'undefined') {
	try {
		// Find all env vars related to Gemini/Google AI
		const geminiRelatedKeys = Object.keys(process.env).filter(k => 
			k.toUpperCase().includes('GEMINI') || 
			k.toUpperCase().includes('GOOGLE_AI') ||
			k.toUpperCase() === 'GOOGLE_GEMINI_API'
		);
		
		// Check for the primary key
		const primaryKeyValue = process.env.Google_Gemini_Api;
		const rawGemini = process.env.GOOGLE_GEMINI_API || process.env.Google_Gemini_Api || process.env.GOOGLE_AI_API_KEY || '';
		
		console.log('[env] ========== ENVIRONMENT VARIABLES DEBUG ==========');
			console.log('[env] Environment variables loaded:', {
				AUTH_GOOGLE_ID: env.AUTH_GOOGLE_ID ? `SET (${env.AUTH_GOOGLE_ID.substring(0, 20)}...)` : 'NOT SET',
				AUTH_GOOGLE_SECRET: env.AUTH_GOOGLE_SECRET ? `SET (${env.AUTH_GOOGLE_SECRET.substring(0, 10)}...)` : 'NOT SET',
				AUTH_SECRET: env.AUTH_SECRET ? 'SET' : 'NOT SET',
				AUTH_TRUST_HOST: env.AUTH_TRUST_HOST,
				GOOGLE_GEMINI_API: env.GOOGLE_GEMINI_API ? `SET (${env.GOOGLE_GEMINI_API.substring(0, 10)}...)` : 'NOT SET',
			'Raw GOOGLE_GEMINI_API': rawGemini ? `FOUND (${rawGemini.substring(0, 10)}...)` : 'NOT FOUND',
			'Raw Google_Gemini_Api': primaryKeyValue ? `FOUND (${primaryKeyValue.substring(0, 10)}...)` : 'NOT FOUND',
			'All Gemini-related keys in process.env': geminiRelatedKeys.length > 0 ? geminiRelatedKeys : 'NONE FOUND',
			'Total process.env keys': Object.keys(process.env).length
		});
		
		// Log the actual values (first 10 chars only for security)
		if (geminiRelatedKeys.length > 0) {
			console.log('[env] Gemini API key values found in process.env:');
			geminiRelatedKeys.forEach(key => {
				const value = process.env[key];
				if (value) {
					console.log(`  ${key}: ${value.substring(0, 10)}... (length: ${value.length}, trimmed: "${value.trim()}")`);
				}
			});
		} else {
			console.log('[env] WARNING: No Gemini-related keys found in process.env!');
			console.log('[env] Sample of available keys:', Object.keys(process.env).slice(0, 10));
		}
		
		// Specifically check Google_Gemini_Api
		if (process.env.Google_Gemini_Api) {
			console.log('[env] ✓ Google_Gemini_Api found:', process.env.Google_Gemini_Api.substring(0, 10) + '...');
		} else {
			console.log('[env] ✗ Google_Gemini_Api NOT found in process.env');
		}
		
		console.log('[env] ================================================');
	} catch (e) {
		console.error('[env] Error in debug logging:', e);
	}
}
