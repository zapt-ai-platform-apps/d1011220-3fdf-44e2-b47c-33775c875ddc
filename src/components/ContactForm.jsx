import React, { useState } from 'react';
import { addContact } from '../services/contactService';

export default function ContactForm({ onContactAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    birthday: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Adding contact...');
    const response = await addContact(formData);

    if (response.ok) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        birthday: '',
      });
      onContactAdded();
      console.log('Contact added successfully');
    } else {
      console.error('Failed to add contact');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2 rounded box-border"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="border p-2 rounded box-border"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 rounded box-border"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="date"
          name="birthday"
          placeholder="Birthday"
          className="border p-2 rounded box-border"
          value={formData.birthday}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 cursor-pointer"
      >
        {loading ? 'Adding...' : 'Add Contact'}
      </button>
    </form>
  );
}