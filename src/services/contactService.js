import { supabase } from '../supabaseClient';

export async function addContact(formData) {
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch('/api/addContact', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  return response;
}