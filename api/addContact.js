import * as Sentry from '@sentry/node';
import { authenticateUser } from './_apiUtils.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { contacts } from '../drizzle/schema.js';

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

    const { name, phone, email, birthday, notes } = req.body;

    await db.insert(contacts).values({
      userId: user.id,
      name,
      phone,
      email,
      birthday: birthday || null,
      notes,
    });
    res.status(200).json({ message: 'Contact added successfully' });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error in addContact handler:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}