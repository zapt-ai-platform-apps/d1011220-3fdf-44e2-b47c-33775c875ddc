import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '../supabaseClient';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function AuthComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-800">
      <h1 className="text-2xl mb-4">Sign in with ZAPT</h1>
      <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="mb-4 text-blue-500 underline">Visit ZAPT</a>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google', 'facebook', 'apple']}
        socialLayout="horizontal"
      />
    </div>
  );
}