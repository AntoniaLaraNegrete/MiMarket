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
  // "revisando" | "ok" | "sin_codigo"
  const [acceso, setAcceso] = useState('revisando');
  const [codigoNuevo, setCodigoNuevo] = useState('');
  const [codigoError, setCodigoError] = useState('');
  const [codigoCargando, setCodigoCargando] = useState(false);

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

  // Cada vez que alguien entra, el servidor confirma que su cuenta tiene un código de acceso
  // canjeado (y si es su primer ingreso, lo canjea en ese momento, en un solo paso).
  const userId = session?.user?.id;
  useEffect(() => {
    if (!userId) { setAcceso('revisando'); return; }
    let cancelado = false;
    setAcceso('revisando');
    supabase.rpc('verificar_acceso')
      .then(({ data, error }) => {
        if (cancelado) return;
        // Si hay un error de conexión, no bloqueamos a un cliente que pagó:
        // la protección de los datos igual la hace la base de datos.
        if (error) { setAcceso('ok'); return; }
        setAcceso(data === true ? 'ok' : 'sin_codigo');
      })
      .catch(() => { if (!cancelado) setAcceso('ok'); });
    return () => { cancelado = true; };
  }, [userId]);

  async function activarConCodigo(e) {
    e.preventDefault();
    const codigo = codigoNuevo.toUpperCase().trim();
    if (!codigo) return;
    setCodigoCargando(true); setCodigoError('');
    const { error: updError } = await supabase.auth.updateUser({ data: { codigo_acceso: codigo } });
    if (updError) {
      setCodigoError('No pudimos guardar el código. Revisa tu conexión e intenta de nuevo.');
      setCodigoCargando(false);
      return;
    }
    const { data, error } = await supabase.rpc('verificar_acceso');
    if (error || data !== true) {
      setCodigoError('Ese código no es válido o ya fue usado. Contacta a MiMarket para obtener uno nuevo.');
      setCodigoCargando(false);
      return;
    }
    setCodigoCargando(false);
    setCodigoNuevo('');
    setAcceso('ok');
  }

  const pantallaCarga = (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0F1923' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#F97316,#FB923C)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:22 }}>🏪</div>
        <p style={{ color:'#8FA3B1', fontSize:14, fontFamily:'Inter,sans-serif' }}>Cargando MiMarket...</p>
      </div>
    </div>
  );

  if (loading) return pantallaCarga;

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

  if (acceso === 'revisando') return pantallaCarga;

  if (acceso === 'sin_codigo') return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0F1923', padding:24, fontFamily:'Inter,sans-serif' }}>
      <div style={{ width:'100%', maxWidth:380, background:'#fff', borderRadius:20, padding:28, boxShadow:'0 8px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#F97316,#FB923C)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14, fontSize:22 }}>🔑</div>
        <p style={{ color:'#0F172A', fontSize:17, fontWeight:700, marginBottom:6 }}>Tu cuenta no tiene un código de acceso activo</p>
        <p style={{ color:'#64748B', fontSize:13, lineHeight:1.5, marginBottom:18 }}>
          Para usar MiMarket necesitas un código de acceso. Si ya pagaste y tienes uno, ingrésalo aquí. Si no, contacta a MiMarket.
        </p>
        {codigoError && (
          <div style={{ background:'#FEF2F2', border:'1.5px solid #FECACA', borderRadius:10, padding:'10px 14px', fontSize:13, color:'#991B1B', marginBottom:14 }}>
            ⚠️ {codigoError}
          </div>
        )}
        <form onSubmit={activarConCodigo}>
          <input value={codigoNuevo} onChange={e => setCodigoNuevo(e.target.value)} placeholder="MKT-0000" maxLength={10} required
            style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid #F97316', fontSize:14, fontFamily:"'JetBrains Mono', monospace", letterSpacing:'0.1em', textTransform:'uppercase', outline:'none', marginBottom:12 }} />
          <button type="submit" disabled={codigoCargando} style={{
            width:'100%', padding:12, borderRadius:12, border:'none', fontWeight:600, fontSize:14, color:'#fff',
            background: codigoCargando ? '#FED7AA' : 'linear-gradient(135deg,#F97316,#FB923C)', cursor: codigoCargando ? 'not-allowed' : 'pointer'
          }}>
            {codigoCargando ? 'Revisando...' : 'Activar mi cuenta'}
          </button>
        </form>
        <button onClick={() => supabase.auth.signOut()} style={{ width:'100%', marginTop:12, background:'none', border:'none', color:'#64748B', fontSize:12, cursor:'pointer' }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );

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
