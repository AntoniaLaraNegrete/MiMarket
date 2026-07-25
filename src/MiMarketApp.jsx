import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, BarChart3, Wallet, Coins,
  Receipt, Settings, PlayCircle, Globe, MessageCircle, Search, Plus, Pencil,
  Trash2, X, Check, ChevronRight, ChevronLeft, ChevronDown, CreditCard,
  Banknote, ArrowLeftRight, Layers, Printer, Building2, Users, Image as ImageIcon,
  Shapes, Crown, TrendingUp, TrendingDown, Minus, ShoppingBag, AlertTriangle,
  CheckCircle2, Download, Phone, Lock, Store, Sparkles, BookOpen, Brain,
  PieChart as PieChartIcon, Target, Truck, DollarSign, Send, Bell, Camera,
  RotateCcw, History, MapPin, Tag, Clock, UserCheck
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

/* ============================== DESIGN TOKENS ============================== */
const C = {
  // Sidebar — azul marino oscuro profesional
  ink:         "#0F1923",
  inkSoft:     "#162030",
  inkLine:     "#1E2D3D",
  inkText:     "#8FA3B1",

  // Acento principal — naranja vibrante
  orange:      "#F97316",
  orangeDark:  "#EA580C",
  orangeLight: "#FFF4EE",
  orangeMid:   "#FED7AA",

  // Semánticos
  success:     "#22C55E",
  successLight:"#F0FDF4",
  danger:      "#EF4444",
  dangerLight: "#FEF2F2",
  amber:       "#F59E0B",
  amberLight:  "#FFFBEB",
  navy:        "#3B82F6",
  navyLight:   "#EFF6FF",
  teal:        "#14B8A6",
  tealLight:   "#F0FDFA",
  plum:        "#8B5CF6",
  plumLight:   "#F5F3FF",

  // Superficie y fondo
  cream:       "#F1F5F9",
  surface:     "#FFFFFF",

  // Texto
  text:        "#0F172A",
  textMuted:   "#64748B",

  // Bordes
  border:      "#E2E8F0",

  // Categorías
  catBebidas:   { bg: "#EFF6FF", fg: "#1D4ED8" },
  catSnacks:    { bg: "#FDF2F8", fg: "#9D174D" },
  catLimpieza:  { bg: "#F0FDFA", fg: "#0F766E" },
  catLacteos:   { bg: "#FFFBEB", fg: "#92400E" },
  catPanaderia: { bg: "#FFF7ED", fg: "#C2410C" },
  catAbarrotes: { bg: "#F0FDF4", fg: "#15803D" },
  catCuidado:   { bg: "#F5F3FF", fg: "#6D28D9" },
  catFrutas:    { bg: "#F0FDF4", fg: "#166534" },
};

const FONT_DISPLAY = "'Space Grotesk', 'Inter', sans-serif";
const FONT_BODY    = "'Inter', sans-serif";
const FONT_MONO    = "'JetBrains Mono', monospace";
const PREMIUM_GRADIENT = "linear-gradient(135deg, #F97316 0%, #FB923C 100%)";
const SIDEBAR_W = 240;

/* ============================== DATA ============================== */
const CATEGORY_STYLES = {
  "Bebidas":           { bg: "#DBEAFE", fg: "#2563EB", emoji: "🥤" },
  "Snacks y Confites": { bg: "#FCE7F3", fg: "#DB2777", emoji: "🍬" },
  "Limpieza":          { bg: "#D1FAE5", fg: "#059669", emoji: "🧴" },
  "Lácteos":           { bg: "#E9ECEF", fg: "#D97706", emoji: "🥛" },
  "Panadería":         { bg: "#F1F3F5", fg: "#EA580C", emoji: "🍞" },
  "Abarrotes":         { bg: "#F0FDF4", fg: "#16A34A", emoji: "🥫" },
  "Cuidado Personal":  { bg: "#F3E8FF", fg: "#9333EA", emoji: "🧼" },
  "Frutas y Verduras": { bg: "#DCFCE7", fg: "#15803D", emoji: "🥕" },
};
const CATEGORIES = Object.keys(CATEGORY_STYLES);

const SEED_PRODUCTS = [
  { name: "Agua Mineral 1.5L",        format: "Unidad",   salePrice: 1200, purchasePrice: 800,  stock: 24, category: "Bebidas",           barcode: "7802800019107" },
  { name: "Bebida Cola Sin Azúcar",   format: "Unidad",   salePrice: 1800, purchasePrice: 1200, stock: 3,  category: "Bebidas",           barcode: "7591528061512" },
  { name: "Néctar Naranja 1.5L",      format: "Unidad",   salePrice: 2100, purchasePrice: 1500, stock: 2,  category: "Bebidas",           barcode: "7802800021018" },
  { name: "Cerveza Lager 350ml",      format: "Pack x6",  salePrice: 4990, purchasePrice: 3200, stock: 18, category: "Bebidas",           barcode: "7802800045014" },
  { name: "Café Molido 250g",         format: "Unidad",   salePrice: 3500, purchasePrice: 2400, stock: 12, category: "Abarrotes",         barcode: "7802800031017" },
  { name: "Arroz Grado 1 1kg",        format: "Unidad",   salePrice: 1450, purchasePrice: 980,  stock: 30, category: "Abarrotes",         barcode: "7802800012016" },
  { name: "Aceite Vegetal 1L",        format: "Unidad",   salePrice: 2390, purchasePrice: 1650, stock: 15, category: "Abarrotes",         barcode: "7802800018018" },
  { name: "Pan de Molde Blanco",      format: "Unidad",   salePrice: 1990, purchasePrice: 1300, stock: 9,  category: "Panadería",         barcode: "7802800022015" },
  { name: "Marraqueta x4",            format: "Unidad",   salePrice: 1200, purchasePrice: 700,  stock: 20, category: "Panadería",         barcode: "" },
  { name: "Leche Entera 1L",          format: "Unidad",   salePrice: 1100, purchasePrice: 750,  stock: 16, category: "Lácteos",           barcode: "7802800011019" },
  { name: "Yogurt Natural 1L",        format: "Unidad",   salePrice: 1690, purchasePrice: 1100, stock: 7,  category: "Lácteos",           barcode: "7802800033011" },
  { name: "Queso Gauda 150g",         format: "Unidad",   salePrice: 2890, purchasePrice: 2100, stock: 5,  category: "Lácteos",           barcode: "7802800044017" },
  { name: "Detergente Líquido 3L",    format: "Unidad",   salePrice: 6990, purchasePrice: 4900, stock: 8,  category: "Limpieza",          barcode: "7802800055013" },
  { name: "Suavizante de Ropa 1.8L",  format: "Unidad",   salePrice: 3290, purchasePrice: 2200, stock: 0,  category: "Limpieza",          barcode: "7802800056010" },
  { name: "Cloro Gel 1L",             format: "Unidad",   salePrice: 1390, purchasePrice: 900,  stock: 22, category: "Limpieza",          barcode: "7802800057017" },
  { name: "Caramelos Surtidos 1kg",   format: "Unidad",   salePrice: 4990, purchasePrice: 3300, stock: 6,  category: "Snacks y Confites", barcode: "7802800061014" },
  { name: "Anillo de Caramelo",       format: "Unidad",   salePrice: 400,  purchasePrice: 250,  stock: 8,  category: "Snacks y Confites", barcode: "" },
  { name: "Papas Fritas 150g",        format: "Unidad",   salePrice: 1590, purchasePrice: 1050, stock: 14, category: "Snacks y Confites", barcode: "7802800063018" },
  { name: "Shampoo Familiar 750ml",   format: "Unidad",   salePrice: 3990, purchasePrice: 2700, stock: 4,  category: "Cuidado Personal",  barcode: "7802800071013" },
  { name: "Jabón de Tocador x3",      format: "Unidad",   salePrice: 1990, purchasePrice: 1300, stock: 19, category: "Cuidado Personal",  barcode: "7802800072010" },
  { name: "Zanahoria (kg)",           format: "Unidad",   salePrice: 990,  purchasePrice: 600,  stock: 11, category: "Frutas y Verduras", barcode: "" },
  { name: "Plátano (kg)",             format: "Unidad",   salePrice: 1290, purchasePrice: 800,  stock: 13, category: "Frutas y Verduras", barcode: "" },
].map((p, i) => ({ id: "p" + (i + 1), ...p }));

const PAYMENT_METHODS = [
  { id: "efectivo",      label: "Efectivo",      icon: Banknote,      color: "#059669" },
  { id: "debito",        label: "Débito",         icon: CreditCard,    color: "#2563EB" },
  { id: "credito",       label: "Crédito",        icon: CreditCard,    color: "#9333EA" },
  { id: "transferencia", label: "Transferencia",  icon: ArrowLeftRight,color: "#D97706" },
  { id: "fiado",         label: "Fiado",          icon: Coins,         color: "#DB2777" },
  { id: "mixto",         label: "Pago Mixto",     icon: Layers,        color: "#EA580C" },
];
const PAYMENT_LABEL = Object.fromEntries(PAYMENT_METHODS.map(m => [m.id, m.label]));

const SEED_FIADOS = [
  { id: "f1", name: "María González", phone: "+56 9 8123 4455", rut: "12.345.678-9", balance: 12400,
    history: [{ date: daysAgoISO(9), type: "cargo", amount: 6400, note: "Despacho abarrotes" }, { date: daysAgoISO(4), type: "cargo", amount: 6000, note: "Bebidas y snacks" }] },
  { id: "f2", name: "Pedro Soto",     phone: "+56 9 7766 2211", rut: "9.876.543-2",  balance: 5000,
    history: [{ date: daysAgoISO(2), type: "cargo", amount: 5000, note: "Pan y leche" }] },
  { id: "f3", name: "Juan Pérez",     phone: "+56 9 5544 9911", rut: "15.222.333-4", balance: 8900,
    history: [{ date: daysAgoISO(11), type: "cargo", amount: 12000, note: "Compra mensual" }, { date: daysAgoISO(6), type: "abono", amount: 3100, note: "Abono parcial" }] },
  { id: "f4", name: "Carla Reyes",    phone: "+56 9 6321 0087", rut: "18.901.234-5", balance: 0,
    history: [{ date: daysAgoISO(20), type: "cargo", amount: 7000, note: "Compra de aseo" }, { date: daysAgoISO(15), type: "abono", amount: 7000, note: "Pago total" }] },
];

const SEED_ECOMMERCE = [
  { id: "e1", client: "Ignacia Muñoz",   phone: "+56 9 1234 0099", date: daysAgoISO(0), status: "Pendiente",  items: [{ name: "Agua Mineral 1.5L", qty: 2 }, { name: "Pan de Molde Blanco", qty: 1 }], total: 4390 },
  { id: "e2", client: "Roberto Díaz",    phone: "+56 9 8842 1230", date: daysAgoISO(0), status: "Confirmado", items: [{ name: "Detergente Líquido 3L", qty: 1 }, { name: "Cloro Gel 1L", qty: 2 }], total: 9770 },
  { id: "e3", client: "Fernanda Castro", phone: "+56 9 3321 7765", date: daysAgoISO(1), status: "Entregado",  items: [{ name: "Café Molido 250g", qty: 1 }, { name: "Leche Entera 1L", qty: 3 }], total: 6800 },
  { id: "e4", client: "Tomás Vidal",     phone: "+56 9 4490 2231", date: daysAgoISO(2), status: "Cancelado",  items: [{ name: "Cerveza Lager 350ml", qty: 1 }], total: 4990 },
];

const TUTORIAL_TOPICS = [
  { id: "inventario", label: "Inventario",    icon: Package,      tips: ["Usa categorías para organizar tus productos.", "Revisa el stock en rojo cada mañana antes de abrir.", "Exporta tu inventario regularmente como respaldo."] },
  { id: "venta",      label: "Venta",         icon: ShoppingCart, tips: ["Busca por nombre para agregar productos rápido.", "El pago mixto combina efectivo y tarjeta en una boleta.", "Puedes imprimir el comprobante o solo guardarlo."] },
  { id: "reporte",    label: "Reporte",       icon: BarChart3,    tips: ["Filtra por fechas para comparar semanas.", "Revisa productos más vendidos para planear compras.", "El ticket promedio mide si tus ventas cruzadas funcionan."] },
  { id: "fiados",     label: "Fiados",        icon: Coins,        tips: ["Registra el RUT del cliente para evitar confusiones.", "Pide abonos parciales para mantener saldos controlados.", "Revisa el histórico para ver el comportamiento de pago."] },
  { id: "boletas",    label: "Boletas",       icon: Receipt,      tips: ["Cada boleta queda asociada a un vendedor y medio de pago.", "Usa el rango de fechas para encontrar una boleta antigua."] },
  { id: "configurar", label: "Configurar",    icon: Settings,     tips: ["Mantén actualizada la dirección de tu local.", "Agrega a tu equipo en Usuarios para repartir responsabilidades."] },
  { id: "ecommerce",  label: "Ecommerce",     icon: Globe,        tips: ["Confirma los pedidos pendientes apenas los veas.", "Usa los filtros de estado para enfocarte en lo urgente."] },
  { id: "caja",       label: "Caja 360°",     icon: Wallet,       tips: ["Cuenta el efectivo físico antes de cerrar caja.", "Un faltante recurrente puede indicar ventas sin registrar."] },
];

/* ============================== HELPERS ============================== */
function daysAgoISO(n) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); }
function todayISO() { return daysAgoISO(0); }
function formatCLP(n) { return "$" + Math.round(n || 0).toLocaleString("es-CL"); }
function formatDate(iso) { return new Date(iso + (iso.length === 10 ? "T00:00:00" : "")).toLocaleDateString("es-CL"); }
function formatDateTime(iso) { const d = new Date(iso); return d.toLocaleDateString("es-CL") + " " + d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }); }
function uid(p) { return p + Math.random().toString(36).slice(2, 9); }

function buildSeedSales(products) {
  const methods = ["efectivo","efectivo","debito","debito","credito","transferencia"];
  const sales = []; let voucher = 1029, boleta = 8799;
  for (let i = 17; i >= 1; i--) {
    const d = new Date(); d.setDate(d.getDate() - Math.min(13, Math.floor(i / 1.3)));
    d.setHours(9 + Math.floor(Math.random() * 11), Math.floor(Math.random() * 60), 0, 0);
    const items = [];
    for (let j = 0; j < 1 + Math.floor(Math.random() * 3); j++) {
      const p = products[Math.floor(Math.random() * products.length)];
      if (!items.find(it => it.productId === p.id)) items.push({ productId: p.id, name: p.name, price: p.salePrice, qty: 1 + Math.floor(Math.random() * 3) });
    }
    voucher++; boleta++;
    sales.push({ id: uid("s"), voucher: "V-"+voucher, boletaSII: boleta, datetime: d.toISOString(), vendor: ["Anner Salazar","Tú"][Math.floor(Math.random()*2)], paymentType: methods[Math.floor(Math.random()*methods.length)], items, total: items.reduce((s,it)=>s+it.price*it.qty,0) });
  }
  return sales.sort((a,b) => new Date(b.datetime)-new Date(a.datetime));
}

/* ============================== SMALL UI ============================== */
function PremiumPill() {
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: PREMIUM_GRADIENT }}><Crown size={11} /> Premium</span>;
}

function Btn({ children, onClick, variant="primary", icon:Icon, size="md", disabled, type="button", full }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed";
  const sz = { sm:"px-3 py-1.5 text-xs", md:"px-4 py-2.5 text-sm", lg:"px-5 py-3 text-sm" };
  const st = {
    primary: { background: C.orange, color: "#fff" },
    dark:    { background: C.ink,    color: "#fff" },
    teal:    { background: C.teal,   color: "#fff" },
    outline: { background: "#fff",   color: C.text, border:`1px solid ${C.border}` },
    ghost:   { background: "transparent", color: C.textMuted },
    danger:  { background: C.dangerLight, color: C.danger },
  };
  return <button type={type} onClick={onClick} disabled={disabled} style={{ ...st[variant], width: full?"100%":undefined, fontFamily:FONT_BODY }} className={`${base} ${sz[size]}`}>{Icon && <Icon size={size==="sm"?14:16}/>}{children}</button>;
}

function Card({ children, style, className="" }) {
  return <div className={`rounded-2xl ${className}`} style={{ background:C.surface, border:`1px solid ${C.border}`, ...style }}>{children}</div>;
}

function PageHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily:FONT_DISPLAY, color:C.text }}>{title}</h1>
        {subtitle && <p className="text-sm mt-1" style={{ color:C.textMuted }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

function Field({ label, children }) {
  return <label className="block"><span className="block text-xs font-semibold mb-1.5" style={{ color:C.textMuted }}>{label}</span>{children}</label>;
}

const inputStyle = { width:"100%", padding:"9px 12px", borderRadius:"10px", border:`1px solid ${C.border}`, fontSize:"14px", fontFamily:FONT_BODY, color:C.text, background:"#fff", outline:"none" };

function Modal({ title, onClose, children, width=480 }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ background:"rgba(120,53,15,0.35)" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="rounded-2xl w-full" style={{ background:C.surface, maxWidth:width, maxHeight:"88vh", overflowY:"auto" }}>
        <div className="flex items-center justify-between px-5 py-4 sticky top-0" style={{ background:C.surface, borderBottom:`1px solid ${C.border}` }}>
          <h3 className="font-bold text-base" style={{ fontFamily:FONT_DISPLAY, color:C.text }}>{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/5"><X size={18} color={C.textMuted}/></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function EmptyState({ icon:Icon=Search, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background:C.cream }}><Icon size={22} color={C.textMuted}/></div>
      <p className="font-semibold text-sm" style={{ color:C.text }}>{title}</p>
      {subtitle && <p className="text-xs mt-1" style={{ color:C.textMuted }}>{subtitle}</p>}
    </div>
  );
}

function StockBadge({ stock }) {
  let bg=C.successLight, fg=C.success, label=stock+" uds.";
  if (stock===0) { bg=C.dangerLight; fg=C.danger; label="Sin stock"; }
  else if (stock<=5) { bg=C.amberLight; fg=C.amber; label=stock+" uds."; }
  return <span className="px-2 py-1 rounded-md text-xs font-semibold" style={{ background:bg, color:fg, fontFamily:FONT_MONO }}>{label}</span>;
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium"
      style={{ background: toast.type==="error" ? C.danger : C.ink, color:"#fff", fontFamily:FONT_BODY }}>
      {toast.type==="error" ? <AlertTriangle size={16}/> : <CheckCircle2 size={16}/>}
      {toast.message}
    </div>
  );
}

/* ============================== AUTH / USERS ============================== */
const SEED_USERS = [];

function CreateAccountScreen({ onCreated }) {
  const [name, setName] = useState("");
  const [pin,  setPin]  = useState("");
  const [pin2, setPin2] = useState("");
  const [err,  setErr]  = useState("");

  function handleCreate() {
    if (!name.trim()) { setErr("Ingresa tu nombre"); return; }
    if (pin.length !== 4) { setErr("El PIN debe tener 4 dígitos"); return; }
    if (pin !== pin2) { setErr("Los PINs no coinciden"); return; }
    onCreated({ id: uid("u"), name: name.trim(), pin, role: "admin" });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "linear-gradient(145deg, #F8F9FA 0%, #F1F3F5 60%, #E9ECEF 100%)" }}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
          style={{ background: `linear-gradient(135deg, ${C.orange}, #FBBF24)` }}>
          <Store size={22} color="#fff" />
        </div>
        <span className="font-bold text-2xl" style={{ fontFamily: FONT_DISPLAY, color: C.ink }}>MiMarket</span>
      </div>
      <p className="text-sm mb-10" style={{ color: C.textMuted }}>Sistema de gestión para minimarkets</p>

      <div className="w-full max-w-sm">
        <div className="rounded-2xl p-6 shadow-sm" style={{ background: "#fff", border: `1px solid ${C.border}` }}>
          <h2 className="font-bold text-lg mb-1" style={{ fontFamily: FONT_DISPLAY, color: C.text }}>Crea tu cuenta de administrador</h2>
          <p className="text-xs mb-6" style={{ color: C.textMuted }}>Esto solo ocurre una vez. Después puedes agregar más usuarios.</p>

          <div className="flex flex-col gap-4">
            <Field label="Tu nombre completo">
              <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Ej: María González" />
            </Field>
            <Field label="Crea un PIN de 4 dígitos">
              <input type="password" maxLength={4} style={inputStyle} value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="••••" />
            </Field>
            <Field label="Repite el PIN">
              <input type="password" maxLength={4} style={inputStyle} value={pin2}
                onChange={e => setPin2(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="••••" />
            </Field>
          </div>

          {err && <p className="text-xs mt-3" style={{ color: C.danger }}>{err}</p>}

          <Btn full onClick={handleCreate} style={{ marginTop: 20 }}>
            <Check size={16} /> Crear cuenta y comenzar
          </Btn>
        </div>

        <p className="text-xs text-center mt-4" style={{ color: C.textMuted }}>
          Podrás agregar vendedores desde Configurar → Usuarios
        </p>
      </div>
    </div>
  );
}

function LoginScreen({ users, onLogin }) {
  const [sel, setSel] = useState(null);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  function digit(d) {
    if (pin.length>=4) return;
    const next = pin+d; setPin(next); setErr("");
    if (next.length===4) {
      setTimeout(()=>{ if (next===sel.pin) onLogin(sel); else { setErr("PIN incorrecto"); setPin(""); } }, 120);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background:`linear-gradient(145deg, #F8F9FA 0%, #F1F3F5 50%, #E9ECEF 100%)` }}>
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background:PREMIUM_GRADIENT }}><Store size={22} color="#fff"/></div>
        <span className="font-bold text-2xl" style={{ fontFamily:FONT_DISPLAY, color:C.ink }}>MiMarket</span>
      </div>

      {!sel ? (
        <div className="w-full max-w-sm">
          <h2 className="text-center font-bold text-lg mb-1" style={{ fontFamily:FONT_DISPLAY, color:C.text }}>¿Quién eres?</h2>
          <p className="text-center text-sm mb-6" style={{ color:C.textMuted }}>Selecciona tu usuario para continuar</p>
          <div className="flex flex-col gap-3">
            {users.map(u=>(
              <button key={u.id} onClick={()=>{ setSel(u); setPin(""); setErr(""); }}
                className="flex items-center gap-4 p-4 rounded-2xl text-left shadow-sm"
                style={{ background:"#fff", border:`1.5px solid ${C.border}` }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
                  style={{ background: u.role==="admin" ? C.orange : C.teal }}>
                  {u.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold" style={{ color:C.text }}>{u.name}</div>
                  <div className="text-xs mt-0.5" style={{ color:C.textMuted }}>{u.role==="admin"?"Administrador · Acceso completo":"Vendedor · Acceso limitado"}</div>
                </div>
                <ChevronRight size={18} color={C.textMuted} style={{ marginLeft:"auto" }}/>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xs flex flex-col items-center">
          <button onClick={()=>{ setSel(null); setPin(""); setErr(""); }} className="flex items-center gap-1 text-sm mb-8" style={{ color:C.textMuted }}>
            <ChevronLeft size={16}/> Volver
          </button>
          <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg mb-3 shadow-md"
            style={{ background: sel.role==="admin"?C.orange:C.teal }}>
            {sel.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
          </div>
          <div className="font-bold mb-1" style={{ fontFamily:FONT_DISPLAY, color:C.text }}>{sel.name}</div>
          <div className="text-xs mb-8" style={{ color:C.textMuted }}>Ingresa tu PIN de 4 dígitos</div>
          <div className="flex gap-4 mb-4">
            {[0,1,2,3].map(i=><div key={i} className="w-4 h-4 rounded-full" style={{ background: i<pin.length?C.orange:"#E5E7EB" }}/>)}
          </div>
          {err ? <p className="text-xs mb-4 text-center" style={{ color:C.danger }}>{err}</p> : <div className="mb-4 h-4"/>}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
            {["1","2","3","4","5","6","7","8","9","","0","⌫"].map(d=>(
              <button key={d} onClick={()=>d==="⌫"?setPin(p=>p.slice(0,-1)):d!==""?digit(d):null} disabled={d===""}
                className="h-14 rounded-2xl font-bold text-lg disabled:opacity-0 shadow-sm"
                style={{ background: d==="⌫"?"#F3F4F6":"#fff", color:C.text, border:`1px solid ${C.border}`, fontFamily:FONT_MONO }}>
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== NOTIFICACIONES ============================== */
function NotificationBell({ products, fiados, sales, dark }) {
  const [open, setOpen] = useState(false);

  const alerts = useMemo(() => {
    const list = [];
    products.filter(p => p.stock === 0).forEach(p =>
      list.push({ type: "danger", msg: `Sin stock: ${p.name}`, icon: AlertTriangle }));
    products.filter(p => p.stock > 0 && p.stock <= 3).forEach(p =>
      list.push({ type: "amber", msg: `Stock crítico: ${p.name} (${p.stock} uds.)`, icon: AlertTriangle }));
    const hace30 = daysAgoISO(30);
    fiados.filter(f => f.balance > 0 && f.history.some(h => h.type === "cargo" && h.date <= hace30)).forEach(f =>
      list.push({ type: "amber", msg: `Fiado sin pagar +30 días: ${f.name} (${formatCLP(f.balance)})`, icon: Coins }));
    const hoy = todayISO();
    const ventasHoy = sales.filter(s => s.datetime.slice(0,10) === hoy);
    if (ventasHoy.length === 0) list.push({ type: "info", msg: "Sin ventas registradas hoy", icon: ShoppingCart });
    const grandes = ventasHoy.filter(s => s.total > 50000);
    grandes.forEach(s => list.push({ type: "success", msg: `Venta grande: ${formatCLP(s.total)} (${s.voucher})`, icon: TrendingUp }));
    return list;
  }, [products, fiados, sales]);

  const colorMap = { danger: C.danger, amber: C.amber, success: C.success, info: C.navy };
  const bgMap    = { danger: C.dangerLight, amber: C.amberLight, success: C.successLight, info: C.navyLight };

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="relative w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: open ? (dark ? C.inkLine : C.orangeLight) : "transparent", border: `1px solid ${dark ? C.inkLine : C.border}` }}>
        <Bell size={17} color={dark ? C.inkText : C.textMuted} />
        {alerts.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
            style={{ background: alerts.some(a => a.type === "danger") ? C.danger : C.amber }}>
            {alerts.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-11 w-80 rounded-2xl shadow-xl z-50 overflow-hidden"
          style={{ background: "#fff", border: `1px solid ${C.border}` }}>
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
            <span className="font-bold text-sm" style={{ fontFamily: FONT_DISPLAY, color: C.text }}>Notificaciones</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: C.cream, color: C.textMuted }}>{alerts.length}</span>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-4 text-xs text-center" style={{ color: C.textMuted }}>Todo en orden ✓</div>
            ) : alerts.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${C.border}`, background: bgMap[a.type] + "55" }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: bgMap[a.type] }}>
                  <a.icon size={12} color={colorMap[a.type]} />
                </div>
                <span className="text-xs" style={{ color: C.text }}>{a.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================== NAV ============================== */
const NAV_ITEMS = [
  { id:"panel",         label:"Panel",          icon:LayoutDashboard, roles:["admin"] },
  { id:"inventario",    label:"Inventario",     icon:Package,         roles:["admin"] },
  { id:"venta",         label:"Venta",          icon:ShoppingCart,    roles:["admin","vendedor"] },
  { id:"reporte",       label:"Reporte",        icon:BarChart3,       roles:["admin"] },
  { id:"contabilidad",  label:"Contabilidad",   icon:BookOpen,        roles:["admin"] },
  { id:"caja",          label:"Caja 360°",      icon:Wallet,          roles:["admin"] },
  { id:"fiados",        label:"Fiados",         icon:Coins,           roles:["admin"] },
  { id:"boletas",       label:"Boletas",        icon:Receipt,         roles:["admin","vendedor"] },
  { id:"configurar",    label:"Configurar",     icon:Settings,        roles:["admin"] },
  { id:"tutoriales",    label:"Tutoriales",     icon:PlayCircle,      roles:["admin","vendedor"] },
  { id:"ecommerce",     label:"Ecommerce",      icon:Globe,           roles:["admin"] },
  { id:"contacto",      label:"Contáctanos",    icon:MessageCircle,   roles:["admin","vendedor"] },
];

function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);
  useEffect(() => {
    const check = () => setIsTablet(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isTablet;
}

/* ── Sidebar profesional (PC y tablet landscape) ── */
function Sidebar({ view, setView, currentUser, onLogout, profile, cajaState, products, fiados, sales, isOwner, onOpenAdmin }) {
  const visible = NAV_ITEMS.filter(i => i.roles.includes(currentUser.role));
  const initials = currentUser.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{
      width: SIDEBAR_W, minHeight: "100vh", background: C.ink,
      display: "flex", flexDirection: "column",
      position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 30,
      overflowY: "auto", overflowX: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${C.inkLine}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Store size={18} color="#fff" />
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: FONT_DISPLAY, lineHeight: 1.2 }}>MiMarket</div>
            <div style={{ color: C.inkText, fontSize: 10, marginTop: 1 }}>{profile.name}</div>
          </div>
        </div>
      </div>

      {/* Caja status */}
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.inkLine}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 8, background: cajaState.isOpen ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: cajaState.isOpen ? C.success : C.danger, flexShrink: 0 }} />
          <Wallet size={12} color={cajaState.isOpen ? C.success : C.danger} />
          <span style={{ fontSize: 11, color: cajaState.isOpen ? C.success : C.danger, fontWeight: 500 }}>
            Caja {cajaState.isOpen ? "abierta" : "cerrada"}
          </span>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: "10px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {visible.map(item => {
          const active = view === item.id;
          return (
            <button key={item.id} onClick={() => setView(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10, width: "100%", textAlign: "left",
                background: active ? C.orange : "transparent",
                border: "none", cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.inkLine; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <item.icon size={17} color={active ? "#fff" : C.inkText} />
              <span style={{ fontSize: 13, color: active ? "#fff" : C.inkText, fontWeight: active ? 600 : 400, fontFamily: FONT_BODY }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Admin button — solo visible para la dueña */}
      {isOwner && (
        <div style={{ padding: "0 10px 8px" }}>
          <button onClick={onOpenAdmin} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 10, width: "100%", textAlign: "left",
            background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)",
            cursor: "pointer",
          }}>
            <Crown size={15} color={C.orange} />
            <span style={{ fontSize: 12, color: C.orange, fontWeight: 600, fontFamily: FONT_BODY }}>
              Panel Admin
            </span>
          </button>
        </div>
      )}

      {/* User + logout */}
      <div style={{ padding: "12px 14px", borderTop: `1px solid ${C.inkLine}` }}>
        <NotificationBell products={products} fiados={fiados} sales={sales} dark />
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, marginTop: 6, background: C.inkLine }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser.name}</div>
            <div style={{ fontSize: 10, color: C.inkText }}>{currentUser.role === "admin" ? "Administrador" : "Vendedor"}</div>
          </div>
          <button onClick={onLogout} title="Cerrar sesión" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6, display: "flex", alignItems: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.inkText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Topbar (solo en móvil/tablet portrait) ── */
function MobileTopbar({ view, setView, currentUser, onLogout, profile, cajaState, products, fiados, sales, isOwner, onOpenAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const visible = NAV_ITEMS.filter(i => i.roles.includes(currentUser.role));
  const initials = currentUser.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
        background: C.ink, height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.25)"
      }}>
        <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.inkText} strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Store size={13} color="#fff" />
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: FONT_DISPLAY }}>MiMarket</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <NotificationBell products={products} fiados={fiados} sales={sales} dark />
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
            {initials}
          </div>
        </div>
      </div>

      {/* Drawer */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }} onClick={() => setMenuOpen(false)}>
          <div style={{ width: SIDEBAR_W, background: C.ink, height: "100%", display: "flex", flexDirection: "column", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.inkLine}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontFamily: FONT_DISPLAY }}>{profile.name}</span>
              <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} color={C.inkText} />
              </button>
            </div>
            <div style={{ flex: 1, padding: "10px", display: "flex", flexDirection: "column", gap: 2 }}>
              {visible.map(item => {
                const active = view === item.id;
                return (
                  <button key={item.id} onClick={() => { setView(item.id); setMenuOpen(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, width: "100%", textAlign: "left", background: active ? C.orange : "transparent", border: "none", cursor: "pointer" }}>
                    <item.icon size={17} color={active ? "#fff" : C.inkText} />
                    <span style={{ fontSize: 13, color: active ? "#fff" : C.inkText, fontWeight: active ? 600 : 400 }}>{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ padding: "12px 14px", borderTop: `1px solid ${C.inkLine}` }}>
              <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, width: "100%", background: "none", border: "none", cursor: "pointer" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.inkText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span style={{ fontSize: 13, color: C.inkText }}>Cerrar sesión</span>
              </button>
            </div>
          </div>
          <div style={{ flex: 1, background: "rgba(0,0,0,0.5)" }} />
        </div>
      )}
    </>
  );
}




/* ============================== PANEL ============================== */
function PanelView({ products, sales, fiados, profile, setView, currentUser }) {
  const today = todayISO();
  const salesToday = sales.filter(s=>s.datetime.slice(0,10)===today);
  const totalHoy   = salesToday.reduce((s,x)=>s+x.total,0);
  const totalFiado = fiados.filter(f=>f.balance>0).reduce((s,f)=>s+f.balance,0);
  const lowStock   = products.filter(p=>p.stock<=5);

  const stats = [
    { label:"Ventas hoy",       value:formatCLP(totalHoy),      icon:TrendingUp,      color:C.orange,       bg:C.orangeLight },
    { label:"Boletas hoy",      value:salesToday.length,         icon:Receipt,         color:C.navy,         bg:C.navyLight   },
    { label:"Fiados pendientes",value:formatCLP(totalFiado),     icon:Coins,           color:C.plum,         bg:C.plumLight   },
  ];

  return (
    <div>
      <PageHeader title={`Hola, ${currentUser?.name?.split(" ")[0] || "bienvenido"} 👋`} subtitle={`Resumen del día · ${formatDate(today)} · ${profile.name}`}/>
      {lowStock.length>0 && (
        <div onClick={()=>setView("inventario")} className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5 cursor-pointer"
          style={{ background:C.amberLight, border:`1px solid #FDE68A` }}>
          <AlertTriangle size={18} color={C.amber}/>
          <p className="text-sm flex-1" style={{ color:"#92400E" }}><strong>{lowStock.length} productos</strong> tienen poco o ningún stock.</p>
          <ChevronRight size={16} color={C.amber}/>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s=>(
          <Card key={s.label} style={{ padding:18 }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background:s.bg }}><s.icon size={17} color={s.color}/></div>
            <div className="text-2xl font-bold" style={{ fontFamily:FONT_MONO, color:C.text }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color:C.textMuted }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <h2 className="text-sm font-bold mb-3" style={{ color:C.text, fontFamily:FONT_DISPLAY }}>Accesos rápidos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {NAV_ITEMS.filter(n=>n.id!=="panel"&&n.roles.includes("admin")).map(item=>(
          <button key={item.id} onClick={()=>setView(item.id)}
            className="flex items-center gap-3 p-4 rounded-2xl text-left transition hover:shadow-md"
            style={{ background:C.surface, border:`1px solid ${C.border}` }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background:C.orangeLight }}><item.icon size={17} color={C.orange}/></div>
            <span className="text-sm font-semibold" style={{ color:C.text }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================== INVENTARIO ============================== */
function ProductFormModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial||{ name:"", format:"Unidad", category:CATEGORIES[0], salePrice:"", purchasePrice:"", stock:"", barcode:"", imageUrl:"", priceHistory:[] });
  const isEdit = !!initial;
  return (
    <Modal title={isEdit?"Editar producto":"Ingresar producto"} onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Field label="Nombre del producto"><input style={inputStyle} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Ej: Agua Mineral 1.5L"/></Field></div>
        <Field label="Formato"><select style={inputStyle} value={form.format} onChange={e=>setForm({...form,format:e.target.value})}><option>Unidad</option><option>Pack x6</option><option>Pack x12</option><option>Caja</option></select></Field>
        <Field label="Categoría"><select style={inputStyle} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></Field>
        <Field label="Precio de venta"><input type="number" style={inputStyle} value={form.salePrice} onChange={e=>setForm({...form,salePrice:e.target.value})} placeholder="0"/></Field>
        <Field label="Precio de compra"><input type="number" style={inputStyle} value={form.purchasePrice} onChange={e=>setForm({...form,purchasePrice:e.target.value})} placeholder="0"/></Field>
        <Field label="Stock"><input type="number" style={inputStyle} value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} placeholder="0"/></Field>
        <Field label="Código de barra"><input style={inputStyle} value={form.barcode||""} onChange={e=>setForm({...form,barcode:e.target.value})} placeholder="Ej: 7802800019107"/></Field>
        <div className="col-span-2">
          <Field label="URL de imagen (opcional)">
            <input style={inputStyle} value={form.imageUrl||""} onChange={e=>setForm({...form,imageUrl:e.target.value})} placeholder="https://...imagen.jpg"/>
          </Field>
          {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 rounded-xl object-cover" style={{width:64,height:64}} onError={e=>e.target.style.display="none"}/>}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn icon={Check} onClick={()=>{
          if(!form.name.trim())return;
          const newSalePrice = Number(form.salePrice)||0;
          const newPurchasePrice = Number(form.purchasePrice)||0;
          const history = [...(form.priceHistory||[])];
          if(isEdit && (newSalePrice !== initial.salePrice || newPurchasePrice !== initial.purchasePrice)) {
            history.push({ date: todayISO(), oldSale: initial.salePrice, newSale: newSalePrice, oldPurchase: initial.purchasePrice, newPurchase: newPurchasePrice });
          }
          onSave({...form, salePrice: newSalePrice, purchasePrice: newPurchasePrice, stock: Number(form.stock)||0, priceHistory: history});
        }}>Guardar</Btn>
      </div>
    </Modal>
  );
}

function InventarioView({ products, setProducts, showToast }) {
  const [search, setSearch] = useState("");
  const [cat,    setCat]    = useState("Todas");
  const [editing,setEditing]= useState(null);
  const [showForm,setShowForm]= useState(false);
  const [delTarget,setDelTarget]=useState(null);
  const [priceHistTarget,setPriceHistTarget]=useState(null);

  const filtered = products.filter(p=>(cat==="Todas"||p.category===cat)&&p.name.toLowerCase().includes(search.toLowerCase()));

  function handleExport() {
    const blob = new Blob(["Producto,Formato,Precio Venta,Precio Compra,Stock,Categoria\n"+products.map(p=>`${p.name},${p.format},${p.salePrice},${p.purchasePrice},${p.stock},${p.category}`).join("\n")],{type:"text/csv"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="inventario.csv"; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    showToast("Inventario descargado como CSV");
  }

  return (
    <div>
      <PageHeader title="Inventario" subtitle={`${products.length} productos en tu catálogo`} right={
        <div className="flex gap-2 flex-wrap">
          <Btn variant="outline" icon={Download} onClick={handleExport}>Descargar</Btn>
          <Btn icon={Plus} onClick={()=>{ setEditing(null); setShowForm(true); }}>Ingresar producto</Btn>
        </div>}/>
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" color={C.textMuted}/>
          <input style={{...inputStyle,paddingLeft:34}} placeholder="Buscar producto..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select style={{...inputStyle,width:200}} value={cat} onChange={e=>setCat(e.target.value)}>
          <option>Todas</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      <Card style={{overflow:"hidden"}}>
        {filtered.length===0 ? <EmptyState icon={Package} title="No se encontraron productos"/> : (
          <div style={{overflowX:"auto"}}>
            <table className="w-full text-sm" style={{borderCollapse:"collapse"}}>
              <thead><tr style={{background:C.cream}}>{["Producto","Formato","Precio venta","Precio compra","Stock","Categoría","Acciones"].map(h=><th key={h} className="text-left px-4 py-3 font-semibold text-xs" style={{color:C.textMuted}}>{h}</th>)}</tr></thead>
              <tbody>
                {filtered.map(p=>{
                  const cs=CATEGORY_STYLES[p.category];
                  return (
                    <tr key={p.id} style={{borderTop:`1px solid ${C.border}`}}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded-lg object-cover" onError={e=>{e.target.style.display="none";}} /> : <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base" style={{background:cs.bg}}>{cs.emoji}</div>}
                          <span className="font-medium" style={{color:C.text}}>{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{color:C.textMuted}}>{p.format}</td>
                      <td className="px-4 py-3 font-semibold" style={{fontFamily:FONT_MONO,color:C.text}}>{formatCLP(p.salePrice)}</td>
                      <td className="px-4 py-3" style={{fontFamily:FONT_MONO,color:C.textMuted}}>{formatCLP(p.purchasePrice)}</td>
                      <td className="px-4 py-3"><StockBadge stock={p.stock}/></td>
                      <td className="px-4 py-3"><span className="px-2 py-1 rounded-md text-xs font-medium" style={{background:cs.bg,color:cs.fg}}>{p.category}</span></td>
                      <td className="px-4 py-3"><div className="flex gap-1">
                        <button onClick={()=>{setEditing(p);setShowForm(true);}} className="p-1.5 rounded-lg hover:bg-black/5"><Pencil size={15} color={C.textMuted}/></button>
                        {p.priceHistory?.length>0 && <button onClick={()=>setPriceHistTarget(p)} className="p-1.5 rounded-lg hover:bg-black/5" title="Historial de precios"><History size={15} color={C.navy}/></button>}
                        <button onClick={()=>setDelTarget(p)} className="p-1.5 rounded-lg hover:bg-black/5"><Trash2 size={15} color={C.danger}/></button>
                      </div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {showForm && <ProductFormModal initial={editing} onClose={()=>setShowForm(false)} onSave={data=>{ if(editing) setProducts(products.map(p=>p.id===editing.id?{...p,...data}:p)); else setProducts([{id:uid("p"),...data},...products]); showToast(editing?"Producto actualizado":"Producto agregado"); setShowForm(false); }}/>}
      {delTarget && (
        <Modal title="Eliminar producto" onClose={()=>setDelTarget(null)} width={400}>
          <p className="text-sm" style={{color:C.text}}>¿Seguro que quieres eliminar <strong>{delTarget.name}</strong>? Esta acción no se puede deshacer.</p>
          <div className="flex justify-end gap-2 mt-6">
            <Btn variant="ghost" onClick={()=>setDelTarget(null)}>Cancelar</Btn>
            <Btn variant="danger" icon={Trash2} onClick={()=>{ setProducts(products.filter(p=>p.id!==delTarget.id)); showToast("Producto eliminado"); setDelTarget(null); }}>Eliminar</Btn>
          </div>
        </Modal>
      )}
      {priceHistTarget && (
        <Modal title={"Historial de precios · "+priceHistTarget.name} onClose={()=>setPriceHistTarget(null)} width={460}>
          <div className="flex flex-col gap-2">
            {priceHistTarget.priceHistory?.map((h,i)=>(
              <div key={i} className="rounded-xl p-3 text-sm" style={{background:C.cream}}>
                <div className="text-xs mb-2 font-semibold" style={{color:C.textMuted}}>{formatDate(h.date)}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div><div className="text-xs" style={{color:C.textMuted}}>Precio venta anterior</div><div style={{fontFamily:FONT_MONO,color:C.danger}}>{formatCLP(h.oldSale)}</div></div>
                  <div><div className="text-xs" style={{color:C.textMuted}}>Precio venta nuevo</div><div style={{fontFamily:FONT_MONO,color:C.success}}>{formatCLP(h.newSale)}</div></div>
                  <div><div className="text-xs" style={{color:C.textMuted}}>Precio compra anterior</div><div style={{fontFamily:FONT_MONO,color:C.danger}}>{formatCLP(h.oldPurchase)}</div></div>
                  <div><div className="text-xs" style={{color:C.textMuted}}>Precio compra nuevo</div><div style={{fontFamily:FONT_MONO,color:C.success}}>{formatCLP(h.newPurchase)}</div></div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================== SCANNER ============================== */
function BarcodeScannerModal({ products, onClose, onFound }) {
  const videoRef = useRef(null);
  const streamRef= useRef(null);
  const rafRef   = useRef(null);
  const [status,  setStatus]  = useState("starting");
  const [found,   setFound]   = useState(null);
  const [lastCode,setLastCode]= useState("");

  useEffect(()=>{
    if (!("BarcodeDetector" in window)) { setStatus("unsupported"); return; }
    const det = new window.BarcodeDetector({ formats:["ean_13","ean_8","upc_a","upc_e","code_128","code_39","qr_code"] });
    navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}).then(stream=>{
      streamRef.current=stream;
      if (videoRef.current) {
        videoRef.current.srcObject=stream; videoRef.current.play(); setStatus("scanning");
        const scan=async()=>{
          if (!videoRef.current||videoRef.current.readyState<2){rafRef.current=requestAnimationFrame(scan);return;}
          try {
            const codes=await det.detect(videoRef.current);
            if (codes.length>0){
              const code=codes[0].rawValue;
              if (code!==lastCode){ setLastCode(code);
                const match=products.find(p=>p.barcode===code);
                if (match){setFound(match);setStatus("found");return;}
                else{setStatus("notfound");setTimeout(()=>setStatus("scanning"),1800);}
              }
            }
          } catch(_){}
          rafRef.current=requestAnimationFrame(scan);
        };
        rafRef.current=requestAnimationFrame(scan);
      }
    }).catch(()=>setStatus("error"));
    return ()=>{ if(rafRef.current)cancelAnimationFrame(rafRef.current); if(streamRef.current)streamRef.current.getTracks().forEach(t=>t.stop()); };
  },[]);

  const msg = { starting:{t:"Iniciando cámara...",c:C.textMuted}, scanning:{t:"Apunta al código de barra",c:C.teal}, notfound:{t:"Código no registrado en inventario",c:C.amber}, found:{t:"¡Producto encontrado!",c:C.success}, error:{t:"No se pudo acceder a la cámara.",c:C.danger}, unsupported:{t:"Usa Chrome o Edge para escanear.",c:C.danger} }[status];

  return (
    <Modal title="Escanear código de barra" onClose={onClose} width={420}>
      <div className="flex flex-col items-center gap-4">
        {status!=="unsupported"&&status!=="error" ? (
          <div className="relative w-full rounded-2xl overflow-hidden" style={{background:"#000",aspectRatio:"4/3"}}>
            <video ref={videoRef} muted playsInline className="w-full h-full object-cover"/>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-52 h-32">
                {[["top-0 left-0","border-t-2 border-l-2"],["top-0 right-0","border-t-2 border-r-2"],["bottom-0 left-0","border-b-2 border-l-2"],["bottom-0 right-0","border-b-2 border-r-2"]].map(([pos,cls])=>(
                  <div key={pos} className={`absolute w-5 h-5 ${pos} ${cls}`} style={{borderColor:status==="found"?C.success:C.orange}}/>
                ))}
                {status==="scanning"&&<div className="absolute left-0 right-0 h-0.5 top-1/2" style={{background:C.orange,animation:"scan 1.6s ease-in-out infinite"}}/>}
              </div>
            </div>
            {status==="found"&&<div className="absolute inset-0 flex items-center justify-center" style={{background:"rgba(249,115,22,0.15)"}}><CheckCircle2 size={52} color={C.success}/></div>}
          </div>
        ) : (
          <div className="w-full rounded-2xl flex items-center justify-center py-14" style={{background:C.cream}}><AlertTriangle size={36} color={C.danger}/></div>
        )}
        <p className="text-sm font-semibold text-center" style={{color:msg.c}}>{msg.t}</p>
        {status==="found"&&found&&(
          <div className="w-full rounded-xl p-4" style={{background:C.successLight,border:`1px solid ${C.success}30`}}>
            <div className="flex items-center gap-3">
              <div className="text-3xl">{CATEGORY_STYLES[found.category]?.emoji}</div>
              <div className="flex-1"><div className="font-bold text-sm" style={{color:C.text}}>{found.name}</div><div className="text-xs mt-0.5" style={{color:C.textMuted}}>{formatCLP(found.salePrice)} · Stock: {found.stock}</div></div>
            </div>
          </div>
        )}
        <div className="flex gap-2 w-full">
          <Btn full variant="ghost" onClick={onClose}>Cancelar</Btn>
          {status==="found"&&found&&<Btn full icon={ShoppingCart} onClick={()=>{onFound(found);onClose();}}>Agregar al carrito</Btn>}
        </div>
      </div>
      <style>{`@keyframes scan{0%,100%{top:10%}50%{top:80%}}`}</style>
    </Modal>
  );
}

/* ============================== VENTA (POS) ============================== */
function CheckoutModal({ total, cartItems, fiados, onClose, onFinalize }) {
  const [method,  setMethod]  = useState(null);
  const [received,setReceived]= useState(total);
  const [mixCash, setMixCash] = useState(Math.round(total/2));
  const [mixCard, setMixCard] = useState(total-Math.round(total/2));
  const [fQuery,  setFQuery]  = useState("");
  const [fClient, setFClient] = useState(null);
  const [newMode, setNewMode] = useState(false);
  const [newC,    setNewC]    = useState({name:"",phone:"",rut:""});

  const change   = method==="efectivo"?received-total:0;
  const mixOk    = mixCash+mixCard===total;
  const fMatches = fiados.filter(f=>f.name.toLowerCase().includes(fQuery.toLowerCase())||f.rut.includes(fQuery));

  function canFinalize() {
    if (!method) return false;
    if (method==="efectivo") return received>=total;
    if (method==="mixto")    return mixOk;
    if (method==="fiado")    return newMode?newC.name.trim().length>0:!!fClient;
    return true;
  }

  return (
    <Modal title="Cobrar boleta" onClose={onClose} width={520}>
      <div className="text-center mb-5">
        <div className="text-xs font-semibold mb-1" style={{color:C.textMuted}}>TOTAL A PAGAR</div>
        <div className="text-3xl font-bold" style={{fontFamily:FONT_MONO,color:C.text}}>{formatCLP(total)}</div>
      </div>
      <div className="text-xs font-semibold mb-2" style={{color:C.textMuted}}>MEDIO DE PAGO</div>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {PAYMENT_METHODS.map(m=>(
          <button key={m.id} onClick={()=>setMethod(m.id)}
            className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold"
            style={{background:method===m.id?m.color:C.cream,color:method===m.id?"#fff":C.text,border:`1px solid ${method===m.id?m.color:C.border}`}}>
            <m.icon size={17}/>{m.label}
          </button>
        ))}
      </div>
      {method==="efectivo"&&(
        <div className="mb-5">
          <Field label="Monto recibido"><input type="number" style={inputStyle} value={received} onChange={e=>setReceived(Number(e.target.value))}/></Field>
          <div className="flex justify-between mt-2 text-sm font-semibold">
            <span style={{color:C.textMuted}}>Vuelto</span>
            <span style={{color:change<0?C.danger:C.success,fontFamily:FONT_MONO}}>{change<0?"Falta "+formatCLP(-change):formatCLP(change)}</span>
          </div>
        </div>
      )}
      {method==="mixto"&&(
        <div className="mb-5 grid grid-cols-2 gap-3">
          <Field label="Efectivo"><input type="number" style={inputStyle} value={mixCash} onChange={e=>setMixCash(Number(e.target.value))}/></Field>
          <Field label="Tarjeta"><input type="number" style={inputStyle} value={mixCard} onChange={e=>setMixCard(Number(e.target.value))}/></Field>
          {!mixOk&&<p className="col-span-2 text-xs" style={{color:C.danger}}>La suma debe ser {formatCLP(total)}</p>}
        </div>
      )}
      {method==="fiado"&&(
        <div className="mb-5">
          {!newMode?(
            <>
              <Field label="Buscar cliente"><input style={inputStyle} value={fQuery} onChange={e=>{setFQuery(e.target.value);setFClient(null);}} placeholder="Nombre o RUT..."/></Field>
              {fQuery&&(
                <div className="mt-2 rounded-xl overflow-hidden" style={{border:`1px solid ${C.border}`}}>
                  {fMatches.length===0?<div className="p-3 text-xs" style={{color:C.textMuted}}>Sin resultados</div>:
                    fMatches.map(f=><button key={f.id} onClick={()=>setFClient(f)} className="w-full text-left px-3 py-2 text-sm flex justify-between" style={{background:fClient?.id===f.id?C.orangeLight:"#fff",borderTop:`1px solid ${C.border}`}}><span>{f.name}</span><span style={{fontFamily:FONT_MONO,color:C.textMuted}}>{formatCLP(f.balance)}</span></button>)}
                </div>
              )}
              {fClient&&<p className="text-xs mt-2" style={{color:C.success}}>Nuevo saldo: {formatCLP(fClient.balance+total)}</p>}
              <button onClick={()=>setNewMode(true)} className="text-xs font-semibold mt-3" style={{color:C.orange}}>+ Registrar cliente nuevo</button>
            </>
          ):(
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Field label="Nombre"><input style={inputStyle} value={newC.name} onChange={e=>setNewC({...newC,name:e.target.value})}/></Field></div>
              <Field label="Teléfono"><input style={inputStyle} value={newC.phone} onChange={e=>setNewC({...newC,phone:e.target.value})}/></Field>
              <Field label="RUT"><input style={inputStyle} value={newC.rut} onChange={e=>setNewC({...newC,rut:e.target.value})}/></Field>
              <button onClick={()=>setNewMode(false)} className="col-span-2 text-xs font-semibold text-left" style={{color:C.textMuted}}>← Buscar existente</button>
            </div>
          )}
        </div>
      )}
      <div className="flex justify-end gap-2 mt-6">
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn variant="outline" disabled={!canFinalize()} onClick={()=>onFinalize({method,fiadoClient:newMode?{...newC,isNew:true}:fClient,print:false})}>Finalizar</Btn>
        <Btn icon={Receipt} disabled={!canFinalize()} onClick={()=>onFinalize({method,fiadoClient:newMode?{...newC,isNew:true}:fClient,print:true})}>Imprimir</Btn>
      </div>
    </Modal>
  );
}

function ReceiptModal({ sale, profile, onClose }) {
  return (
    <Modal title="Comprobante" onClose={onClose} width={360}>
      <div className="rounded-xl p-5" style={{background:"#FFFFFF",border:`1px dashed ${C.border}`,fontFamily:FONT_MONO,transform:"rotate(-0.3deg)"}}>
        <div className="text-center mb-3">
          <div className="font-bold text-sm" style={{fontFamily:FONT_DISPLAY}}>{profile.name}</div>
          <div className="text-[11px]" style={{color:C.textMuted}}>{profile.rut} · {profile.address}</div>
        </div>
        <div className="text-[11px] mb-3" style={{color:C.textMuted,borderTop:`1px dashed ${C.border}`,borderBottom:`1px dashed ${C.border}`,padding:"6px 0"}}>
          <div className="flex justify-between"><span>Voucher</span><span>{sale.voucher}</span></div>
          <div className="flex justify-between"><span>Boleta SII</span><span>{sale.boletaSII}</span></div>
          <div className="flex justify-between"><span>Fecha</span><span>{formatDateTime(sale.datetime)}</span></div>
        </div>
        <div className="text-[12px] mb-3">{sale.items.map((it,i)=><div key={i} className="flex justify-between mb-1"><span>{it.qty}x {it.name}</span><span>{formatCLP(it.price*it.qty)}</span></div>)}</div>
        <div className="flex justify-between font-bold text-sm pt-2" style={{borderTop:`1px dashed ${C.border}`}}><span>TOTAL</span><span>{formatCLP(sale.total)}</span></div>
        <div className="text-[11px] mt-1" style={{color:C.textMuted}}>Pago: {PAYMENT_LABEL[sale.paymentType]}</div>
        <div className="text-center text-[11px] mt-4" style={{color:C.textMuted}}>¡Gracias por su compra! 🌸</div>
      </div>
      <Btn full onClick={onClose} variant="dark" style={{marginTop:12}}>Cerrar</Btn>
    </Modal>
  );
}

function VentaView({ products, setProducts, cart, setCart, fiados, setFiados, sales, setSales, profile, counters, setCounters, showToast }) {
  const [search,   setSearch]   = useState("");
  const [checkout, setCheckout] = useState(false);
  const [receipt,  setReceipt]  = useState(null);
  const [scanner,  setScanner]  = useState(false);
  const [discount, setDiscount] = useState(0);

  const filtered   = products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));
  const cartItems  = cart.map(c=>{ const p=products.find(x=>x.id===c.productId); return {...c,product:p,subtotal:p?p.salePrice*c.qty:0}; }).filter(c=>c.product);
  const subtotalSinDesc = cartItems.reduce((s,c)=>s+c.subtotal,0);
  const descuentoMonto  = Math.round(subtotalSinDesc * (discount/100));
  const total           = subtotalSinDesc - descuentoMonto;

  function addToCart(product) {
    const ex=cart.find(c=>c.productId===product.id);
    if ((ex?.qty||0)>=product.stock){showToast("Stock insuficiente","error");return;}
    if (ex) setCart(cart.map(c=>c.productId===product.id?{...c,qty:c.qty+1}:c));
    else setCart([...cart,{productId:product.id,qty:1}]);
  }
  function changeQty(pid,delta){
    const p=products.find(x=>x.id===pid);
    setCart(cart.map(c=>{if(c.productId!==pid)return c;const n=c.qty+delta;if(n>p.stock){showToast("Stock insuficiente","error");return c;}return{...c,qty:n};}).filter(c=>c.qty>0));
  }

  function finalizeSale({method,fiadoClient,print}){
    const v=counters.voucher+1,b=counters.boleta+1; setCounters({voucher:v,boleta:b});
    const sale={id:uid("s"),voucher:"V-"+v,boletaSII:b,datetime:new Date().toISOString(),vendor:"Tú",paymentType:method,items:cartItems.map(c=>({productId:c.productId,name:c.product.name,price:c.product.salePrice,qty:c.qty})),total};
    setProducts(products.map(p=>{const ic=cart.find(c=>c.productId===p.id);return ic?{...p,stock:Math.max(0,p.stock-ic.qty)}:p;}));
    if (method==="fiado"&&fiadoClient){
      if (fiadoClient.isNew) setFiados([{id:uid("f"),name:fiadoClient.name,phone:fiadoClient.phone,rut:fiadoClient.rut||"—",balance:total,history:[{date:todayISO(),type:"cargo",amount:total,note:"Venta "+sale.voucher}]},...fiados]);
      else setFiados(fiados.map(f=>f.id===fiadoClient.id?{...f,balance:f.balance+total,history:[{date:todayISO(),type:"cargo",amount:total,note:"Venta "+sale.voucher},...f.history]}:f));
    }
    setSales([sale,...sales]); setCart([]); setCheckout(false); showToast("Venta registrada");
    if (print) setReceipt(sale);
  }

  return (
    <div className="flex gap-6 items-start flex-col lg:flex-row">
      <div className="flex-1 w-full">
        <PageHeader title="Venta" subtitle="Selecciona productos para agregar a la boleta"/>
        <div className="flex gap-2 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" color={C.textMuted}/>
            <input style={{...inputStyle,paddingLeft:34}} placeholder="Buscar producto..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <button onClick={()=>setScanner(true)} className="flex items-center gap-2 px-4 rounded-xl font-semibold text-sm shrink-0 text-white"
            style={{background:C.ink,border:"none",cursor:"pointer"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5v4"/><path d="M3 19v-4"/><path d="M21 5v4"/><path d="M21 19v-4"/><rect x="7" y="7" width="3" height="10"/><rect x="14" y="7" width="3" height="10"/><path d="M3 9h4"/><path d="M3 15h4"/><path d="M17 9h4"/><path d="M17 15h4"/></svg>
            Escanear
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(p=>{
            const cs=CATEGORY_STYLES[p.category]; const inCart=cart.find(c=>c.productId===p.id)?.qty||0;
            return (
              <button key={p.id} onClick={()=>addToCart(p)} disabled={p.stock===0}
                className="text-left p-3 rounded-2xl relative disabled:opacity-40 transition hover:shadow-md"
                style={{background:C.surface,border:`1.5px solid ${inCart?C.orange:C.border}`}}>
                {inCart>0&&<span className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:C.orange}}>{inCart}</span>}
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full aspect-square rounded-xl object-cover mb-2" onError={e=>{e.target.style.display="none";}} /> : <div className="w-full aspect-square rounded-xl flex items-center justify-center text-3xl mb-2" style={{background:cs.bg}}>{cs.emoji}</div>}
                <div className="text-xs font-semibold leading-tight mb-1" style={{color:C.text}}>{p.name}</div>
                <div className="text-sm font-bold" style={{fontFamily:FONT_MONO,color:C.orangeDark}}>{formatCLP(p.salePrice)}</div>
                <div className="text-[11px] mt-0.5" style={{color:p.stock===0?C.danger:C.textMuted}}>{p.stock===0?"Sin stock":p.stock+" disponibles"}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-20">
        <div className="rounded-2xl p-5" style={{background:"#FFFFFF",border:`1.5px dashed ${C.border}`,fontFamily:FONT_MONO,boxShadow:"0 4px 20px rgba(249,115,22,0.06)"}}>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={16} color={C.text}/><span className="font-bold text-sm" style={{fontFamily:FONT_DISPLAY,color:C.text}}>Carrito</span>
          </div>
          {cartItems.length===0 ? <p className="text-xs text-center py-8" style={{color:C.textMuted,fontFamily:FONT_BODY}}>Carrito vacío.<br/>Toca un producto para agregar.</p> : (
            <div className="flex flex-col gap-3 mb-3">
              {cartItems.map(c=>(
                <div key={c.productId} className="pb-3" style={{borderBottom:`1px dashed ${C.border}`}}>
                  <div className="flex justify-between text-xs font-semibold mb-1.5" style={{color:C.text,fontFamily:FONT_BODY}}>
                    <span className="pr-2">{c.product.name}</span>
                    <button onClick={()=>setCart(cart.filter(x=>x.productId!==c.productId))}><X size={13} color={C.textMuted}/></button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={()=>changeQty(c.productId,-1)} className="w-6 h-6 rounded-md flex items-center justify-center" style={{background:C.cream}}><Minus size={11}/></button>
                      <span className="text-xs w-4 text-center">{c.qty}</span>
                      <button onClick={()=>changeQty(c.productId,1)} className="w-6 h-6 rounded-md flex items-center justify-center" style={{background:C.cream}}><Plus size={11}/></button>
                    </div>
                    <span className="text-xs font-bold">{formatCLP(c.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="pt-2 mb-3" style={{borderTop:`1px solid ${C.border}`}}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold flex items-center gap-1" style={{color:C.textMuted}}><Tag size={12}/> Descuento</span>
              <div className="flex items-center gap-1">
                {[0,5,10,15,20].map(d=>(
                  <button key={d} onClick={()=>setDiscount(d)}
                    className="text-[10px] px-2 py-1 rounded-lg font-semibold"
                    style={{background:discount===d?C.orange:C.cream, color:discount===d?"#fff":C.textMuted}}>
                    {d===0?"Sin desc.":d+"%"}
                  </button>
                ))}
              </div>
            </div>
            {discount>0 && (
              <div className="flex justify-between text-xs">
                <span style={{color:C.textMuted}}>Subtotal</span>
                <span style={{fontFamily:FONT_MONO,color:C.textMuted}}>{formatCLP(subtotalSinDesc)}</span>
              </div>
            )}
            {discount>0 && (
              <div className="flex justify-between text-xs">
                <span style={{color:C.success}}>Descuento {discount}%</span>
                <span style={{fontFamily:FONT_MONO,color:C.success}}>-{formatCLP(descuentoMonto)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold" style={{fontFamily:FONT_DISPLAY}}>Total</span>
            <span className="text-xl font-bold" style={{color:C.orangeDark}}>{formatCLP(total)}</span>
          </div>
          <Btn full disabled={cartItems.length===0} onClick={()=>setCheckout(true)}>Cobrar {cartItems.length>0&&formatCLP(total)}</Btn>
        </div>
      </div>

      {scanner&&<BarcodeScannerModal products={products} onClose={()=>setScanner(false)} onFound={p=>{addToCart(p);showToast(`${p.name} agregado`);}}/>}
      {checkout&&<CheckoutModal total={total} cartItems={cartItems} fiados={fiados} onClose={()=>setCheckout(false)} onFinalize={finalizeSale}/>}
      {receipt&&<ReceiptModal sale={receipt} profile={profile} onClose={()=>setReceipt(null)}/>}
    </div>
  );
}

/* ============================== FIADOS ============================== */
function FiadoDetailModal({ client, onClose, onAbono }) {
  const [amount, setAmount] = useState("");
  return (
    <Modal title={client.name} onClose={onClose} width={460}>
      <div className="flex justify-between text-sm mb-4">
        <div><div className="text-xs" style={{color:C.textMuted}}>RUT</div><div style={{fontFamily:FONT_MONO}}>{client.rut}</div></div>
        <div><div className="text-xs" style={{color:C.textMuted}}>Teléfono</div><div style={{fontFamily:FONT_MONO}}>{client.phone}</div></div>
        <div className="text-right"><div className="text-xs" style={{color:C.textMuted}}>Saldo</div><div className="font-bold" style={{color:client.balance>0?C.danger:C.success,fontFamily:FONT_MONO}}>{formatCLP(client.balance)}</div></div>
      </div>
      {client.balance>0&&(
        <div className="flex gap-2 mb-5">
          <input type="number" style={inputStyle} placeholder="Monto del abono" value={amount} onChange={e=>setAmount(e.target.value)}/>
          <Btn variant="teal" onClick={()=>{ if(Number(amount)>0){onAbono(Number(amount));setAmount(""); }}}>Registrar abono</Btn>
        </div>
      )}
      <div className="text-xs font-semibold mb-2" style={{color:C.textMuted}}>HISTORIAL</div>
      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
        {client.history.map((h,i)=>(
          <div key={i} className="flex justify-between items-center text-sm px-3 py-2 rounded-lg" style={{background:C.cream}}>
            <div><div style={{color:C.text}}>{h.note}</div><div className="text-xs" style={{color:C.textMuted}}>{formatDate(h.date)}</div></div>
            <span className="font-semibold" style={{fontFamily:FONT_MONO,color:h.type==="cargo"?C.danger:C.success}}>{h.type==="cargo"?"+":"-"}{formatCLP(h.amount)}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function FiadosView({ fiados, setFiados, showToast }) {
  const [tab,  setTab]  = useState("pendientes");
  const [search,setSearch]=useState("");
  const [sel,  setSel]  = useState(null);
  const totalP = fiados.reduce((s,f)=>s+f.balance,0);
  const base   = tab==="pendientes"?fiados.filter(f=>f.balance>0):fiados;
  const filtered=base.filter(f=>f.name.toLowerCase().includes(search.toLowerCase())||f.rut.includes(search));

  function abono(amount) {
    setFiados(fiados.map(f=>f.id===sel.id?{...f,balance:Math.max(0,f.balance-amount),history:[{date:todayISO(),type:"abono",amount,note:"Abono registrado"},...f.history]}:f));
    setSel(s=>({...s,balance:Math.max(0,s.balance-amount),history:[{date:todayISO(),type:"abono",amount,note:"Abono registrado"},...s.history]}));
    showToast("Abono registrado");
  }

  return (
    <div>
      <PageHeader title="Fiados" subtitle="Gestión de créditos a clientes" right={
        <Card style={{padding:"10px 16px"}}><div className="text-xs" style={{color:C.textMuted}}>Total pendiente</div><div className="font-bold" style={{fontFamily:FONT_MONO,color:C.danger}}>{formatCLP(totalP)}</div></Card>}/>
      <div className="flex gap-2 mb-5">
        {[["pendientes","Pendientes"],["historico","Histórico"]].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} className="px-4 py-2 rounded-xl text-sm font-semibold"
            style={{background:tab===id?C.ink:"transparent",color:tab===id?"#fff":C.textMuted}}>{label}</button>
        ))}
      </div>
      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" color={C.textMuted}/>
        <input style={{...inputStyle,paddingLeft:34}} placeholder="Buscar por nombre o RUT..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <Card style={{overflow:"hidden"}}>
        {filtered.length===0?<EmptyState icon={Coins} title="No hay clientes"/>:(
          <table className="w-full text-sm">
            <thead><tr style={{background:C.cream}}>{["Cliente","Teléfono","RUT","Saldo",""].map(h=><th key={h} className="text-left px-4 py-3 font-semibold text-xs" style={{color:C.textMuted}}>{h}</th>)}</tr></thead>
            <tbody>{filtered.map(f=>(
              <tr key={f.id} style={{borderTop:`1px solid ${C.border}`}}>
                <td className="px-4 py-3 font-medium" style={{color:C.text}}>{f.name}</td>
                <td className="px-4 py-3" style={{color:C.textMuted,fontFamily:FONT_MONO}}>{f.phone}</td>
                <td className="px-4 py-3" style={{color:C.textMuted,fontFamily:FONT_MONO}}>{f.rut}</td>
                <td className="px-4 py-3 font-bold" style={{fontFamily:FONT_MONO,color:f.balance>0?C.danger:C.success}}>{formatCLP(f.balance)}</td>
                <td className="px-4 py-3 text-right"><Btn size="sm" variant="outline" onClick={()=>setSel(f)}>Ver detalle</Btn></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Card>
      {sel&&<FiadoDetailModal client={sel} onClose={()=>setSel(null)} onAbono={abono}/>}
    </div>
  );
}

/* ============================== BOLETAS ============================== */
function SaleDetailModal({ sale, onClose }) {
  return (
    <Modal title={"Boleta "+sale.voucher} onClose={onClose} width={420}>
      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div><div className="text-xs" style={{color:C.textMuted}}>Boleta SII</div><div style={{fontFamily:FONT_MONO}}>{sale.boletaSII}</div></div>
        <div><div className="text-xs" style={{color:C.textMuted}}>Fecha</div><div>{formatDateTime(sale.datetime)}</div></div>
        <div><div className="text-xs" style={{color:C.textMuted}}>Vendedor</div><div>{sale.vendor}</div></div>
        <div><div className="text-xs" style={{color:C.textMuted}}>Pago</div><div>{PAYMENT_LABEL[sale.paymentType]}</div></div>
      </div>
      <div className="flex flex-col gap-2 mb-3">{sale.items.map((it,i)=><div key={i} className="flex justify-between text-sm px-3 py-2 rounded-lg" style={{background:C.cream}}><span>{it.qty}x {it.name}</span><span style={{fontFamily:FONT_MONO}}>{formatCLP(it.price*it.qty)}</span></div>)}</div>
      <div className="flex justify-between font-bold pt-3 text-sm" style={{borderTop:`1px solid ${C.border}`}}><span>Total</span><span style={{fontFamily:FONT_MONO}}>{formatCLP(sale.total)}</span></div>
    </Modal>
  );
}

function DetalleBoletaView({ sales, setSales, setProducts, products, showToast }) {
  const [from,setFrom]=useState(daysAgoISO(30));
  const [to,setTo]=useState(todayISO());
  const [sel,setSel]=useState(null);
  const [devolucion,setDevolucion]=useState(null);
  const filtered=sales.filter(s=>{const d=s.datetime.slice(0,10);return d>=from&&d<=to;});

  function procesarDevolucion(sale) {
    // Reverse stock
    setProducts(products.map(p=>{
      const item = sale.items.find(it=>it.productId===p.id);
      return item ? {...p, stock: p.stock+item.qty} : p;
    }));
    // Mark sale as devuelta
    setSales(sales.map(s=>s.id===sale.id?{...s,devuelta:true,devueltaFecha:todayISO()}:s));
    setDevolucion(null);
    showToast("Devolución procesada — stock repuesto");
  }

  return (
    <div>
      <PageHeader title="Detalle Boleta" subtitle="Historial completo de boletas de venta"/>
      <Card style={{padding:20}} className="mb-5">
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <Field label="Fecha desde"><input type="date" style={inputStyle} value={from} onChange={e=>setFrom(e.target.value)}/></Field>
          <Field label="Fecha hasta"><input type="date" style={inputStyle} value={to} onChange={e=>setTo(e.target.value)}/></Field>
        </div>
      </Card>
      <Card style={{overflow:"hidden"}}>
        {filtered.length===0?<EmptyState icon={Receipt} title="No se encontraron boletas" subtitle="Ajusta el rango de fechas"/>:(
          <div style={{overflowX:"auto"}}>
            <table className="w-full text-sm">
              <thead><tr style={{background:C.cream}}>{["Voucher","Boleta SII","Fecha-Hora","Vendedor","Pago","Total","Estado",""].map(h=><th key={h} className="text-left px-4 py-3 font-semibold text-xs" style={{color:C.textMuted}}>{h}</th>)}</tr></thead>
              <tbody>{filtered.map(s=>(
                <tr key={s.id} style={{borderTop:`1px solid ${C.border}`, opacity: s.devuelta?0.6:1}}>
                  <td className="px-4 py-3" style={{fontFamily:FONT_MONO}}>{s.voucher}</td>
                  <td className="px-4 py-3" style={{fontFamily:FONT_MONO,color:C.textMuted}}>{s.boletaSII}</td>
                  <td className="px-4 py-3" style={{color:C.textMuted}}>{formatDateTime(s.datetime)}</td>
                  <td className="px-4 py-3">{s.vendor}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-md text-xs font-medium" style={{background:C.cream,color:C.text}}>{PAYMENT_LABEL[s.paymentType]}</span></td>
                  <td className="px-4 py-3 font-bold" style={{fontFamily:FONT_MONO}}>{formatCLP(s.total)}</td>
                  <td className="px-4 py-3">
                    {s.devuelta ? <span className="px-2 py-1 rounded-md text-xs font-medium" style={{background:C.dangerLight,color:C.danger}}>Devuelta</span>
                    : <span className="px-2 py-1 rounded-md text-xs font-medium" style={{background:C.successLight,color:C.success}}>Válida</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <Btn size="sm" variant="outline" onClick={()=>setSel(s)}>Ver</Btn>
                      {!s.devuelta && <Btn size="sm" variant="danger" icon={RotateCcw} onClick={()=>setDevolucion(s)}>Devolver</Btn>}
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </Card>
      {sel&&<SaleDetailModal sale={sel} onClose={()=>setSel(null)}/>}
      {devolucion&&(
        <Modal title="Procesar devolución" onClose={()=>setDevolucion(null)} width={440}>
          <div className="p-4 rounded-xl mb-4" style={{background:C.dangerLight}}>
            <p className="text-sm font-semibold" style={{color:C.danger}}>⚠️ Esta acción devolverá el stock de todos los productos de esta boleta.</p>
          </div>
          <div className="text-sm mb-4">
            <div className="flex justify-between mb-2"><span style={{color:C.textMuted}}>Voucher</span><span style={{fontFamily:FONT_MONO}}>{devolucion.voucher}</span></div>
            <div className="flex justify-between mb-2"><span style={{color:C.textMuted}}>Total</span><span style={{fontFamily:FONT_MONO,fontWeight:700}}>{formatCLP(devolucion.total)}</span></div>
            <div className="flex justify-between"><span style={{color:C.textMuted}}>Fecha</span><span>{formatDateTime(devolucion.datetime)}</span></div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="ghost" onClick={()=>setDevolucion(null)}>Cancelar</Btn>
            <Btn variant="danger" icon={RotateCcw} onClick={()=>procesarDevolucion(devolucion)}>Confirmar devolución</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================== REPORTE ============================== */
function ReporteView({ sales, products }) {
  const [from,setFrom]=useState(daysAgoISO(13));
  const [to,setTo]=useState(todayISO());
  const filtered=sales.filter(s=>{const d=s.datetime.slice(0,10);return d>=from&&d<=to;});
  const total=filtered.reduce((s,x)=>s+x.total,0);
  const avg=filtered.length?total/filtered.length:0;
  const chart=useMemo(()=>{ const m={}; filtered.forEach(s=>{const d=s.datetime.slice(0,10);m[d]=(m[d]||0)+s.total;}); return Object.keys(m).sort().map(d=>({date:d.slice(5),total:m[d]})); },[filtered]);
  const top=useMemo(()=>{ const m={}; filtered.forEach(s=>s.items.forEach(it=>{m[it.name]=(m[it.name]||0)+it.qty;})); return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,5); },[filtered]);
  const maxQ=top[0]?.[1]||1;

  return (
    <div>
      <PageHeader title="Reporte" subtitle="Analiza el rendimiento de tu negocio"/>
      <Card style={{padding:20}} className="mb-5">
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <Field label="Desde"><input type="date" style={inputStyle} value={from} onChange={e=>setFrom(e.target.value)}/></Field>
          <Field label="Hasta"><input type="date" style={inputStyle} value={to} onChange={e=>setTo(e.target.value)}/></Field>
        </div>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {[["Total vendido",formatCLP(total)],["Boletas emitidas",filtered.length],["Ticket promedio",formatCLP(avg)]].map(([label,val])=>(
          <Card key={label} style={{padding:18}}><div className="text-xs" style={{color:C.textMuted}}>{label}</div><div className="text-xl font-bold mt-1" style={{fontFamily:FONT_MONO,color:C.text}}>{val}</div></Card>
        ))}
      </div>
      <Card style={{padding:20}} className="mb-5">
        <h3 className="text-sm font-bold mb-4" style={{fontFamily:FONT_DISPLAY,color:C.text}}>Ventas por día</h3>
        {chart.length===0?<EmptyState icon={BarChart3} title="Sin datos en este rango"/>:(
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="date" tick={{fontSize:11,fill:C.textMuted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:C.textMuted}} axisLine={false} tickLine={false} tickFormatter={v=>"$"+v/1000+"k"}/>
              <Tooltip formatter={v=>formatCLP(v)} contentStyle={{borderRadius:10,border:`1px solid ${C.border}`,fontSize:12}}/>
              <Bar dataKey="total" fill={C.orange} radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
      <Card style={{padding:20}}>
        <h3 className="text-sm font-bold mb-4" style={{fontFamily:FONT_DISPLAY,color:C.text}}>Productos más vendidos</h3>
        {top.length===0?<EmptyState icon={Package} title="Sin datos"/>:(
          <div className="flex flex-col gap-3">
            {top.map(([name,qty])=>(
              <div key={name}>
                <div className="flex justify-between text-xs mb-1"><span style={{color:C.text}}>{name}</span><span style={{color:C.textMuted,fontFamily:FONT_MONO}}>{qty} uds.</span></div>
                <div className="h-2 rounded-full" style={{background:C.cream}}><div className="h-2 rounded-full" style={{width:`${(qty/maxQ)*100}%`,background:C.orange}}/></div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ============================== CAJA ============================== */
function CajaView({ sales, cajaState, setCajaState, showToast, currentUser }) {
  const [closeModal,setCloseModal]=useState(false);
  const [counted,setCounted]=useState("");
  const [turnos,setTurnos]=useState([]);
  const today=todayISO();
  const salesToday=sales.filter(s=>s.datetime.slice(0,10)===today);
  const cashSales=salesToday.filter(s=>s.paymentType==="efectivo").reduce((s,x)=>s+x.total,0);
  const expected=cajaState.openingAmount+cashSales;
  const diff=counted!==""?Number(counted)-expected:0;
  const byMethod=PAYMENT_METHODS.map(m=>({...m,count:salesToday.filter(s=>s.paymentType===m.id).length,total:salesToday.filter(s=>s.paymentType===m.id).reduce((s,x)=>s+x.total,0)})).filter(m=>m.id!=="fiado");

  function abrirCaja() {
    const now = new Date().toISOString();
    setCajaState({isOpen:true,openedAt:now,openingAmount:20000});
    setTurnos(t=>[{id:uid("t"),vendor:currentUser.name,apertura:now,cierre:null,ventasTurno:0},...t]);
    showToast("Caja abierta");
  }

  function cerrarCaja() {
    const ventasTurno = salesToday.reduce((s,x)=>s+x.total,0);
    setTurnos(t=>t.map((tr,i)=>i===0?{...tr,cierre:new Date().toISOString(),ventasTurno}:tr));
    setCajaState({...cajaState,isOpen:false});
    setCloseModal(false);
    showToast("Caja cerrada correctamente");
  }

  return (
    <div>
      <PageHeader title="Caja 360°" subtitle="Control de efectivo y turnos del día"/>
      <Card style={{padding:20}} className="mb-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{background:cajaState.isOpen?C.successLight:C.dangerLight}}><Wallet size={20} color={cajaState.isOpen?C.success:C.danger}/></div>
          <div>
            <div className="font-bold text-sm" style={{color:C.text}}>{cajaState.isOpen?"Caja abierta":"Caja cerrada"}</div>
            <div className="text-xs" style={{color:C.textMuted}}>Apertura: {formatCLP(cajaState.openingAmount)} · {formatDateTime(cajaState.openedAt)}</div>
            {cajaState.isOpen && <div className="text-xs mt-0.5 flex items-center gap-1" style={{color:C.teal}}><UserCheck size={11}/> Turno: {currentUser.name}</div>}
          </div>
        </div>
        {cajaState.isOpen?<Btn variant="dark" onClick={()=>setCloseModal(true)}>Cerrar caja</Btn>:<Btn onClick={abrirCaja}>Abrir caja</Btn>}
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Card style={{padding:18}}><div className="text-xs" style={{color:C.textMuted}}>Efectivo esperado</div><div className="text-2xl font-bold mt-1" style={{fontFamily:FONT_MONO,color:C.text}}>{formatCLP(expected)}</div><div className="text-xs mt-1" style={{color:C.textMuted}}>Apertura {formatCLP(cajaState.openingAmount)} + Ventas {formatCLP(cashSales)}</div></Card>
        <Card style={{padding:18}}><div className="text-xs" style={{color:C.textMuted}}>Total vendido hoy</div><div className="text-2xl font-bold mt-1" style={{fontFamily:FONT_MONO,color:C.text}}>{formatCLP(salesToday.reduce((s,x)=>s+x.total,0))}</div><div className="text-xs mt-1" style={{color:C.textMuted}}>{salesToday.length} boletas emitidas</div></Card>
      </div>

      <Card style={{overflow:"hidden"}} className="mb-5">
        <table className="w-full text-sm">
          <thead><tr style={{background:C.cream}}>{["Medio de pago","Ventas","Total"].map(h=><th key={h} className="text-left px-4 py-3 font-semibold text-xs" style={{color:C.textMuted}}>{h}</th>)}</tr></thead>
          <tbody>{byMethod.map(m=><tr key={m.id} style={{borderTop:`1px solid ${C.border}`}}><td className="px-4 py-3 flex items-center gap-2"><m.icon size={15} color={m.color}/>{m.label}</td><td className="px-4 py-3" style={{color:C.textMuted}}>{m.count}</td><td className="px-4 py-3 font-semibold" style={{fontFamily:FONT_MONO}}>{formatCLP(m.total)}</td></tr>)}</tbody>
        </table>
      </Card>

      {turnos.length > 0 && (
        <Card style={{overflow:"hidden"}}>
          <div className="px-4 py-3 font-bold text-sm" style={{borderBottom:`1px solid ${C.border}`, fontFamily:FONT_DISPLAY, color:C.text}}>Turnos del día</div>
          <table className="w-full text-sm">
            <thead><tr style={{background:C.cream}}>{["Vendedora","Apertura","Cierre","Ventas del turno"].map(h=><th key={h} className="text-left px-4 py-3 font-semibold text-xs" style={{color:C.textMuted}}>{h}</th>)}</tr></thead>
            <tbody>{turnos.map(t=>(
              <tr key={t.id} style={{borderTop:`1px solid ${C.border}`}}>
                <td className="px-4 py-3 flex items-center gap-2"><div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:C.orange}}>{t.vendor.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>{t.vendor}</td>
                <td className="px-4 py-3 text-xs" style={{color:C.textMuted}}>{formatDateTime(t.apertura)}</td>
                <td className="px-4 py-3 text-xs" style={{color:C.textMuted}}>{t.cierre?formatDateTime(t.cierre):<span style={{color:C.success}}>En turno</span>}</td>
                <td className="px-4 py-3 font-semibold" style={{fontFamily:FONT_MONO}}>{formatCLP(t.ventasTurno)}</td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {closeModal&&(
        <Modal title="Cerrar caja" onClose={()=>setCloseModal(false)} width={400}>
          <Field label="Efectivo contado físicamente"><input type="number" style={inputStyle} value={counted} onChange={e=>setCounted(e.target.value)} placeholder="0"/></Field>
          {counted!==""&&<p className="text-sm mt-3 font-semibold" style={{color:diff===0?C.success:diff>0?C.teal:C.danger}}>{diff===0?"Caja cuadrada ✓":diff>0?`Sobrante de ${formatCLP(diff)}`:`Faltante de ${formatCLP(-diff)}`}</p>}
          <div className="flex justify-end gap-2 mt-6">
            <Btn variant="ghost" onClick={()=>setCloseModal(false)}>Cancelar</Btn>
            <Btn variant="dark" disabled={counted===""} onClick={cerrarCaja}>Confirmar cierre</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================== CONFIGURAR ============================== */
function ConfigurarView({ profile, setProfile, showToast, users, currentUser, onAddUser, onDeleteUser }) {
  const [tab,setTab]=useState("perfil");
  const [form,setForm]=useState(profile);
  const [newUser,setNewUser]=useState({name:"",pin:"",role:"vendedor"});
  const tabs=[{id:"perfil",label:"Perfil del negocio",icon:Store},{id:"sucursales",label:"Sucursales",icon:Building2},{id:"usuarios",label:"Usuarios",icon:Users},{id:"impresion",label:"Impresión",icon:Printer},{id:"logo",label:"Logo",icon:ImageIcon,premium:true},{id:"categorias",label:"Categorías",icon:Shapes,premium:true}];

  return (
    <div>
      <PageHeader title="Configuración" subtitle="Administra la información de tu negocio"/>
      <div className="flex gap-6 items-start flex-col md:flex-row">
        <Card style={{padding:8,width:"100%"}} className="md:w-60 shrink-0">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm mb-1"
              style={{background:tab===t.id?C.orangeLight:"transparent",color:tab===t.id?C.orangeDark:C.text,fontWeight:tab===t.id?600:500}}>
              <span className="flex items-center gap-2"><t.icon size={15}/>{t.label}</span>
              {t.premium&&<PremiumPill/>}
            </button>
          ))}
        </Card>
        <Card style={{padding:24,flex:1,width:"100%"}}>
          {tab==="perfil"&&(
            <>
              <h3 className="font-bold mb-4" style={{fontFamily:FONT_DISPLAY,color:C.text}}>Perfil del negocio</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre"><input style={inputStyle} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
                <Field label="RUT"><input style={inputStyle} value={form.rut} onChange={e=>setForm({...form,rut:e.target.value})}/></Field>
                <div className="col-span-2"><Field label="Dirección"><input style={inputStyle} value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></Field></div>
                <Field label="Comuna"><input style={inputStyle} value={form.comuna} onChange={e=>setForm({...form,comuna:e.target.value})}/></Field>
                <Field label="Región"><input style={inputStyle} value={form.region} onChange={e=>setForm({...form,region:e.target.value})}/></Field>
                <Field label="Tamaño"><input style={inputStyle} value={form.size} onChange={e=>setForm({...form,size:e.target.value})}/></Field>
                <Field label="Tipo"><select style={inputStyle} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Almacén de barrio</option><option>Minimarket</option><option>Botillería</option><option>Despensa</option></select></Field>
              </div>
              <div className="flex justify-end mt-6"><Btn icon={Check} onClick={()=>{setProfile(form);showToast("Perfil actualizado");}}>Guardar cambios</Btn></div>
            </>
          )}
          {tab==="sucursales"&&(
            <><h3 className="font-bold mb-4" style={{fontFamily:FONT_DISPLAY,color:C.text}}>Sucursales</h3>
            <div className="flex items-center justify-between p-4 rounded-xl mb-3" style={{background:C.cream}}><div className="flex items-center gap-3"><Building2 size={18} color={C.navy}/><div><div className="font-semibold text-sm">{form.name} (Principal)</div><div className="text-xs" style={{color:C.textMuted}}>{form.address}</div></div></div></div>
            <Btn variant="outline" icon={Plus} onClick={()=>showToast("Requiere plan Premium","error")}>Agregar sucursal</Btn></>
          )}
          {tab==="usuarios"&&(
            <>
              <h3 className="font-bold mb-1" style={{fontFamily:FONT_DISPLAY,color:C.text}}>Usuarios</h3>
              <p className="text-xs mb-4" style={{color:C.textMuted}}>Gestiona quién tiene acceso y qué puede hacer</p>
              {users.map(u=>(
                <div key={u.id} className="flex items-center justify-between p-3 rounded-xl mb-2" style={{background:C.cream}}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:u.role==="admin"?C.orange:C.teal}}>{u.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>
                    <div><div className="text-sm font-semibold" style={{color:C.text}}>{u.name}</div><div className="text-xs" style={{color:C.textMuted}}>PIN: {"•".repeat(u.pin.length)} · {u.role==="admin"?"Administrador":"Vendedor"}</div></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-md font-medium" style={{background:u.role==="admin"?C.orangeLight:C.tealLight,color:u.role==="admin"?C.orangeDark:C.teal}}>{u.role==="admin"?"Admin":"Vendedor"}</span>
                    {u.id!==currentUser.id&&<button onClick={()=>onDeleteUser(u.id)} className="p-1.5 rounded-lg hover:bg-black/5"><Trash2 size={14} color={C.danger}/></button>}
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 rounded-xl" style={{border:`1px dashed ${C.border}`}}>
                <p className="text-xs font-semibold mb-3" style={{color:C.text}}>Agregar nuevo usuario</p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Field label="Nombre"><input style={inputStyle} value={newUser.name} onChange={e=>setNewUser({...newUser,name:e.target.value})}/></Field>
                  <Field label="PIN (4 dígitos)"><input type="password" maxLength={4} style={inputStyle} value={newUser.pin} onChange={e=>setNewUser({...newUser,pin:e.target.value.replace(/\D/g,"").slice(0,4)})}/></Field>
                  <div className="col-span-2"><Field label="Rol"><select style={inputStyle} value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})}><option value="vendedor">Vendedor (acceso limitado)</option><option value="admin">Administrador (acceso completo)</option></select></Field></div>
                </div>
                <Btn size="sm" icon={Plus} disabled={!newUser.name.trim()||newUser.pin.length!==4} onClick={()=>{onAddUser(newUser);setNewUser({name:"",pin:"",role:"vendedor"});}}>Crear usuario</Btn>
              </div>
            </>
          )}
          {tab==="impresion"&&(
            <><h3 className="font-bold mb-4" style={{fontFamily:FONT_DISPLAY,color:C.text}}>Impresión</h3>
            <Field label="Tipo de impresora"><select style={inputStyle}><option>Térmica 80mm</option><option>Térmica 58mm</option><option>PDF / Sin impresora</option></select></Field></>
          )}
          {(tab==="logo"||tab==="categorias")&&(
            <div className="flex flex-col items-center text-center py-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{background:C.orangeLight}}><Lock size={20} color={C.orangeDark}/></div>
              <p className="font-semibold text-sm mb-1" style={{color:C.text}}>Función Premium</p>
              <p className="text-xs mb-4" style={{color:C.textMuted,maxWidth:280}}>Sube tu logo y crea categorías personalizadas con el plan Premium.</p>
              <Btn>Conocer planes</Btn>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ============================== TUTORIALES ============================== */
function TutorialesView() {
  const [open,setOpen]=useState(null);
  return (
    <div>
      <PageHeader title="Tutoriales" subtitle="Selecciona un módulo para ver los tutoriales disponibles"/>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {TUTORIAL_TOPICS.map(t=>(
          <button key={t.id} onClick={()=>setOpen(t)} className="text-left p-4 rounded-2xl transition hover:shadow-md" style={{background:C.surface,border:`1px solid ${C.border}`}}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{background:C.orangeLight}}><t.icon size={17} color={C.orange}/></div>
            <div className="font-semibold text-sm" style={{color:C.text}}>{t.label}</div>
          </button>
        ))}
      </div>
      {open&&(
        <Modal title={"Tutorial · "+open.label} onClose={()=>setOpen(null)} width={420}>
          <div className="flex flex-col gap-3">
            {open.tips.map((tip,i)=>(
              <div key={i} className="flex gap-3 text-sm">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{background:C.orangeLight,color:C.orangeDark}}>{i+1}</span>
                <span style={{color:C.text}}>{tip}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================== ECOMMERCE ============================== */
function EcommerceView() {
  const [estado,setEstado]=useState("Todos");
  const [name,setName]=useState("");
  const [sel,setSel]=useState(null);
  const STATUS_STYLE={Pendiente:{bg:C.amberLight,fg:C.amber},Confirmado:{bg:C.navyLight,fg:C.navy},Entregado:{bg:C.successLight,fg:C.success},Cancelado:{bg:C.dangerLight,fg:C.danger}};
  const filtered=SEED_ECOMMERCE.filter(o=>(estado==="Todos"||o.status===estado)&&o.client.toLowerCase().includes(name.toLowerCase()));
  return (
    <div>
      <PageHeader title="Ecommerce" subtitle="Gestión de pedidos online"/>
      <Card style={{padding:20}} className="mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Estado"><select style={inputStyle} value={estado} onChange={e=>setEstado(e.target.value)}>{["Todos","Pendiente","Confirmado","Entregado","Cancelado"].map(s=><option key={s}>{s}</option>)}</select></Field>
          <Field label="Cliente"><input style={inputStyle} placeholder="Buscar..." value={name} onChange={e=>setName(e.target.value)}/></Field>
        </div>
      </Card>
      <Card style={{overflow:"hidden"}}>
        {filtered.length===0?<EmptyState icon={Globe} title="No hay pedidos"/>:(
          <table className="w-full text-sm">
            <thead><tr style={{background:C.cream}}>{["Cliente","Fecha","Estado","Total",""].map(h=><th key={h} className="text-left px-4 py-3 font-semibold text-xs" style={{color:C.textMuted}}>{h}</th>)}</tr></thead>
            <tbody>{filtered.map(o=>(
              <tr key={o.id} style={{borderTop:`1px solid ${C.border}`}}>
                <td className="px-4 py-3 font-medium">{o.client}</td>
                <td className="px-4 py-3" style={{color:C.textMuted}}>{formatDate(o.date)}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded-md text-xs font-semibold" style={{background:STATUS_STYLE[o.status].bg,color:STATUS_STYLE[o.status].fg}}>{o.status}</span></td>
                <td className="px-4 py-3 font-bold" style={{fontFamily:FONT_MONO}}>{formatCLP(o.total)}</td>
                <td className="px-4 py-3 text-right"><Btn size="sm" variant="outline" onClick={()=>setSel(o)}>Ver</Btn></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Card>
      {sel&&<Modal title={"Pedido de "+sel.client} onClose={()=>setSel(null)} width={400}><p className="text-xs mb-3" style={{color:C.textMuted}}>{sel.phone} · {formatDate(sel.date)}</p><div className="flex flex-col gap-2 mb-3">{sel.items.map((it,i)=><div key={i} className="flex justify-between text-sm px-3 py-2 rounded-lg" style={{background:C.cream}}><span>{it.qty}x {it.name}</span></div>)}</div><div className="flex justify-between font-bold text-sm pt-3" style={{borderTop:`1px solid ${C.border}`}}><span>Total</span><span>{formatCLP(sel.total)}</span></div></Modal>}
    </div>
  );
}

/* ============================== CONTACTO ============================== */
function ContactanosView() {
  return (
    <div>
      <PageHeader title="Contáctanos" subtitle="Estamos para ayudarte con cualquier duda"/>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <Card style={{padding:22}}><div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:C.successLight}}><MessageCircle size={18} color={C.success}/></div><div className="font-semibold text-sm mb-1">WhatsApp</div><p className="text-xs mb-3" style={{color:C.textMuted}}>Respuesta en minutos, lunes a sábado.</p><Btn variant="teal" icon={MessageCircle}>Abrir chat</Btn></Card>
        <Card style={{padding:22}}><div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:C.navyLight}}><Phone size={18} color={C.navy}/></div><div className="font-semibold text-sm mb-1">Llámanos</div><p className="text-xs mb-3" style={{color:C.textMuted}}>Lunes a viernes, 9:00 a 18:00 hrs.</p><div className="text-sm font-semibold" style={{fontFamily:FONT_MONO,color:C.text}}>+56 2 2345 6789</div></Card>
      </div>
    </div>
  );
}

/* ============================== ONBOARDING WIZARD ============================== */
/* ============================== CONTABILIDAD ============================== */
const GASTO_CATS = ["Arriendo","Luz","Agua","Gas","Internet / Teléfono","Sueldos","Mercadería","Transporte","Marketing","Otros"];
const PIE_COLORS = ["#F97316","#FB923C","#FCD34D","#34D399","#60A5FA","#A78BFA","#F472B6","#4ADE80","#38BDF8","#C084FC"];

function ContabilidadView({ sales, products, gastos, setGastos, proveedores, setProveedores, fiados, showToast }) {
  const [tab, setTab] = useState("panel");
  const [showGastoForm, setShowGastoForm] = useState(false);
  const [showProvForm, setShowProvForm] = useState(false);
  const [gasto, setGasto] = useState({ fecha: todayISO(), categoria: GASTO_CATS[0], descripcion: "", monto: "", proveedor: "" });
  const [prov, setProv] = useState({ nombre: "", rut: "", telefono: "", email: "", condiciones: "30 días" });
  const [iaMessages, setIaMessages] = useState([{ role: "assistant", content: "¡Hola! Soy tu compañera financiera 🤝 Estoy aquí para ayudarte a entender tus números y tomar mejores decisiones para tu negocio. ¿En qué te puedo ayudar hoy?" }]);
  const [iaInput, setIaInput] = useState("");
  const [iaLoading, setIaLoading] = useState(false);
  const iaEndRef = useRef(null);

  // Cálculos base
  const totalVentas = sales.reduce((s, x) => s + x.total, 0);
  const totalGastos = gastos.reduce((s, g) => s + g.monto, 0);
  const costoMercaderia = gastos.filter(g => g.categoria === "Mercadería").reduce((s, g) => s + g.monto, 0);
  const otrosGastos = totalGastos - costoMercaderia;
  const utilidadBruta = totalVentas - costoMercaderia;
  const utilidadNeta = totalVentas - totalGastos;
  const margenNeto = totalVentas > 0 ? (utilidadNeta / totalVentas * 100).toFixed(1) : 0;
  const margenBruto = totalVentas > 0 ? (utilidadBruta / totalVentas * 100).toFixed(1) : 0;

  // Gráfico ventas vs gastos por mes
  const chartData = useMemo(() => {
    const meses = {};
    sales.forEach(s => {
      const m = s.datetime.slice(0, 7);
      if (!meses[m]) meses[m] = { mes: m.slice(5), ventas: 0, gastos: 0 };
      meses[m].ventas += s.total;
    });
    gastos.forEach(g => {
      const m = g.fecha.slice(0, 7);
      if (!meses[m]) meses[m] = { mes: m.slice(5), ventas: 0, gastos: 0 };
      meses[m].gastos += g.monto;
    });
    return Object.values(meses).sort((a, b) => a.mes.localeCompare(b.mes));
  }, [sales, gastos]);

  // Gráfico torta gastos por categoría
  const pieData = useMemo(() => {
    const cats = {};
    gastos.forEach(g => { cats[g.categoria] = (cats[g.categoria] || 0) + g.monto; });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [gastos]);

  // Proyección próximo mes (promedio últimos 3 meses)
  const proyeccion = useMemo(() => {
    const now = new Date();
    const meses3 = [0, 1, 2].map(i => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return d.toISOString().slice(0, 7);
    });
    const ventasProm = meses3.reduce((s, m) => s + sales.filter(x => x.datetime.startsWith(m)).reduce((a, x) => a + x.total, 0), 0) / 3;
    const gastosProm = meses3.reduce((s, m) => s + gastos.filter(g => g.fecha.startsWith(m)).reduce((a, g) => a + g.monto, 0), 0) / 3;
    return { ventas: ventasProm, gastos: gastosProm, utilidad: ventasProm - gastosProm };
  }, [sales, gastos]);

  // Ratios
  const puntoEquilibrio = otrosGastos > 0 && margenBruto > 0 ? (otrosGastos / (Number(margenBruto) / 100)).toFixed(0) : 0;

  function exportarExcel() {
    const XLSX = window.XLSX;
    if (!XLSX) { showToast("Cargando exportador...", "error"); return; }

    const wb = XLSX.utils.book_new();
    const naranja = "FF6B00";
    const oscuro  = "1C0A00";
    const blanco  = "FFFFFF";
    const grisClaro = "F8F9FA";
    const borde = { top:{style:"thin",color:{rgb:"E5E7EB"}}, bottom:{style:"thin",color:{rgb:"E5E7EB"}}, left:{style:"thin",color:{rgb:"E5E7EB"}}, right:{style:"thin",color:{rgb:"E5E7EB"}} };

    function hdrStyle(bg=naranja) { return { font:{bold:true,color:{rgb:blanco},sz:11}, fill:{fgColor:{rgb:bg}}, alignment:{horizontal:"center",vertical:"center"}, border:borde }; }
    function cellStyle(bold=false,color=oscuro,bg=blanco) { return { font:{bold,color:{rgb:color.replace("#","")},sz:10}, fill:{fgColor:{rgb:bg.replace("#","")}}, border:borde, alignment:{vertical:"center"} }; }
    function moneyStyle(bold=false,color="000000") { return { font:{bold,color:{rgb:color},sz:10}, fill:{fgColor:{rgb:blanco}}, numFmt:"$#,##0", border:borde }; }
    function titleStyle() { return { font:{bold:true,color:{rgb:naranja},sz:14}, alignment:{horizontal:"left"} }; }

    // ===================== HOJA 1: RESUMEN =====================
    const resumen = [
      ["", "", "", "", ""],
      ["  MiMarket — Reporte Financiero", "", "", "", formatDate(todayISO())],
      ["", "", "", "", ""],
      ["ESTADO DE RESULTADOS", "", "", "", ""],
      ["Concepto", "", "", "Monto", ""],
      ["Ingresos por ventas", "", "", totalVentas, ""],
      ["Costo mercadería", "", "", -costoMercaderia, ""],
      ["UTILIDAD BRUTA", "", "", utilidadBruta, ""],
      ["Otros gastos operacionales", "", "", -otrosGastos, ""],
      ["UTILIDAD NETA", "", "", utilidadNeta, ""],
      ["", "", "", "", ""],
      ["RATIOS CLAVE", "", "", "", ""],
      ["Indicador", "", "", "Valor", ""],
      ["Margen bruto", "", "", margenBruto + "%", ""],
      ["Margen neto", "", "", margenNeto + "%", ""],
      ["Punto de equilibrio", "", "", Number(puntoEquilibrio), ""],
      ["Ticket promedio", "", "", sales.length ? totalVentas / sales.length : 0, ""],
      ["Total boletas emitidas", "", "", sales.length, ""],
      ["", "", "", "", ""],
      ["PROYECCIÓN PRÓXIMO MES", "", "", "", ""],
      ["Ventas estimadas", "", "", proyeccion.ventas, ""],
      ["Gastos estimados", "", "", proyeccion.gastos, ""],
      ["Utilidad estimada", "", "", proyeccion.utilidad, ""],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(resumen);
    ws1["!cols"] = [{ wch: 30 }, { wch: 10 }, { wch: 10 }, { wch: 18 }, { wch: 15 }];
    ws1["!merges"] = [
      { s:{r:1,c:0}, e:{r:1,c:3} },
      { s:{r:3,c:0}, e:{r:3,c:4} },
      { s:{r:11,c:0}, e:{r:11,c:4} },
      { s:{r:19,c:0}, e:{r:19,c:4} },
    ];
    if (ws1["B2"]) ws1["B2"].s = titleStyle();
    if (ws1["A2"]) ws1["A2"].s = titleStyle();
    ["A4","A12","A20"].forEach(c => { if(ws1[c]) ws1[c].s = hdrStyle(); });
    ["A5","D5","A13","D13","A21"].forEach(c => { if(ws1[c]) ws1[c].s = hdrStyle("333333"); });
    ["A8","D8"].forEach(c => { if(ws1[c]) ws1[c].s = cellStyle(true,"000000",grisClaro); });
    ["A10","D10"].forEach(c => { if(ws1[c]) ws1[c].s = cellStyle(true, utilidadNeta>=0?"1D7D4E":"D32B2B", utilidadNeta>=0?"ECFDF5":"FFF1F2"); });
    XLSX.utils.book_append_sheet(wb, ws1, "📊 Resumen");

    // ===================== HOJA 2: VENTAS =====================
    const ventasData = [
      ["Voucher", "Boleta SII", "Fecha", "Vendedor", "Medio de Pago", "N° Items", "Total"],
      ...sales.map(s => [s.voucher, s.boletaSII, formatDateTime(s.datetime), s.vendor, PAYMENT_LABEL[s.paymentType] || s.paymentType, s.items.length, s.total]),
      ["", "", "", "", "", "TOTAL", sales.reduce((a,s)=>a+s.total,0)],
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(ventasData);
    ws2["!cols"] = [{ wch:12 },{ wch:12 },{ wch:18 },{ wch:15 },{ wch:15 },{ wch:10 },{ wch:14 }];
    ["A1","B1","C1","D1","E1","F1","G1"].forEach(c => { if(ws2[c]) ws2[c].s = hdrStyle(); });
    XLSX.utils.book_append_sheet(wb, ws2, "💰 Ventas");

    // ===================== HOJA 3: GASTOS =====================
    const gastosData = [
      ["Fecha", "Categoría", "Descripción", "Proveedor", "Monto"],
      ...gastos.map(g => [formatDate(g.fecha), g.categoria, g.descripcion, g.proveedor || "—", g.monto]),
      ["", "", "", "TOTAL", gastos.reduce((a,g)=>a+g.monto,0)],
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(gastosData);
    ws3["!cols"] = [{ wch:12 },{ wch:20 },{ wch:30 },{ wch:20 },{ wch:14 }];
    ["A1","B1","C1","D1","E1"].forEach(c => { if(ws3[c]) ws3[c].s = hdrStyle(); });
    XLSX.utils.book_append_sheet(wb, ws3, "💸 Gastos");

    // ===================== HOJA 4: INVENTARIO =====================
    const inventData = [
      ["Producto", "Categoría", "Formato", "Precio Compra", "Precio Venta", "Stock", "Valor en Bodega"],
      ...products.map(p => [p.name, p.category, p.format, p.purchasePrice, p.salePrice, p.stock, p.purchasePrice * p.stock]),
      ["", "", "", "", "", "TOTAL BODEGA", products.reduce((a,p)=>a+p.purchasePrice*p.stock,0)],
    ];
    const ws4 = XLSX.utils.aoa_to_sheet(inventData);
    ws4["!cols"] = [{ wch:28 },{ wch:18 },{ wch:12 },{ wch:14 },{ wch:14 },{ wch:8 },{ wch:16 }];
    ["A1","B1","C1","D1","E1","F1","G1"].forEach(c => { if(ws4[c]) ws4[c].s = hdrStyle(); });
    XLSX.utils.book_append_sheet(wb, ws4, "📦 Inventario");

    // ===================== HOJA 5: FIADOS =====================
    const fiadosData = [
      ["Cliente", "RUT", "Teléfono", "Saldo Pendiente"],
      ...(fiados.length ? fiados.map(f => [f.name, f.rut, f.phone, f.balance]) : [["Sin fiados registrados","","",0]]),
      ["", "", "TOTAL PENDIENTE", fiados.reduce((a,f)=>a+f.balance,0)],
    ];
    const ws5 = XLSX.utils.aoa_to_sheet(fiadosData);
    ws5["!cols"] = [{ wch:22 },{ wch:14 },{ wch:16 },{ wch:16 }];
    ["A1","B1","C1","D1"].forEach(c => { if(ws5[c]) ws5[c].s = hdrStyle(); });
    XLSX.utils.book_append_sheet(wb, ws5, "🤝 Fiados");

    // ===================== HOJA 6: PROVEEDORES =====================
    const provData = [
      ["Nombre", "RUT", "Teléfono", "Email", "Condiciones de Pago"],
      ...proveedores.map(p => [p.nombre, p.rut, p.telefono, p.email, p.condiciones]),
    ];
    const ws6 = XLSX.utils.aoa_to_sheet(provData);
    ws6["!cols"] = [{ wch:25 },{ wch:14 },{ wch:16 },{ wch:25 },{ wch:18 }];
    ["A1","B1","C1","D1","E1"].forEach(c => { if(ws6[c]) ws6[c].s = hdrStyle(); });
    XLSX.utils.book_append_sheet(wb, ws6, "🚚 Proveedores");

    XLSX.writeFile(wb, `MiMarket_Contabilidad_${todayISO()}.xlsx`);
    showToast("Excel descargado correctamente");
  }

  useEffect(() => {
    if (!window.XLSX) {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      document.head.appendChild(s);
    }
  }, []);

  async function sendIA() {
    if (!iaInput.trim() || iaLoading) return;
    const userMsg = iaInput.trim();
    setIaInput("");
    setIaMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIaLoading(true);
    try {
      const context = `Datos del negocio:
- Ventas totales: ${formatCLP(totalVentas)}
- Gastos totales: ${formatCLP(totalGastos)}
- Utilidad neta: ${formatCLP(utilidadNeta)}
- Margen neto: ${margenNeto}%
- Margen bruto: ${margenBruto}%
- Productos en inventario: ${products.length}
- Productos sin stock: ${products.filter(p => p.stock === 0).length}
- Proyección próximo mes: ventas ${formatCLP(proyeccion.ventas)}, utilidad ${formatCLP(proyeccion.utilidad)}
- Punto de equilibrio: ${formatCLP(Number(puntoEquilibrio))}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `Eres una asesora financiera amigable y cercana para dueñas de minimarkets en Chile. Tu nombre es "Mia". Hablas en español chileno, de forma cálida y simple. Siempre quieres lo mejor para el negocio. Das consejos prácticos y concretos basados en los datos reales del negocio. Usas emojis ocasionalmente. Cuando los números son buenos los celebras, cuando hay problemas los señalas con cariño y soluciones. Formato de moneda chilena ($ con puntos). Aquí están los datos actuales:\n\n${context}`,
          messages: [...iaMessages.slice(-6).filter(m => m.role !== "assistant" || iaMessages.indexOf(m) > 0), { role: "user", content: userMsg }]
        })
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Lo siento, no pude procesar tu consulta en este momento.";
      setIaMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setIaMessages(prev => [...prev, { role: "assistant", content: "Tuve un problema conectándome. Intenta de nuevo en un momento 🙏" }]);
    }
    setIaLoading(false);
  }

  const TABS = [
    { id: "panel", label: "Panel", icon: LayoutDashboard },
    { id: "gastos", label: "Gastos", icon: TrendingDown },
    { id: "proveedores", label: "Proveedores", icon: Truck },
    { id: "balance", label: "Balance General", icon: BookOpen },
    { id: "resultado", label: "Estado de Resultados", icon: DollarSign },
    { id: "ratios", label: "Ratios", icon: Target },
    { id: "proyecciones", label: "Proyecciones", icon: TrendingUp },
    { id: "ia", label: "IA Compañera", icon: Brain },
  ];

  return (
    <div>
      <PageHeader title="Contabilidad" subtitle="Finanzas completas de tu negocio"
        right={<Btn icon={Download} variant="outline" onClick={exportarExcel}>Exportar Excel</Btn>}
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition"
            style={{ background: tab === t.id ? C.ink : C.surface, color: tab === t.id ? "#fff" : C.textMuted, border: `1px solid ${C.border}` }}>
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {/* PANEL */}
      {tab === "panel" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Ventas totales", value: formatCLP(totalVentas), color: C.success, bg: C.successLight, icon: TrendingUp },
              { label: "Gastos totales", value: formatCLP(totalGastos), color: C.danger, bg: C.dangerLight, icon: TrendingDown },
              { label: "Utilidad neta", value: formatCLP(utilidadNeta), color: utilidadNeta >= 0 ? C.success : C.danger, bg: utilidadNeta >= 0 ? C.successLight : C.dangerLight, icon: DollarSign },
              { label: "Margen neto", value: margenNeto + "%", color: C.orange, bg: C.orangeLight, icon: Target },
            ].map(s => (
              <Card key={s.label} style={{ padding: 18 }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: s.bg }}><s.icon size={17} color={s.color} /></div>
                <div className="text-xl font-bold" style={{ fontFamily: FONT_MONO, color: s.color }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: C.textMuted }}>{s.label}</div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card style={{ padding: 20 }}>
              <h3 className="text-sm font-bold mb-4" style={{ fontFamily: FONT_DISPLAY, color: C.text }}>Ventas vs Gastos por mes</h3>
              {chartData.length === 0 ? <EmptyState icon={BarChart3} title="Sin datos aún" /> : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: C.textMuted }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: C.textMuted }} axisLine={false} tickLine={false} tickFormatter={v => "$" + v / 1000 + "k"} />
                    <Tooltip formatter={v => formatCLP(v)} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                    <Legend />
                    <Bar dataKey="ventas" fill={C.success} radius={[4, 4, 0, 0]} name="Ventas" />
                    <Bar dataKey="gastos" fill={C.danger} radius={[4, 4, 0, 0]} name="Gastos" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>

            <Card style={{ padding: 20 }}>
              <h3 className="text-sm font-bold mb-4" style={{ fontFamily: FONT_DISPLAY, color: C.text }}>Distribución de gastos</h3>
              {pieData.length === 0 ? <EmptyState icon={PieChartIcon} title="Sin gastos registrados" subtitle="Agrega gastos para ver la distribución" /> : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={v => formatCLP(v)} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* GASTOS */}
      {tab === "gastos" && (
        <div>
          <div className="flex justify-between items-center mb-5">
            <div className="text-sm font-semibold" style={{ color: C.text }}>{gastos.length} gastos registrados · Total {formatCLP(totalGastos)}</div>
            <Btn icon={Plus} onClick={() => setShowGastoForm(true)}>Registrar gasto</Btn>
          </div>
          <Card style={{ overflow: "hidden" }}>
            {gastos.length === 0 ? <EmptyState icon={TrendingDown} title="Sin gastos registrados" subtitle="Agrega tus gastos para ver tus finanzas reales" /> : (
              <table className="w-full text-sm">
                <thead><tr style={{ background: C.cream }}>{["Fecha", "Categoría", "Descripción", "Proveedor", "Monto", ""].map(h => <th key={h} className="text-left px-4 py-3 font-semibold text-xs" style={{ color: C.textMuted }}>{h}</th>)}</tr></thead>
                <tbody>
                  {gastos.map(g => (
                    <tr key={g.id} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{formatDate(g.fecha)}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 rounded-md text-xs font-medium" style={{ background: C.orangeLight, color: C.orangeDark }}>{g.categoria}</span></td>
                      <td className="px-4 py-3" style={{ color: C.text }}>{g.descripcion}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{g.proveedor || "—"}</td>
                      <td className="px-4 py-3 font-bold" style={{ fontFamily: FONT_MONO, color: C.danger }}>{formatCLP(g.monto)}</td>
                      <td className="px-4 py-3"><button onClick={() => setGastos(gastos.filter(x => x.id !== g.id))}><Trash2 size={14} color={C.danger} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>

          {showGastoForm && (
            <Modal title="Registrar gasto" onClose={() => setShowGastoForm(false)}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Fecha"><input type="date" style={inputStyle} value={gasto.fecha} onChange={e => setGasto({ ...gasto, fecha: e.target.value })} /></Field>
                <Field label="Categoría"><select style={inputStyle} value={gasto.categoria} onChange={e => setGasto({ ...gasto, categoria: e.target.value })}>{GASTO_CATS.map(c => <option key={c}>{c}</option>)}</select></Field>
                <div className="col-span-2"><Field label="Descripción"><input style={inputStyle} value={gasto.descripcion} onChange={e => setGasto({ ...gasto, descripcion: e.target.value })} placeholder="Ej: Factura arriendo enero" /></Field></div>
                <Field label="Monto ($)"><input type="number" style={inputStyle} value={gasto.monto} onChange={e => setGasto({ ...gasto, monto: e.target.value })} placeholder="0" /></Field>
                <Field label="Proveedor (opcional)"><input style={inputStyle} value={gasto.proveedor} onChange={e => setGasto({ ...gasto, proveedor: e.target.value })} placeholder="Nombre del proveedor" /></Field>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Btn variant="ghost" onClick={() => setShowGastoForm(false)}>Cancelar</Btn>
                <Btn icon={Check} onClick={() => {
                  if (!gasto.descripcion.trim() || !gasto.monto) return;
                  setGastos([{ id: uid("g"), ...gasto, monto: Number(gasto.monto) }, ...gastos]);
                  setGasto({ fecha: todayISO(), categoria: GASTO_CATS[0], descripcion: "", monto: "", proveedor: "" });
                  setShowGastoForm(false);
                  showToast("Gasto registrado");
                }}>Guardar gasto</Btn>
              </div>
            </Modal>
          )}
        </div>
      )}

      {/* PROVEEDORES */}
      {tab === "proveedores" && (
        <div>
          <div className="flex justify-between items-center mb-5">
            <div className="text-sm font-semibold" style={{ color: C.text }}>{proveedores.length} proveedores registrados</div>
            <Btn icon={Plus} onClick={() => setShowProvForm(true)}>Agregar proveedor</Btn>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {proveedores.length === 0 ? (
              <div className="col-span-3"><EmptyState icon={Truck} title="Sin proveedores" subtitle="Agrega tus proveedores para gestionarlos" /></div>
            ) : proveedores.map(p => (
              <Card key={p.id} style={{ padding: 18 }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: C.navyLight }}><Truck size={18} color={C.navy} /></div>
                  <button onClick={() => setProveedores(proveedores.filter(x => x.id !== p.id))}><Trash2 size={14} color={C.danger} /></button>
                </div>
                <div className="font-bold text-sm mb-1" style={{ color: C.text }}>{p.nombre}</div>
                <div className="text-xs" style={{ color: C.textMuted, fontFamily: FONT_MONO }}>{p.rut}</div>
                <div className="text-xs mt-1" style={{ color: C.textMuted }}>{p.telefono}</div>
                <div className="text-xs mt-1" style={{ color: C.textMuted }}>{p.email}</div>
                <div className="mt-2 text-xs px-2 py-1 rounded-md inline-block" style={{ background: C.amberLight, color: C.amber }}>Pago: {p.condiciones}</div>
              </Card>
            ))}
          </div>

          {showProvForm && (
            <Modal title="Agregar proveedor" onClose={() => setShowProvForm(false)}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><Field label="Nombre del proveedor"><input style={inputStyle} value={prov.nombre} onChange={e => setProv({ ...prov, nombre: e.target.value })} placeholder="Ej: Distribuidora Coke" /></Field></div>
                <Field label="RUT"><input style={inputStyle} value={prov.rut} onChange={e => setProv({ ...prov, rut: e.target.value })} placeholder="76.123.456-7" /></Field>
                <Field label="Teléfono"><input style={inputStyle} value={prov.telefono} onChange={e => setProv({ ...prov, telefono: e.target.value })} placeholder="+56 9 ..." /></Field>
                <Field label="Email"><input style={inputStyle} value={prov.email} onChange={e => setProv({ ...prov, email: e.target.value })} placeholder="proveedor@mail.cl" /></Field>
                <Field label="Condiciones de pago"><select style={inputStyle} value={prov.condiciones} onChange={e => setProv({ ...prov, condiciones: e.target.value })}><option>Contado</option><option>7 días</option><option>15 días</option><option>30 días</option><option>60 días</option></select></Field>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Btn variant="ghost" onClick={() => setShowProvForm(false)}>Cancelar</Btn>
                <Btn icon={Check} onClick={() => {
                  if (!prov.nombre.trim()) return;
                  setProveedores([{ id: uid("pv"), ...prov }, ...proveedores]);
                  setProv({ nombre: "", rut: "", telefono: "", email: "", condiciones: "30 días" });
                  setShowProvForm(false);
                  showToast("Proveedor agregado");
                }}>Guardar</Btn>
              </div>
            </Modal>
          )}
        </div>
      )}

      {/* BALANCE GENERAL */}
      {tab === "balance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card style={{ padding: 24 }}>
            <h3 className="font-bold mb-4 text-base" style={{ fontFamily: FONT_DISPLAY, color: C.text }}>Activos</h3>
            {[
              { label: "Efectivo en caja", value: formatCLP(sales.filter(s => s.paymentType === "efectivo").reduce((a, s) => a + s.total, 0)) },
              { label: "Cuentas por cobrar (Fiados)", value: formatCLP(0) },
              { label: "Valor inventario", value: formatCLP(products.reduce((s, p) => s + p.purchasePrice * p.stock, 0)) },
              { label: "Ingresos por transferencia / tarjeta", value: formatCLP(sales.filter(s => ["debito","credito","transferencia"].includes(s.paymentType)).reduce((a, s) => a + s.total, 0)) },
            ].map((row, i) => (
              <div key={i} className="flex justify-between py-3 text-sm" style={{ borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.textMuted }}>{row.label}</span>
                <span className="font-semibold" style={{ fontFamily: FONT_MONO, color: C.text }}>{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between py-3 font-bold text-sm mt-1">
              <span style={{ color: C.text }}>TOTAL ACTIVOS</span>
              <span style={{ fontFamily: FONT_MONO, color: C.success }}>{formatCLP(totalVentas + products.reduce((s, p) => s + p.purchasePrice * p.stock, 0))}</span>
            </div>
          </Card>

          <Card style={{ padding: 24 }}>
            <h3 className="font-bold mb-4 text-base" style={{ fontFamily: FONT_DISPLAY, color: C.text }}>Pasivos y Patrimonio</h3>
            {[
              { label: "Cuentas por pagar (proveedores)", value: formatCLP(0) },
              { label: "Gastos pendientes", value: formatCLP(0) },
              { label: "Capital invertido", value: formatCLP(totalGastos) },
              { label: "Utilidad acumulada", value: formatCLP(utilidadNeta) },
            ].map((row, i) => (
              <div key={i} className="flex justify-between py-3 text-sm" style={{ borderBottom: `1px solid ${C.border}` }}>
                <span style={{ color: C.textMuted }}>{row.label}</span>
                <span className="font-semibold" style={{ fontFamily: FONT_MONO, color: C.text }}>{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between py-3 font-bold text-sm mt-1">
              <span style={{ color: C.text }}>TOTAL PASIVOS + PATRIMONIO</span>
              <span style={{ fontFamily: FONT_MONO, color: C.navy }}>{formatCLP(totalGastos + utilidadNeta)}</span>
            </div>
          </Card>
        </div>
      )}

      {/* ESTADO DE RESULTADOS */}
      {tab === "resultado" && (
        <Card style={{ padding: 24, maxWidth: 560 }}>
          <h3 className="font-bold mb-5 text-base" style={{ fontFamily: FONT_DISPLAY, color: C.text }}>Estado de Resultados</h3>
          {[
            { label: "Ingresos por ventas", value: totalVentas, color: C.success, bold: false },
            { label: "Costo de mercadería vendida", value: -costoMercaderia, color: C.danger, bold: false },
            { label: "UTILIDAD BRUTA", value: utilidadBruta, color: utilidadBruta >= 0 ? C.success : C.danger, bold: true, border: true },
            { label: "Gastos operacionales", value: -otrosGastos, color: C.danger, bold: false },
            { label: "UTILIDAD OPERACIONAL / NETA", value: utilidadNeta, color: utilidadNeta >= 0 ? C.success : C.danger, bold: true, border: true },
            { label: `Margen bruto (${margenBruto}%)`, value: null, color: C.textMuted, bold: false },
            { label: `Margen neto (${margenNeto}%)`, value: null, color: C.textMuted, bold: false },
          ].map((row, i) => (
            <div key={i} className={`flex justify-between py-3 text-sm ${row.border ? "mt-1" : ""}`}
              style={{ borderTop: row.border ? `2px solid ${C.border}` : `1px solid ${C.border}`, fontWeight: row.bold ? 700 : 400 }}>
              <span style={{ color: row.bold ? C.text : C.textMuted }}>{row.label}</span>
              {row.value !== null && <span style={{ fontFamily: FONT_MONO, color: row.color }}>{row.value >= 0 ? formatCLP(row.value) : "-" + formatCLP(-row.value)}</span>}
            </div>
          ))}
        </Card>
      )}

      {/* RATIOS */}
      {tab === "ratios" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Margen Bruto", value: margenBruto + "%", desc: "Porcentaje de ganancia antes de gastos operacionales", good: Number(margenBruto) > 25 },
            { label: "Margen Neto", value: margenNeto + "%", desc: "Porcentaje de ganancia final después de todos los gastos", good: Number(margenNeto) > 10 },
            { label: "Punto de Equilibrio", value: formatCLP(Number(puntoEquilibrio)), desc: "Cuánto necesitas vender para no perder ni ganar", good: totalVentas >= Number(puntoEquilibrio) },
            { label: "Ticket Promedio", value: formatCLP(sales.length ? totalVentas / sales.length : 0), desc: "Valor promedio por boleta", good: true },
            { label: "Productos sin stock", value: products.filter(p => p.stock === 0).length, desc: "Productos que no puedes vender ahora", good: products.filter(p => p.stock === 0).length === 0 },
            { label: "Rentabilidad ventas", value: totalGastos > 0 ? (utilidadNeta / totalGastos * 100).toFixed(1) + "%" : "—", desc: "Por cada peso gastado, cuánto ganas", good: utilidadNeta > 0 },
          ].map(r => (
            <Card key={r.label} style={{ padding: 20 }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold" style={{ color: C.textMuted }}>{r.label}</span>
                <span className="w-2 h-2 rounded-full" style={{ background: r.good ? C.success : C.danger }} />
              </div>
              <div className="text-2xl font-bold mb-2" style={{ fontFamily: FONT_MONO, color: r.good ? C.success : C.danger }}>{r.value}</div>
              <p className="text-xs" style={{ color: C.textMuted }}>{r.desc}</p>
            </Card>
          ))}
        </div>
      )}

      {/* PROYECCIONES */}
      {tab === "proyecciones" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Ventas proyectadas", value: formatCLP(proyeccion.ventas), icon: TrendingUp, color: C.success, bg: C.successLight },
              { label: "Gastos proyectados", value: formatCLP(proyeccion.gastos), icon: TrendingDown, color: C.danger, bg: C.dangerLight },
              { label: "Utilidad proyectada", value: formatCLP(proyeccion.utilidad), icon: Target, color: proyeccion.utilidad >= 0 ? C.success : C.danger, bg: proyeccion.utilidad >= 0 ? C.successLight : C.dangerLight },
            ].map(s => (
              <Card key={s.label} style={{ padding: 20 }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: s.bg }}><s.icon size={17} color={s.color} /></div>
                <div className="text-xl font-bold" style={{ fontFamily: FONT_MONO, color: s.color }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: C.textMuted }}>{s.label} (próximo mes)</div>
              </Card>
            ))}
          </div>

          <Card style={{ padding: 20 }}>
            <h3 className="text-sm font-bold mb-4" style={{ fontFamily: FONT_DISPLAY, color: C.text }}>Tendencia de utilidad</h3>
            {chartData.length === 0 ? <EmptyState icon={TrendingUp} title="Sin datos suficientes" subtitle="Registra ventas y gastos para ver proyecciones" /> : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={[...chartData, { mes: "Próx.", ventas: proyeccion.ventas, gastos: proyeccion.gastos }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: C.textMuted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: C.textMuted }} axisLine={false} tickLine={false} tickFormatter={v => "$" + v / 1000 + "k"} />
                  <Tooltip formatter={v => formatCLP(v)} contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                  <Legend />
                  <Line type="monotone" dataKey="ventas" stroke={C.success} strokeWidth={2} dot={{ r: 4 }} name="Ventas" />
                  <Line type="monotone" dataKey="gastos" stroke={C.danger} strokeWidth={2} dot={{ r: 4 }} name="Gastos" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>

          {proyeccion.utilidad < 0 && (
            <div className="flex gap-3 p-4 rounded-xl" style={{ background: C.dangerLight, border: `1px solid ${C.danger}30` }}>
              <AlertTriangle size={18} color={C.danger} className="shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold" style={{ color: C.danger }}>Alerta: proyección de pérdida</p>
                <p className="text-xs mt-1" style={{ color: "#9B1C1C" }}>Basado en el promedio de los últimos meses, el próximo mes podrías cerrar en negativo. Consulta a tu IA Compañera para obtener consejos.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* IA COMPAÑERA */}
      {tab === "ia" && (
        <div className="flex flex-col" style={{ height: "60vh" }}>
          <Card style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div className="flex items-center gap-3 px-5 py-4 shrink-0" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: PREMIUM_GRADIENT }}>
                <Brain size={18} color="#fff" />
              </div>
              <div>
                <div className="font-bold text-sm" style={{ fontFamily: FONT_DISPLAY, color: C.text }}>Mia — Tu compañera financiera</div>
                <div className="text-xs flex items-center gap-1" style={{ color: C.success }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: C.success }} /> En línea · Lista para ayudarte
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
              {iaMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm"
                    style={{
                      background: m.role === "user" ? C.ink : C.cream,
                      color: m.role === "user" ? "#fff" : C.text,
                      borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px"
                    }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {iaLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl text-sm" style={{ background: C.cream, color: C.textMuted, borderRadius: "18px 18px 18px 4px" }}>
                    Mia está pensando...
                  </div>
                </div>
              )}
              <div ref={iaEndRef} />
            </div>

            <div className="px-4 py-3 shrink-0 flex gap-2" style={{ borderTop: `1px solid ${C.border}` }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="Pregúntale a Mia sobre tus finanzas..."
                value={iaInput}
                onChange={e => setIaInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendIA()}
              />
              <Btn icon={Send} onClick={sendIA} disabled={!iaInput.trim() || iaLoading}>Enviar</Btn>
            </div>
          </Card>

          <div className="flex gap-2 mt-3 flex-wrap">
            {["¿Cómo van mis finanzas?", "¿Qué productos debo priorizar?", "¿Estoy ganando dinero?", "Dame consejos para crecer"].map(q => (
              <button key={q} onClick={() => { setIaInput(q); }} className="text-xs px-3 py-1.5 rounded-full" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textMuted }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


function OnboardingWizard({ onComplete, profile, setProfile, setProducts }) {
  const [step, setStep] = useState(1);
  const [biz, setBiz] = useState({ name: profile.name, rut: profile.rut, address: profile.address, comuna: profile.comuna, region: profile.region, type: profile.type });
  const [prod, setProd] = useState({ name: "", format: "Unidad", category: CATEGORIES[0], salePrice: "", purchasePrice: "", stock: "" });

  const STEPS = [
    { n: 1, label: "Tu negocio" },
    { n: 2, label: "Primer producto" },
    { n: 3, label: "¡Listo!" },
  ];

  function handleFinish() {
    setProfile({ ...profile, ...biz });
    if (prod.name.trim()) {
      setProducts([{ id: uid("p"), ...prod, salePrice: Number(prod.salePrice) || 0, purchasePrice: Number(prod.purchasePrice) || 0, stock: Number(prod.stock) || 0, barcode: "" }]);
    }
    onComplete();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: C.cream }}>
      <div className="min-h-full flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full rounded-2xl overflow-hidden" style={{ maxWidth: 520, background: C.surface, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.orange}, #FBBF24)` }}>
              <Store size={18} color="#fff" />
            </div>
            <div>
              <div className="font-bold text-sm" style={{ fontFamily: FONT_DISPLAY, color: C.text }}>Configuración inicial</div>
              <div className="text-xs" style={{ color: C.textMuted }}>Solo tomará 2 minutos</div>
            </div>
          </div>
          {/* Progress */}
          <div className="flex gap-2">
            {STEPS.map(s => (
              <div key={s.n} className="flex-1">
                <div className="h-1.5 rounded-full mb-1" style={{ background: s.n <= step ? C.orange : C.border }} />
                <div className="text-[10px] font-medium" style={{ color: s.n <= step ? C.orangeDark : C.textMuted }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* STEP 1: Business info */}
          {step === 1 && (
            <div>
              <h2 className="font-bold mb-1" style={{ fontFamily: FONT_DISPLAY, color: C.text }}>Cuéntanos sobre tu negocio</h2>
              <p className="text-xs mb-5" style={{ color: C.textMuted }}>Esta información aparecerá en tus boletas y comprobantes</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Field label="Nombre del negocio">
                    <input style={inputStyle} value={biz.name} onChange={e => setBiz({ ...biz, name: e.target.value })} placeholder="Ej: Minimarket Don Pedro" />
                  </Field>
                </div>
                <Field label="RUT del negocio">
                  <input style={inputStyle} value={biz.rut} onChange={e => setBiz({ ...biz, rut: e.target.value })} placeholder="Ej: 76.543.210-1" />
                </Field>
                <Field label="Tipo de negocio">
                  <select style={inputStyle} value={biz.type} onChange={e => setBiz({ ...biz, type: e.target.value })}>
                    <option>Almacén de barrio</option><option>Minimarket</option><option>Botillería</option><option>Despensa</option>
                  </select>
                </Field>
                <div className="col-span-2">
                  <Field label="Dirección">
                    <input style={inputStyle} value={biz.address} onChange={e => setBiz({ ...biz, address: e.target.value })} placeholder="Ej: Av. Libertad 482, Local 2" />
                  </Field>
                </div>
                <Field label="Comuna">
                  <input style={inputStyle} value={biz.comuna} onChange={e => setBiz({ ...biz, comuna: e.target.value })} placeholder="Ej: Viña del Mar" />
                </Field>
                <Field label="Región">
                  <input style={inputStyle} value={biz.region} onChange={e => setBiz({ ...biz, region: e.target.value })} placeholder="Ej: Valparaíso" />
                </Field>
              </div>
              <div className="flex justify-between mt-6">
                <Btn variant="ghost" onClick={onComplete}>Saltar por ahora</Btn>
                <Btn disabled={!biz.name.trim()} onClick={() => setStep(2)}>
                  Siguiente <ChevronRight size={16} />
                </Btn>
              </div>
            </div>
          )}

          {/* STEP 2: First product */}
          {step === 2 && (
            <div>
              <h2 className="font-bold mb-1" style={{ fontFamily: FONT_DISPLAY, color: C.text }}>Agrega tu primer producto</h2>
              <p className="text-xs mb-5" style={{ color: C.textMuted }}>Puedes agregar más después desde el Inventario. Este paso es opcional.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Field label="Nombre del producto">
                    <input style={inputStyle} value={prod.name} onChange={e => setProd({ ...prod, name: e.target.value })} placeholder="Ej: Agua Mineral 1.5L" />
                  </Field>
                </div>
                <Field label="Precio de venta ($)">
                  <input type="number" style={inputStyle} value={prod.salePrice} onChange={e => setProd({ ...prod, salePrice: e.target.value })} placeholder="0" />
                </Field>
                <Field label="Stock inicial">
                  <input type="number" style={inputStyle} value={prod.stock} onChange={e => setProd({ ...prod, stock: e.target.value })} placeholder="0" />
                </Field>
                <Field label="Categoría">
                  <select style={inputStyle} value={prod.category} onChange={e => setProd({ ...prod, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Precio de compra ($)">
                  <input type="number" style={inputStyle} value={prod.purchasePrice} onChange={e => setProd({ ...prod, purchasePrice: e.target.value })} placeholder="0" />
                </Field>
              </div>
              <div className="flex justify-between mt-6">
                <Btn variant="ghost" onClick={() => setStep(1)}><ChevronLeft size={16} /> Atrás</Btn>
                <div className="flex gap-2">
                  <Btn variant="outline" onClick={() => setStep(3)}>Saltar este paso</Btn>
                  <Btn onClick={() => setStep(3)}>Siguiente <ChevronRight size={16} /></Btn>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Ready */}
          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `linear-gradient(135deg, ${C.orange}, #FBBF24)` }}>
                <CheckCircle2 size={32} color="#fff" />
              </div>
              <h2 className="font-bold text-xl mb-2" style={{ fontFamily: FONT_DISPLAY, color: C.text }}>¡Todo listo, {biz.name}!</h2>
              <p className="text-sm mb-8" style={{ color: C.textMuted }}>Tu sistema está configurado y listo para usar. Puedes completar más detalles en Configurar cuando quieras.</p>

              <div className="grid grid-cols-3 gap-3 mb-8 text-left">
                {[
                  { icon: Package, title: "Inventario", desc: "Agrega todos tus productos" },
                  { icon: ShoppingCart, title: "Venta", desc: "Registra tus primeras ventas" },
                  { icon: BarChart3, title: "Reportes", desc: "Ve tus ventas en tiempo real" },
                ].map(item => (
                  <div key={item.title} className="rounded-xl p-3" style={{ background: C.cream, border: `1px solid ${C.border}` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: "#FFF7ED" }}>
                      <item.icon size={16} color={C.orange} />
                    </div>
                    <div className="text-xs font-semibold" style={{ color: C.text }}>{item.title}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: C.textMuted }}>{item.desc}</div>
                  </div>
                ))}
              </div>

              <Btn full onClick={handleFinish}>
                <Store size={16} /> Entrar a mi sistema
              </Btn>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}


export default function App({ session, onLogout, isOwner, onOpenAdmin }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users,       setUsers]       = useState(SEED_USERS);
  const [view,        setView]        = useState("panel");
  const [products,    setProducts]    = useState([]);
  const [cart,        setCart]        = useState([]);
  const [sales,       setSales]       = useState([]);
  const [fiados,      setFiados]      = useState([]);
  const [gastos,      setGastos]      = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [counters,    setCounters]    = useState({ voucher: 1000, boleta: 8800 });
  const [cajaState,   setCajaState]   = useState({ isOpen: false, openedAt: new Date().toISOString(), openingAmount: 0 });
  const [profile,     setProfile]     = useState({ name: "Mi Minimarket", rut: "", address: "", comuna: "", region: "", size: "50 a 100 metros cuadrados", type: "Almacén de barrio" });
  const [toast,       setToast]       = useState(null);
  const [onboarding,  setOnboarding]  = useState(false);
  const isTablet = useIsTablet();

  function showToast(message, type="success") { setToast({ message, type }); }
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); }, [toast]);

  function handleLogin(user) {
    setCurrentUser(user);
    const fv = NAV_ITEMS.find(n => n.roles.includes(user.role));
    setView(fv?.id || "venta");
    if (user.role === "admin" && products.length === 0) setOnboarding(true);
  }
  function handleLogout() {
    if (onLogout) onLogout();
    else { setCurrentUser(null); setView("panel"); setCart([]); }
  }
  function addUser(u) { setUsers([...users, { id: uid("u"), ...u }]); showToast("Usuario creado"); }
  function deleteUser(id) { setUsers(users.filter(u => u.id !== id)); showToast("Usuario eliminado"); }

  const viewProps = { products, setProducts, cart, setCart, sales, setSales, fiados, setFiados, profile, setProfile, counters, setCounters, cajaState, setCajaState, showToast, setView };

  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; }
    table { font-family: ${FONT_BODY}; }
    input:focus, select:focus { border-color: ${C.orange} !important; outline: none; }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-thumb { background: #FED7AA; border-radius: 8px; }
    @keyframes scan { 0%,100%{top:10%} 50%{top:80%} }
  `;

  if (!currentUser) {
    if (users.length === 0) {
      return (
        <div style={{ fontFamily: FONT_BODY }}>
          <style>{STYLES}</style>
          <CreateAccountScreen onCreated={u => {
            setUsers([u]);
            setCurrentUser(u);
            setOnboarding(true);
            setView("panel");
          }} />
        </div>
      );
    }
    return <div style={{ fontFamily: FONT_BODY }}><style>{STYLES}</style><LoginScreen users={users} onLogin={handleLogin} /></div>;
  }

  const content = (
    <div className="p-4 md:p-7" style={{ paddingBottom: isTablet ? 100 : 32 }}>
      {view === "panel"      && currentUser.role === "admin" && <PanelView products={products} sales={sales} fiados={fiados} profile={profile} setView={setView} currentUser={currentUser} />}
      {view === "inventario" && currentUser.role === "admin" && <InventarioView products={products} setProducts={setProducts} showToast={showToast} />}
      {view === "venta"                                       && <VentaView {...viewProps} />}
      {view === "reporte"    && currentUser.role === "admin" && <ReporteView sales={sales} products={products} />}
      {view === "contabilidad" && currentUser.role === "admin" && <ContabilidadView sales={sales} products={products} gastos={gastos} setGastos={setGastos} proveedores={proveedores} setProveedores={setProveedores} fiados={fiados} showToast={showToast} />}
      {view === "caja"       && currentUser.role === "admin" && <CajaView sales={sales} cajaState={cajaState} setCajaState={setCajaState} showToast={showToast} currentUser={currentUser} />}
      {view === "fiados"     && currentUser.role === "admin" && <FiadosView fiados={fiados} setFiados={setFiados} showToast={showToast} />}
      {view === "boletas"                                     && <DetalleBoletaView sales={sales} setSales={setSales} products={products} setProducts={setProducts} showToast={showToast} />}
      {view === "configurar" && currentUser.role === "admin" && <ConfigurarView profile={profile} setProfile={setProfile} showToast={showToast} users={users} currentUser={currentUser} onAddUser={addUser} onDeleteUser={deleteUser} />}
      {view === "tutoriales"                                  && <TutorialesView />}
      {view === "ecommerce"  && currentUser.role === "admin" && <EcommerceView />}
      {view === "contacto"                                    && <ContactanosView />}
    </div>
  );

  const navProps = { view, setView, currentUser, onLogout: handleLogout, profile, cajaState, products, fiados, sales, isOwner, onOpenAdmin };

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.cream, minHeight: "100vh" }}>
      <style>{STYLES}</style>
      {isTablet ? (
        /* Tablet / móvil — topbar hamburguesa arriba + contenido full width */
        <>
          <MobileTopbar {...navProps} />
          <div style={{ paddingTop: 56, minHeight: "100vh" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
              {content}
            </div>
          </div>
        </>
      ) : (
        /* PC — sidebar fijo izquierdo + contenido con margen */
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar {...navProps} />
          <div style={{ marginLeft: SIDEBAR_W, flex: 1, minWidth: 0 }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 32px" }}>
              {content}
            </div>
          </div>
        </div>
      )}
      <Toast toast={toast} />
      {onboarding && (
        <OnboardingWizard
          profile={profile}
          setProfile={setProfile}
          setProducts={setProducts}
          onComplete={() => { setOnboarding(false); showToast("¡Bienvenido a MiMarket! 🎉"); }}
        />
      )}
    </div>
  );
}
