-- 0016_add_logo_columns.sql
-- Add logo columns to brand_builder_chats and generated_slides tables
-- Remove logo_assets table as logos are now stored directly in chat and slides tables

-- Add logo column to brand_builder_chats table
ALTER TABLE brand_builder_chats
ADD COLUMN IF NOT EXISTS logo text;

-- Add logo column to generated_slides table
ALTER TABLE generated_slides
ADD COLUMN IF NOT EXISTS logo text;

-- Drop logo_assets table (optional - uncomment if you want to remove it)
-- Note: Make sure to migrate any existing logo data before dropping
-- DROP TABLE IF EXISTS logo_assets;

