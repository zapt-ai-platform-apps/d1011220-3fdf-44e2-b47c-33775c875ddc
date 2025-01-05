import React, { useState, useEffect } from 'react';
import ContactForm from './ContactForm';
import AddNoteForm from './AddNoteForm';
import { supabase } from '../supabaseClient';
import { addNote } from '../services/contactService';

export default function ContactsList({ session }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchContacts = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Fetching contacts...');
    const response = await fetch('/api/getContacts', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const sortedContacts = data.sort((a, b) => {
        if (a.name < b.name) return sortOrder === 'asc' ? -1 : 1;
        if (a.name > b.name) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      setContacts(sortedContacts);
      console.log('Contacts fetched:', sortedContacts);
    } else {
      console.error('Failed to fetch contacts');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, [sortOrder]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="p-4 flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Contacts</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Sign Out
        </button>
      </div>
      <ContactForm onContactAdded={fetchContacts} />
      <div className="flex items-center mt-4">
        <label className="mr-2">Sort by Name:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="mt-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id} className="border p-2 my-2 rounded">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{contact.name}</h2>
                    <p>Phone: {contact.phone}</p>
                    <p>Email: {contact.email}</p>
                    <p>Birthday: {contact.birthday}</p>
                    <h3 className="font-semibold mt-2">Notes:</h3>
                    {contact.notes.length > 0 ? (
                      <ul className="list-disc ml-5">
                        {contact.notes.map((note) => (
                          <li key={note.id}>{note.note}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No notes yet.</p>
                    )}
                  </div>
                </div>
                <AddNoteForm contactId={contact.id} onNoteAdded={fetchContacts} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-auto">
        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500">
          Made on ZAPT
        </a>
      </div>
    </div>
  );
}