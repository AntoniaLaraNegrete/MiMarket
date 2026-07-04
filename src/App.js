import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Auth from './Auth';
import MiMarket from './MiMarket';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #F97316, #FBBF24)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 22 }}>🏪</div>
          <p style={{ color: '#6B7280', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>Cargando MiMarket...</p>
        </div>
      </div>
    );
  }

  if (!session) return <Auth />;

  return <MiMarket session={session} />;
}
