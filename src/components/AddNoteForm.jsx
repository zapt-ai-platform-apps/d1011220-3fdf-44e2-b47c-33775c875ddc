import React, { useState } from 'react';
import { addNote } from '../services/contactService';

export default function AddNoteForm({ contactId, onNoteAdded }) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    setLoading(true);
    const response = await addNote({ contactId, note });
    if (response.ok) {
      setNote('');
      onNoteAdded();
      console.log('Note added successfully');
    } else {
      console.error('Failed to add note');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleAddNote} className="mt-2">
      <input
        type="text"
        name="note"
        placeholder="Add a note"
        className="border p-2 rounded w-full box-border"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded mt-2 cursor-pointer"
      >
        {loading ? 'Adding Note...' : 'Add Note'}
      </button>
    </form>
  );
}