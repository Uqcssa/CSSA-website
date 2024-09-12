CREATE TABLE IF NOT EXISTS "merchants" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"title" text NOT NULL,
	"created" timestamp DEFAULT now(),
	"address" text NOT NULL,
	"discountInformation" text NOT NULL
);
