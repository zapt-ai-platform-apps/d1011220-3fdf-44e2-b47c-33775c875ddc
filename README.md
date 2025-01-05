# Contact Manager App

A simple contact manager app that allows users to store and organize contacts with details such as notes, social media handles, birthday, phone, and other relevant information. Users can categorize contacts into folders/groups, where one contact can be part of multiple groups.

## User Journeys

1. [Sign Up / Sign In](docs/journeys/sign-up-sign-in.md) - Access the app securely by signing up or signing in.
2. [Add a New Contact](docs/journeys/add-new-contact.md) - Create a new contact with relevant details.
3. [View Contacts](docs/journeys/view-contacts.md) - View all your saved contacts and sort them by name.
4. [Add Notes to a Contact](docs/journeys/add-notes-to-contact.md) - Add notes to a contact without editing the entire contact.
5. [Edit or Delete Contact](docs/journeys/edit-delete-contact.md) - Make changes to existing contacts or remove them.
6. [Create a Group](docs/journeys/create-group.md) - Organize contacts into groups.
7. [Assign Contact to Groups](docs/journeys/assign-contact-to-groups.md) - Add contacts to one or multiple groups.
8. [View Contacts by Group](docs/journeys/view-contacts-by-group.md) - View contacts filtered by groups.

## External API Services Used

- **Supabase Auth**: User authentication and session management.
- **Sentry**: Error logging and monitoring for both frontend and backend.
- **Postgres/Drizzle ORM**: Database and ORM for storing contact data.