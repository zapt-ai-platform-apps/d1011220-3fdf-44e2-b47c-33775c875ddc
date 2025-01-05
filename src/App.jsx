import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import AuthComponent from './components/Auth';
import ContactsList from './components/ContactsList';

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    }

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen h-full flex flex-col text-gray-800">
      {!session ? (
        <AuthComponent />
      ) : (
        <ContactsList session={session} />
      )}
    </div>
  );
}