-- 0017_create_brand_logos_table.sql
-- Create brand_logos table to store logos for each brand guideline
-- The id matches brand_guidelines.id (chatId = brandGuidelinesId)

CREATE TABLE IF NOT EXISTS brand_logos (
	id text PRIMARY KEY REFERENCES brand_guidelines(id) ON DELETE cascade,
	logo text NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_brand_logos_id ON brand_logos(id);

