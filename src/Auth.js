import React, { useState } from 'react';
import { supabase } from './supabase';

const C = {
  orange: '#F97316', orangeDark: '#EA580C', orangeLight: '#FFF4EE',
  ink: '#0F1923', text: '#0F172A', textMuted: '#64748B',
  border: '#E2E8F0', danger: '#EF4444', success: '#22C55E',
  cream: '#F1F5F9', surface: '#FFFFFF',
};
const FONT = "'Inter', sans-serif";
const FONT_DISPLAY = "'Space Grotesk', 'Inter', sans-serif";
const GRADIENT = 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)';

const inp = {
  width: '100%', padding: '11px 14px', borderRadius: '10px',
  border: `1.5px solid ${C.border}`, fontSize: '14px',
  fontFamily: FONT, color: C.text, background: '#fff', outline: 'none',
  transition: 'border-color 0.2s',
};

export default function Auth() {
  const [mode, setMode]         = useState('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [negocio, setNegocio]   = useState('');
  const [codigo, setCodigo]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState('');
  const [error, setError]       = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Correo o contraseña incorrectos. Intenta de nuevo.');
    setLoading(false);
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!negocio.trim()) { setError('Ingresa el nombre de tu negocio'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    if (!codigo.trim()) { setError('Ingresa tu código de acceso'); return; }
    setLoading(true); setError('');

    // Verificar código
    const { data: codigos, error: codError } = await supabase
      .from('codigos_acceso')
      .select('*')
      .eq('codigo', codigo.toUpperCase().trim())
      .eq('usado', false);

    if (codError || !codigos || codigos.length === 0) {
      setError('Código de acceso inválido o ya utilizado. Contacta a MiMarket para obtener tu código.');
      setLoading(false);
      return;
    }

    // Registrar usuario
    const { data, error: signError } = await supabase.auth.signUp({
      email, password,
      options: { data: { nombre_negocio: negocio } }
    });

    if (signError) {
      setError(signError.message);
      setLoading(false);
      return;
    }

    // Marcar código como usado
    await supabase
      .from('codigos_acceso')
      .update({ usado: true, usado_por: email, usado_en: new Date().toISOString() })
      .eq('codigo', codigo.toUpperCase().trim());

    setMsg('¡Cuenta creada! Revisa tu correo para confirmar tu cuenta y luego inicia sesión.');
    setLoading(false);
  }

  async function handleForgot(e) {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
    if (error) setError(error.message);
    else setMsg('Te enviamos un correo para restablecer tu contraseña.');
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: `linear-gradient(145deg, ${C.ink} 0%, #162030 60%, #1E2D3D 100%)`,
      fontFamily: FONT,
    }}>
      {/* Panel izquierdo decorativo */}
      <div style={{
        display: 'none', flex: 1, padding: '48px',
        flexDirection: 'column', justifyContent: 'space-between',
      }} className="auth-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 20 }}>🏪</span>
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, fontFamily: FONT_DISPLAY }}>MiMarket</span>
        </div>
        <div>
          <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 700, fontFamily: FONT_DISPLAY, lineHeight: 1.3, marginBottom: 16 }}>
            El sistema de gestión para tu minimarket
          </h2>
          <p style={{ color: '#8FA3B1', fontSize: 15, lineHeight: 1.6 }}>
            Ventas, inventario, fiados, reportes y contabilidad en un solo lugar. Simple, rápido y profesional.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['🏪', 'Ventas en tiempo real'], ['📦', 'Control de inventario'], ['📊', 'Reportes automáticos']].map(([emoji, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>{emoji}</span>
              <span style={{ color: '#8FA3B1', fontSize: 12 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div style={{
        width: '100%', maxWidth: 460,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px', margin: '0 auto',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(249,115,22,0.4)' }}>
            <span style={{ fontSize: 22 }}>🏪</span>
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 22, fontFamily: FONT_DISPLAY }}>MiMarket</span>
        </div>
        <p style={{ color: '#8FA3B1', fontSize: 12, marginBottom: 28 }}>Sistema de gestión para minimarkets</p>

        {/* Card */}
        <div style={{
          width: '100%', background: C.surface, borderRadius: 20, padding: '28px 28px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
        }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: C.text, marginBottom: 4 }}>
            {mode === 'login' ? 'Iniciar sesión' : mode === 'register' ? 'Crear cuenta' : 'Recuperar contraseña'}
          </h2>
          <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>
            {mode === 'login' ? 'Ingresa con tu correo y contraseña' : mode === 'register' ? 'Necesitas un código de acceso para registrarte' : 'Te enviaremos un correo de recuperación'}
          </p>

          {msg && (
            <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#166534', marginBottom: 16 }}>
              ✅ {msg}
            </div>
          )}
          {error && (
            <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#991B1B', marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : handleForgot}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {mode === 'register' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nombre de tu negocio</label>
                    <input style={inp} value={negocio} onChange={e => setNegocio(e.target.value)} placeholder="Ej: Minimarket Don Pedro" required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Código de acceso</label>
                    <input style={{ ...inp, borderColor: '#F97316', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}
                      value={codigo} onChange={e => setCodigo(e.target.value)}
                      placeholder="MKT-0000" required maxLength={10} />
                    <p style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>
                      El código de acceso lo recibes al adquirir MiMarket.
                    </p>
                  </div>
                </>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correo electrónico</label>
                <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.cl" required />
              </div>

              {mode !== 'forgot' && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contraseña</label>
                  <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'} required />
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', marginTop: 20, padding: '12px', borderRadius: 12,
              background: loading ? '#FED7AA' : GRADIENT,
              color: '#fff', fontWeight: 600, fontSize: 14,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: FONT, boxShadow: loading ? 'none' : '0 4px 12px rgba(249,115,22,0.3)',
            }}>
              {loading ? 'Procesando...' : mode === 'login' ? 'Iniciar sesión' : mode === 'register' ? 'Crear cuenta' : 'Enviar correo'}
            </button>
          </form>

          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'center' }}>
            {mode === 'login' && (
              <>
                <button onClick={() => { setMode('forgot'); setError(''); setMsg(''); }}
                  style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: 12, cursor: 'pointer' }}>
                  ¿Olvidaste tu contraseña?
                </button>
                <button onClick={() => { setMode('register'); setError(''); setMsg(''); }}
                  style={{ background: 'none', border: 'none', color: C.orange, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  ¿Tienes un código de acceso? Regístrate aquí
                </button>
              </>
            )}
            {mode !== 'login' && (
              <button onClick={() => { setMode('login'); setError(''); setMsg(''); }}
                style={{ background: 'none', border: 'none', color: C.orange, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                ← Volver al inicio de sesión
              </button>
            )}
          </div>
        </div>

        <p style={{ fontSize: 11, color: '#5A7080', marginTop: 20, textAlign: 'center' }}>
          ¿No tienes código? Contáctanos para adquirir MiMarket.
        </p>
      </div>
    </div>
  );
}
