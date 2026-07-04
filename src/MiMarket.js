import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import MiMarketApp from './MiMarketApp';

export default function MiMarket({ session }) {
  const [org, setOrg]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrg() {
      const { data, error } = await supabase
        .from('organizaciones')
        .select('*')
        .eq('owner_id', session.user.id)
        .single();

      if (data) setOrg(data);
      setLoading(false);
    }
    loadOrg();
  }, [session]);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA' }}>
        <p style={{ color: '#6B7280', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>Cargando tu negocio...</p>
      </div>
    );
  }

  return (
    <MiMarketApp
      session={session}
      org={org}
      onLogout={handleLogout}
    />
  );
}
