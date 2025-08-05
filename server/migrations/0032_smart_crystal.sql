CREATE TABLE IF NOT EXISTS "eImages" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"name" text NOT NULL,
	"key" text NOT NULL,
	"image_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"address" text NOT NULL,
	"date" timestamp NOT NULL,
	"time" text NOT NULL,
	"created" timestamp DEFAULT now(),
	"status" varchar(20) DEFAULT 'active',
	"max_participants" integer,
	"current_participants" integer DEFAULT 0,
	"price" real DEFAULT 0,
	"organizer" text NOT NULL,
	"contact_info" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "eventTags" (
	"id" integer PRIMARY KEY NOT NULL,
	"tags" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "eventTagsTo" (
	"event_id" integer NOT NULL,
	"eventTags_id" integer NOT NULL,
	CONSTRAINT "eventTagsTo_event_id_eventTags_id_pk" PRIMARY KEY("event_id","eventTags_id")
);
--> statement-breakpoint
ALTER TABLE "mImages" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "mImages" ADD COLUMN "key" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "eImages" ADD CONSTRAINT "eImages_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "eventTagsTo" ADD CONSTRAINT "eventTagsTo_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "eventTagsTo" ADD CONSTRAINT "eventTagsTo_eventTags_id_eventTags_id_fk" FOREIGN KEY ("eventTags_id") REFERENCES "public"."eventTags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "mImages" DROP COLUMN IF EXISTS "size";--> statement-breakpoint
ALTER TABLE "mImages" DROP COLUMN IF EXISTS "merchant_type";--> statement-breakpoint
ALTER TABLE "mImages" DROP COLUMN IF EXISTS "order";--> statement-breakpoint
ALTER TABLE "mImages" DROP COLUMN IF EXISTS "created";