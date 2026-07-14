import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

const C = {
  orange: '#F97316', orangeDark: '#EA580C', orangeLight: '#FFF4EE',
  ink: '#0F1923', inkLine: '#1E2D3D', inkText: '#8FA3B1',
  text: '#0F172A', textMuted: '#64748B',
  border: '#E2E8F0', danger: '#EF4444', dangerLight: '#FEF2F2',
  success: '#22C55E', successLight: '#F0FDF4',
  amber: '#F59E0B', amberLight: '#FFFBEB',
  cream: '#F1F5F9', surface: '#FFFFFF',
};
const FONT = "'Inter', sans-serif";
const FONT_DISPLAY = "'Space Grotesk', 'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const GRADIENT = 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)';

function uid() { return 'MKT-' + Math.random().toString(36).slice(2,6).toUpperCase(); }

export default function AdminPanel({ onExit }) {
  const [codigos, setCodigos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notas, setNotas] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [tab, setTab] = useState('codigos');
  const [msg, setMsg] = useState('');
  const [copiado, setCopiado] = useState('');

  useEffect(() => { cargarDatos(); }, []);

  async function cargarDatos() {
    setLoading(true);
    const [{ data: c }, { data: u }] = await Promise.all([
      supabase.from('codigos_acceso').select('*').order('creado_en', { ascending: false }),
      supabase.auth.admin ? supabase.from('organizaciones').select('*').order('creado_en', { ascending: false }) : { data: [] }
    ]);
    setCodigos(c || []);
    setUsuarios(u || []);
    setLoading(false);
  }

  async function generarCodigos() {
    const nuevos = Array.from({ length: Number(cantidad) }, () => ({
      codigo: uid(),
      notas: notas.trim() || 'Sin notas',
      usado: false,
    }));
    const { error } = await supabase.from('codigos_acceso').insert(nuevos);
    if (error) { setMsg('Error al generar códigos'); return; }
    setMsg(`✅ ${cantidad} código(s) generado(s)`);
    setNotas(''); setCantidad(1);
    cargarDatos();
    setTimeout(() => setMsg(''), 3000);
  }

  async function eliminarCodigo(id) {
    await supabase.from('codigos_acceso').delete().eq('id', id);
    cargarDatos();
  }

  function copiar(text) {
    navigator.clipboard.writeText(text);
    setCopiado(text);
    setTimeout(() => setCopiado(''), 2000);
  }

  const disponibles = codigos.filter(c => !c.usado);
  const usados      = codigos.filter(c => c.usado);

  const inp = {
    padding: '9px 12px', borderRadius: 10, border: `1.5px solid ${C.border}`,
    fontSize: 13, fontFamily: FONT, color: C.text, background: '#fff', outline: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', background: C.cream, fontFamily: FONT }}>
      {/* Header */}
      <div style={{ background: C.ink, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 16 }}>🏪</span>
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: FONT_DISPLAY }}>MiMarket</span>
          <span style={{ color: C.inkText, fontSize: 12, marginLeft: 4 }}>— Panel de Administración</span>
        </div>
        <button onClick={onExit} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', fontSize: 12, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: FONT }}>
          ← Volver a la app
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Códigos disponibles', value: disponibles.length, color: C.success, bg: C.successLight },
            { label: 'Códigos usados', value: usados.length, color: C.orange, bg: C.orangeLight },
            { label: 'Total clientes', value: usados.length, color: C.inkText, bg: C.cream },
          ].map(s => (
            <div key={s.label} style={{ background: C.surface, borderRadius: 16, padding: '16px 20px', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: FONT_MONO }}>{s.value}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Generar códigos */}
        <div style={{ background: C.surface, borderRadius: 16, padding: '20px 24px', border: `1px solid ${C.border}`, marginBottom: 24 }}>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 16 }}>Generar nuevos códigos</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase' }}>Cantidad</label>
              <select value={cantidad} onChange={e => setCantidad(e.target.value)}
                style={{ ...inp, width: 100 }}>
                {[1,2,3,5,10].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase' }}>Notas (opcional)</label>
              <input style={{ ...inp, width: '100%' }} value={notas} onChange={e => setNotas(e.target.value)}
                placeholder="Ej: Cliente María González - Pagó $9.990" />
            </div>
            <button onClick={generarCodigos} style={{
              background: GRADIENT, color: '#fff', border: 'none', borderRadius: 10,
              padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
              boxShadow: '0 4px 12px rgba(249,115,22,0.25)'
            }}>
              + Generar
            </button>
          </div>
          {msg && <p style={{ marginTop: 10, fontSize: 13, color: C.success }}>{msg}</p>}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[['codigos', `Disponibles (${disponibles.length})`], ['usados', `Usados (${usados.length})`]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: tab === id ? C.ink : 'transparent',
              color: tab === id ? '#fff' : C.textMuted,
              border: `1px solid ${tab === id ? C.ink : C.border}`,
              cursor: 'pointer', fontFamily: FONT,
            }}>{label}</button>
          ))}
        </div>

        {/* Tabla códigos */}
        <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: C.textMuted, fontSize: 13 }}>Cargando...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: C.cream }}>
                  {tab === 'codigos'
                    ? ['Código', 'Notas', 'Creado', 'Copiar', ''].map(h => <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 11, color: C.textMuted, textTransform: 'uppercase' }}>{h}</th>)
                    : ['Código', 'Usado por', 'Fecha de uso', 'Notas'].map(h => <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, fontSize: 11, color: C.textMuted, textTransform: 'uppercase' }}>{h}</th>)
                  }
                </tr>
              </thead>
              <tbody>
                {(tab === 'codigos' ? disponibles : usados).map(c => (
                  <tr key={c.id} style={{ borderTop: `1px solid ${C.border}` }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontFamily: FONT_MONO, fontWeight: 700, color: C.orange, fontSize: 14, letterSpacing: '0.05em' }}>{c.codigo}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: C.textMuted, fontSize: 12 }}>{c.notas || '—'}</td>
                    {tab === 'codigos' ? (
                      <>
                        <td style={{ padding: '12px 16px', color: C.textMuted, fontSize: 12 }}>
                          {new Date(c.creado_en).toLocaleDateString('es-CL')}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button onClick={() => copiar(c.codigo)} style={{
                            background: copiado === c.codigo ? C.successLight : C.orangeLight,
                            color: copiado === c.codigo ? C.success : C.orange,
                            border: 'none', borderRadius: 8, padding: '5px 12px',
                            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
                          }}>
                            {copiado === c.codigo ? '✓ Copiado' : 'Copiar'}
                          </button>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button onClick={() => eliminarCodigo(c.id)} style={{
                            background: C.dangerLight, color: C.danger,
                            border: 'none', borderRadius: 8, padding: '5px 12px',
                            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
                          }}>Eliminar</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '12px 16px', color: C.text, fontSize: 12 }}>{c.usado_por || '—'}</td>
                        <td style={{ padding: '12px 16px', color: C.textMuted, fontSize: 12 }}>
                          {c.usado_en ? new Date(c.usado_en).toLocaleDateString('es-CL') : '—'}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {(tab === 'codigos' ? disponibles : usados).length === 0 && (
                  <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: C.textMuted, fontSize: 13 }}>
                    {tab === 'codigos' ? 'No hay códigos disponibles. Genera nuevos arriba.' : 'Aún no se ha usado ningún código.'}
                  </td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Instrucciones */}
        <div style={{ background: C.orangeLight, borderRadius: 16, padding: '16px 20px', marginTop: 20, border: `1px solid ${C.orangeDark}20` }}>
          <p style={{ fontWeight: 700, fontSize: 13, color: C.orangeDark, marginBottom: 8 }}>¿Cómo funciona?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              '1. Cuando un cliente paga, genera un código aquí y cópialo',
              '2. Mándale el código por WhatsApp junto con el link de la app',
              '3. El cliente ingresa al link, hace clic en "Regístrate", pone el código + su correo + contraseña',
              '4. El código queda marcado como usado — nadie más puede usarlo',
              '5. El cliente confirma su correo y ya puede entrar a su app',
            ].map(s => <p key={s} style={{ fontSize: 12, color: C.orangeDark, margin: 0 }}>{s}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}
