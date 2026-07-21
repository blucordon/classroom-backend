ALTER TABLE "demo_users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "demo_users" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "demo_users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "demo_users" ADD CONSTRAINT "demo_users_email_unique" UNIQUE("email");