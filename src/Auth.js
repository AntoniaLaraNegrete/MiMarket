import React, { useState } from 'react';
import { supabase } from './supabase';

const C = {
  orange: '#F97316', orangeDark: '#EA580C', orangeLight: '#FFF7ED',
  text: '#1C0A00', textMuted: '#6B7280', border: '#E5E7EB',
  danger: '#F43F5E', success: '#34D399', surface: '#FFFFFF',
};
const FONT = "'Inter', sans-serif";
const FONT_DISPLAY = "'Space Grotesk', 'Inter', sans-serif";
const GRADIENT = 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)';

const inp = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: `1px solid ${C.border}`, fontSize: '14px',
  fontFamily: FONT, color: C.text, background: '#fff', outline: 'none',
};

export default function Auth() {
  const [mode, setMode]       = useState('login'); // login | register | forgot
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [negocio, setNegocio] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState('');
  const [error, setError]     = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Correo o contraseña incorrectos');
    setLoading(false);
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!negocio.trim()) { setError('Ingresa el nombre de tu negocio'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    setLoading(true); setError('');
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { nombre_negocio: negocio } }
    });
    if (error) setError(error.message);
    else setMsg('¡Cuenta creada! Revisa tu correo para confirmar.');
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'linear-gradient(145deg, #F8F9FA 0%, #F1F3F5 60%, #E9ECEF 100%)', fontFamily: FONT }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}>
          <span style={{ fontSize: 22 }}>🏪</span>
        </div>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24, color: C.text }}>MiMarket</span>
      </div>
      <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 32 }}>Sistema de gestión para minimarkets</p>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 400, background: C.surface, borderRadius: 20, padding: 28, border: `1px solid ${C.border}`, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: C.text, marginBottom: 4 }}>
          {mode === 'login' ? 'Iniciar sesión' : mode === 'register' ? 'Crear cuenta' : 'Recuperar contraseña'}
        </h2>
        <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>
          {mode === 'login' ? 'Ingresa con tu correo y contraseña' : mode === 'register' ? 'Crea tu cuenta para comenzar' : 'Te enviaremos un correo de recuperación'}
        </p>

        {msg && <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#065F46', marginBottom: 16 }}>{msg}</div>}
        {error && <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#9F1239', marginBottom: 16 }}>{error}</div>}

        <form onSubmit={mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : handleForgot}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>NOMBRE DE TU NEGOCIO</label>
                <input style={inp} value={negocio} onChange={e => setNegocio(e.target.value)} placeholder="Ej: Minimarket Don Pedro" required />
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>CORREO ELECTRÓNICO</label>
              <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.cl" required />
            </div>
            {mode !== 'forgot' && (
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 6 }}>CONTRASEÑA</label>
                <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : '••••••••'} required />
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}
            style={{ width: '100%', marginTop: 20, padding: '12px', borderRadius: 12, background: loading ? '#FED7AA' : GRADIENT, color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: FONT }}>
            {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : mode === 'register' ? 'Crear cuenta' : 'Enviar correo'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {mode === 'login' && (
            <>
              <button onClick={() => { setMode('forgot'); setError(''); setMsg(''); }} style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: 12, cursor: 'pointer' }}>
                ¿Olvidaste tu contraseña?
              </button>
              <button onClick={() => { setMode('register'); setError(''); setMsg(''); }} style={{ background: 'none', border: 'none', color: C.orange, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                ¿No tienes cuenta? Regístrate gratis
              </button>
            </>
          )}
          {mode !== 'login' && (
            <button onClick={() => { setMode('login'); setError(''); setMsg(''); }} style={{ background: 'none', border: 'none', color: C.orange, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              ← Volver al inicio de sesión
            </button>
          )}
        </div>
      </div>

      <p style={{ fontSize: 11, color: C.textMuted, marginTop: 24, textAlign: 'center' }}>
        Al registrarte aceptas los términos de uso de MiMarket
      </p>
    </div>
  );
}
