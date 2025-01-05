CREATE TABLE "contacts" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "email" TEXT,
  "birthday" DATE,
  "notes" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW()
);