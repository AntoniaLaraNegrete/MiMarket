import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Auth from './Auth';
import MiMarketApp from './MiMarketApp';
import AdminPanel from './AdminPanel';

const ADMIN_EMAIL = 'antonialaranegrete@gmail.com';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0F1923' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#F97316,#FB923C)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:22 }}>🏪</div>
        <p style={{ color:'#8FA3B1', fontSize:14, fontFamily:'Inter,sans-serif' }}>Cargando MiMarket...</p>
      </div>
    </div>
  );

  if (!session) return <Auth />;

  // Panel de administración solo para ti
  const isAdmin = session.user.email === ADMIN_EMAIL;
  if (isAdmin && showAdmin) return <AdminPanel onExit={() => setShowAdmin(false)} />;

  return (
    <MiMarketApp
      session={session}
      onLogout={() => supabase.auth.signOut()}
      isOwner={isAdmin}
      onOpenAdmin={() => setShowAdmin(true)}
    />
  );
}
