import postgres from 'postgres';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env' });

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/local';

async function main() {
	const sql = postgres(databaseUrl);
	try {
		await sql`ALTER TABLE "generated_slides" ADD COLUMN IF NOT EXISTS "svelteContent" text`;
		console.log('✅ Column "svelteContent" ensured on generated_slides');
	} finally {
		await sql.end();
	}
}

main().catch((error) => {
	console.error('❌ Failed to add svelteContent column:', error);
	process.exit(1);
});

