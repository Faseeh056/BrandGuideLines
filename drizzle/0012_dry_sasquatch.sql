ALTER TABLE "generated_slides" ALTER COLUMN "htmlContent" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "generated_slides" ALTER COLUMN "svelteContent" SET NOT NULL;