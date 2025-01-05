import React, { useState, useEffect } from 'react';
import ContactForm from './ContactForm';
import { supabase } from '../supabaseClient';

export default function ContactsList({ session }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setContacts(data);
      console.log('Contacts fetched:', data);
    } else {
      console.error('Failed to fetch contacts');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

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
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id} className="border p-2 my-2 rounded">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{contact.name}</h2>
                    <p>{contact.notes}</p>
                    <p>Phone: {contact.phone}</p>
                    <p>Email: {contact.email}</p>
                    <p>Birthday: {contact.birthday}</p>
                  </div>
                  {/* Actions like Edit/Delete can be added here */}
                </div>
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