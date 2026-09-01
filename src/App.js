import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Auth from './Auth';
import MiMarketApp from './MiMarketApp';
import AdminPanel from './AdminPanel';

const ADMIN_EMAIL = 'antonialaranegrete@gmail.com';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    let settled = false;

    // Si Supabase no responde en 10 segundos (ej: proyecto pausado por inactividad),
    // dejamos de esperar y mostramos un mensaje claro en vez de una pantalla congelada.
    const timeout = setTimeout(() => {
      if (!settled) { setConnectionError(true); setLoading(false); }
    }, 10000);

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        settled = true;
        clearTimeout(timeout);
        setSession(session);
        setLoading(false);
      })
      .catch(() => {
        settled = true;
        clearTimeout(timeout);
        setConnectionError(true);
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setConnectionError(false);
    });
    return () => { clearTimeout(timeout); subscription.unsubscribe(); };
  }, []);

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0F1923' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#F97316,#FB923C)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:22 }}>🏪</div>
        <p style={{ color:'#8FA3B1', fontSize:14, fontFamily:'Inter,sans-serif' }}>Cargando MiMarket...</p>
      </div>
    </div>
  );

  if (connectionError) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0F1923', padding:24 }}>
      <div style={{ textAlign:'center', maxWidth:320 }}>
        <div style={{ width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#F97316,#FB923C)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:26 }}>🔄</div>
        <p style={{ color:'#fff', fontSize:16, fontWeight:700, fontFamily:'Inter,sans-serif', marginBottom:8 }}>Estamos reconectando</p>
        <p style={{ color:'#8FA3B1', fontSize:13, fontFamily:'Inter,sans-serif', marginBottom:20, lineHeight:1.5 }}>
          Esto puede pasar si el sistema estuvo un tiempo sin uso. Un momento, ya casi está.
        </p>
        <button onClick={() => window.location.reload()} style={{
          background:'#F97316', color:'#fff', border:'none', padding:'12px 24px',
          borderRadius:12, fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Inter,sans-serif'
        }}>
          Reintentar
        </button>
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
