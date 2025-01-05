import * as Sentry from '@sentry/node';
import { authenticateUser } from './_apiUtils.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
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
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const user = await authenticateUser(req);

    const client = postgres(process.env.COCKROACH_DB_URL);
    const db = drizzle(client);

    const contactsData = await db
      .select()
      .from(contacts)
      .leftJoin(contactNotes, eq(contacts.id, contactNotes.contactId))
      .where(eq(contacts.userId, user.id));

    // Transform data to group notes per contact
    const contactsMap = new Map();

    contactsData.forEach((row) => {
      const contactId = row.contacts.id;
      if (!contactsMap.has(contactId)) {
        contactsMap.set(contactId, {
          ...row.contacts,
          notes: [],
        });
      }
      if (row.contactNotes && row.contactNotes.id) {
        contactsMap.get(contactId).notes.push({
          id: row.contactNotes.id,
          note: row.contactNotes.note,
          createdAt: row.contactNotes.createdAt,
        });
      }
    });

    const contactsList = Array.from(contactsMap.values());

    res.status(200).json(contactsList);
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error in getContacts handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}