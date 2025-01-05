import { pgTable, serial, text, timestamp, uuid, date, integer } from 'drizzle-orm/pg-core';

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  birthday: date('birthday'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const contactNotes = pgTable('contact_notes', {
  id: serial('id').primaryKey(),
  contactId: integer('contact_id').notNull().references(() => contacts.id, { onDelete: 'cascade' }),
  note: text('note').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});