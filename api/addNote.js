import * as Sentry from '@sentry/node';
import { authenticateUser } from './_apiUtils.js';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { contacts, contactNotes } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID,
    },
  },
});

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const user = await authenticateUser(req);
    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    const { contactId, note } = req.body;

    // Verify that the contact belongs to the user
    const contactExists = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, contactId))
      .then((results) => results[0]);

    if (!contactExists || contactExists.userId !== user.id) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    await db.insert(contactNotes).values({
      contactId,
      note,
    });

    res.status(200).json({ message: 'Note added successfully' });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error in addNote handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}