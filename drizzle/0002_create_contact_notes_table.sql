CREATE TABLE "contact_notes" (
  "id" SERIAL PRIMARY KEY,
  "contact_id" INT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  "note" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);