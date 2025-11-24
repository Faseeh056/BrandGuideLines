CREATE TABLE IF NOT EXISTS "brand_builder_chats" (
    "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
    "title" text NOT NULL DEFAULT 'Untitled Chat',
    "brand_name" text,
    "messages" text,
    "state" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

