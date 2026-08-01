import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, AreaChart, Area,
} from "recharts";
import {
  Home, Utensils, Car, Send, Heart, ShoppingBag, Smartphone, HelpCircle,
  Briefcase, Banknote, Repeat, Landmark, Wallet, CreditCard, PiggyBank,
  Gift, GraduationCap, Zap, Plus, X, ChevronLeft, ChevronRight,
  ArrowUpRight, ArrowDownRight, ArrowLeftRight, Pencil, Trash2, Check,
  LayoutGrid, List, PieChart as PieIcon, Settings, Search, Menu, Mail, Code2,
  Coffee, Plane, Gamepad2, Dumbbell, Baby, Dog, Fuel, Wifi, Shirt,
  Stethoscope, Film, Music, BookOpen, Wrench, TreePine, Bus, Bike,
  Scissors, PawPrint, Umbrella, Download,
} from "lucide-react";

/* ---------------------------------- tokens ---------------------------------- */

const LIGHT = {
  bg: "#F1F6FC", surface: "#FFFFFF", ink: "#132A43", inkSoft: "#44586E", muted: "#8BA0B6",
  border: "#DCE7F3", surfaceAlt: "#F1F3F6", chipBg: "#FFFFFF",
  emerald: "#0EA5E9", rose: "#D6484F", gold: "#3B82F6", blue: "#1D63D1",
  primary: "#1D63D1", primaryDark: "#123E82", primarySoft: "#E7F0FC",
};
const DARK = {
  bg: "#0B1420", surface: "#111C2C", ink: "#EAF2FF", inkSoft: "#AFC0D6", muted: "#71859E",
  border: "#223349", surfaceAlt: "#1A2637", chipBg: "#182233",
  emerald: "#38BDF8", rose: "#F0707A", gold: "#5B9CFF", blue: "#5B9CFF",
  primary: "#2E6FE0", primaryDark: "#1A3F87", primarySoft: "#182B4C",
};
// C is mutated in place on theme change so every component (which reads C.xxx at
// render time) picks up the new palette without prop drilling or context.
const C = { ...LIGHT };
function applyTheme(dark) { Object.assign(C, dark ? DARK : LIGHT); }

const ICONS = {
  Home, Utensils, Car, Send, Heart, ShoppingBag, Smartphone, HelpCircle,
  Briefcase, Banknote, Repeat, Landmark, Wallet, CreditCard, PiggyBank,
  Gift, GraduationCap, Zap,
  Coffee, Plane, Gamepad2, Dumbbell, Baby, Dog, Fuel, Wifi, Shirt,
  Stethoscope, Film, Music, BookOpen, Wrench, TreePine, Bus, Bike,
  Scissors, PawPrint, Umbrella,
};

const MONTHS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const MONTHS_SHORT = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

// mutable currency/date format settings, same in-place trick as the theme
const FMT = { decimals: 2, thousands: "es", symbolVisible: true, symbolSide: "right", weekStart: "monday", dateOrder: "dmy", includeTransfers: true, currency: "EUR" };
function applyFormatSettings(s) { Object.assign(FMT, s); }

const CURRENCY_SYMBOLS = { EUR: "€", USD: "$" };

function formatNumber(value) {
  const n = Math.abs(value || 0);
  const fixed = n.toFixed(FMT.decimals);
  let [intPart, decPart] = fixed.split(".");
  const thousandsSep = FMT.thousands === "es" ? "." : ",";
  const decimalSep = FMT.thousands === "es" ? "," : ".";
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
  const out = FMT.decimals > 0 ? intPart + decimalSep + decPart : intPart;
  return (value < 0 ? "-" : "") + out;
}
const eur = (n) => {
  const num = formatNumber(n);
  if (!FMT.symbolVisible) return num;
  const symbol = CURRENCY_SYMBOLS[FMT.currency] || "€";
  return FMT.symbolSide === "left" ? `${symbol}${num}` : `${num} ${symbol}`;
};
const isoDay = (d) => new Date(d).toISOString().slice(0, 10);

const DEV_PHOTO =
  "data:image/jpeg;base64,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";

/* ---------------------------------- defaults ---------------------------------- */

const DEFAULT_ACCOUNTS = [
  { id: "acc-banco", name: "Banco", icon: "Landmark", color: C.blue, initialBalance: 0 },
  { id: "acc-efectivo", name: "Efectivo", icon: "Wallet", color: C.emerald, initialBalance: 0 },
  { id: "acc-tarjeta", name: "Tarjeta", icon: "CreditCard", color: "#2AAFD6", initialBalance: 0 },
];

const DEFAULT_CATEGORIES = [
  { id: "cat-i-salario", name: "Salario", type: "income", icon: "Briefcase", color: C.emerald },
  { id: "cat-i-ventas", name: "Ventas", type: "income", icon: "Banknote", color: C.blue },
  { id: "cat-i-devolucion", name: "Devolución", type: "income", icon: "Repeat", color: "#2AAFD6" },
  { id: "cat-i-otros", name: "Otros ingresos", type: "income", icon: "HelpCircle", color: "#7C5CBF" },
  { id: "cat-e-hogar", name: "Alquiler / Hogar", type: "expense", icon: "Home", color: C.rose },
  { id: "cat-e-comida", name: "Comida", type: "expense", icon: "Utensils", color: "#E08E45" },
  { id: "cat-e-transporte", name: "Transporte", type: "expense", icon: "Car", color: C.blue },
  { id: "cat-e-envios", name: "Envíos / Familia", type: "expense", icon: "Send", color: "#2AAFD6" },
  { id: "cat-e-salud", name: "Salud", type: "expense", icon: "Heart", color: "#C74B6B" },
  { id: "cat-e-compras", name: "Compras", type: "expense", icon: "ShoppingBag", color: "#7C5CBF" },
  { id: "cat-e-suscripciones", name: "Suscripciones", type: "expense", icon: "Smartphone", color: C.inkSoft },
  { id: "cat-e-otros", name: "Otros", type: "expense", icon: "HelpCircle", color: C.muted },
];

function seedTransactions() {
  const today = new Date();
  const d = (offset) => { const x = new Date(today); x.setDate(x.getDate() - offset); return x.toISOString(); };
  const first = new Date(today.getFullYear(), today.getMonth(), 3).toISOString();
  return [
    { id: uid(), type: "income", amount: 1392.41, date: first, accountId: "acc-banco", categoryId: "cat-i-salario", toAccountId: null, note: "Nómina" },
    { id: uid(), type: "expense", amount: 544, date: d(11), accountId: "acc-banco", categoryId: "cat-e-hogar", toAccountId: null, note: "" },
    { id: uid(), type: "expense", amount: 66, date: d(8), accountId: "acc-banco", categoryId: "cat-e-envios", toAccountId: null, note: "Envío a Venezuela" },
    { id: uid(), type: "expense", amount: 33.6, date: d(6), accountId: "acc-banco", categoryId: "cat-e-comida", toAccountId: null, note: "" },
    { id: uid(), type: "expense", amount: 20, date: d(4), accountId: "acc-efectivo", categoryId: "cat-e-otros", toAccountId: null, note: "" },
    { id: uid(), type: "expense", amount: 92.2, date: d(2), accountId: "acc-banco", categoryId: "cat-e-comida", toAccountId: null, note: "" },
  ];
}

/* ---------------------------------- date helpers ---------------------------------- */

const startOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const endOfDay = (d) => { const x = new Date(d); x.setHours(23,59,59,999); return x; };
const startOfWeek = (d) => { const x = startOfDay(d); const startDay = FMT.weekStart === "sunday" ? 0 : 1; const day = (x.getDay() - startDay + 7) % 7; x.setDate(x.getDate()-day); return x; };
const endOfWeek = (d) => { const x = startOfWeek(d); x.setDate(x.getDate()+6); return endOfDay(x); };
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => endOfDay(new Date(d.getFullYear(), d.getMonth()+1, 0));
const startOfYear = (d) => new Date(d.getFullYear(), 0, 1);
const endOfYear = (d) => endOfDay(new Date(d.getFullYear(), 11, 31));

function addPeriod(date, type, delta) {
  const d = new Date(date);
  if (type === "day") d.setDate(d.getDate() + delta);
  else if (type === "week") d.setDate(d.getDate() + 7 * delta);
  else if (type === "year") d.setFullYear(d.getFullYear() + delta);
  else d.setMonth(d.getMonth() + delta);
  return d;
}

function getRange(type, anchor, customStart, customEnd) {
  switch (type) {
    case "day": return [startOfDay(anchor), endOfDay(anchor)];
    case "week": return [startOfWeek(anchor), endOfWeek(anchor)];
    case "year": return [startOfYear(anchor), endOfYear(anchor)];
    case "custom": return [startOfDay(new Date(customStart || anchor)), endOfDay(new Date(customEnd || anchor))];
    default: return [startOfMonth(anchor), endOfMonth(anchor)];
  }
}

function periodLabel(type, anchor, customStart, customEnd) {
  if (type === "day") return `${anchor.getDate()} ${MONTHS[anchor.getMonth()]} ${anchor.getFullYear()}`;
  if (type === "week") { const s = startOfWeek(anchor), e = endOfWeek(anchor); return `${s.getDate()} – ${e.getDate()} ${MONTHS[e.getMonth()]} ${e.getFullYear()}`; }
  if (type === "year") return `${anchor.getFullYear()}`;
  if (type === "custom") return `${customStart || "—"} → ${customEnd || "—"}`;
  return `${MONTHS[anchor.getMonth()][0].toUpperCase()}${MONTHS[anchor.getMonth()].slice(1)} ${anchor.getFullYear()}`;
}

/* ---------------------------------- small UI atoms ---------------------------------- */

function Icon({ name, size = 18, color = C.ink, strokeWidth = 2 }) {
  const Cmp = ICONS[name] || HelpCircle;
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} />;
}

/* Signature mark: a four-quadrant pinwheel in shades of green, echoing a
   classic "daily expenses" app icon but restyled for Cuenta Clara. */
function LogoMark({ size = 40 }) {
  // quadrants in visual order: top-left, top-right, bottom-left, bottom-right
  const TL = { Icn: Wallet, bg: "#123E82", pos: { top: "24%", left: "24%" } };
  const TR = { Icn: ArrowUpRight, bg: "#1D63D1", pos: { top: "24%", left: "76%" } };
  const BL = { Icn: PiggyBank, bg: "#3B82F6", pos: { top: "76%", left: "24%" } };
  const BR = { Icn: Send, bg: "#0EA5E9", pos: { top: "76%", left: "76%" } };
  const quads = [TL, TR, BL, BR];
  return (
    <div className="rounded-[22%] shrink-0" style={{ width: size, height: size, backgroundColor: "#fff", padding: size * 0.08, boxShadow: "0 1px 3px rgba(29,99,209,0.3)" }}>
      <div className="relative rounded-full overflow-hidden w-full h-full"
        style={{ background: `conic-gradient(from 0deg, ${TR.bg} 0deg 90deg, ${BR.bg} 90deg 180deg, ${BL.bg} 180deg 270deg, ${TL.bg} 270deg 360deg)` }}>
        {quads.map((q, i) => (
          <div key={i} className="absolute flex items-center justify-center" style={{ ...q.pos, width: size * 0.3, height: size * 0.3, transform: "translate(-50%,-50%)" }}>
            <q.Icn size={size * 0.17} color="#fff" strokeWidth={2.5} />
          </div>
        ))}
        <div className="absolute rounded-full bg-white" style={{ width: size * 0.26, height: size * 0.26, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      </div>
    </div>
  );
}

function CatBadge({ cat, size = 38 }) {
  return (
    <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: size, height: size, backgroundColor: (cat?.color || C.muted) + "22" }}>
      <Icon name={cat?.icon} color={cat?.color || C.muted} size={size * 0.5} />
    </div>
  );
}

function Card({ children, style, className = "" }) {
  return (
    <div className={"rounded-2xl p-4 " + className} style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, boxShadow: "0 1px 2px rgba(11,31,58,0.04)", ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children, right }) {
  return (
    <div className="flex items-center justify-between mb-2 px-1">
      <h3 className="text-[13px] font-semibold tracking-wide uppercase" style={{ color: C.inkSoft, letterSpacing: "0.04em" }}>{children}</h3>
      {right}
    </div>
  );
}

function AmountText({ value, type, size = "text-base" }) {
  const color = type === "income" ? C.emerald : type === "expense" ? C.rose : C.blue;
  const sign = type === "income" ? "+" : type === "expense" ? "−" : "";
  return <span className={`${size} font-semibold`} style={{ color, fontVariantNumeric: "tabular-nums" }}>{sign} {eur(Math.abs(value))}</span>;
}

/* ---------------------------------- period bar ---------------------------------- */

function PeriodBar({ period, setPeriod, compact }) {
  const { type, anchor, customStart, customEnd } = period;
  const [showTypes, setShowTypes] = useState(false);
  const types = [
    { id: "day", label: "Día" }, { id: "week", label: "Semana" },
    { id: "month", label: "Mes" }, { id: "year", label: "Año" }, { id: "custom", label: "Rango" },
  ];
  return (
    <div>
      {!compact && (
        <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1">
          {types.map((t) => (
            <button key={t.id} onClick={() => setPeriod({ ...period, type: t.id })}
              className="px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap"
              style={{ backgroundColor: type === t.id ? C.ink : "#FFFFFF", color: type === t.id ? "#fff" : C.inkSoft, border: `1px solid ${type === t.id ? C.ink : C.border}` }}>
              {t.label}
            </button>
          ))}
        </div>
      )}
      {type === "custom" ? (
        <div className="flex items-center gap-2">
          <input type="date" value={customStart || ""} onChange={(e) => setPeriod({ ...period, customStart: e.target.value })}
            className="flex-1 px-2 py-2 rounded-xl text-[13px]" style={{ border: `1px solid ${C.border}` }} />
          <span style={{ color: C.muted }}>→</span>
          <input type="date" value={customEnd || ""} onChange={(e) => setPeriod({ ...period, customEnd: e.target.value })}
            className="flex-1 px-2 py-2 rounded-xl text-[13px]" style={{ border: `1px solid ${C.border}` }} />
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl px-1" style={{ backgroundColor: "#EFF2F6" }}>
          <button onClick={() => setPeriod({ ...period, anchor: addPeriod(anchor, type, -1) })} className="p-2"><ChevronLeft size={18} color={C.inkSoft} /></button>
          <span className="text-[14px] font-semibold" style={{ color: C.ink }}>{periodLabel(type, anchor)}</span>
          <button onClick={() => setPeriod({ ...period, anchor: addPeriod(anchor, type, 1) })} className="p-2"><ChevronRight size={18} color={C.inkSoft} /></button>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- account chips ---------------------------------- */

function AccountChips({ accounts, value, onChange }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      <button onClick={() => onChange("all")} className="px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap"
        style={{ backgroundColor: value === "all" ? C.ink : "#fff", color: value === "all" ? "#fff" : C.inkSoft, border: `1px solid ${value === "all" ? C.ink : C.border}` }}>
        Todas
      </button>
      {accounts.map((a) => (
        <button key={a.id} onClick={() => onChange(a.id)} className="px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap flex items-center gap-1.5"
          style={{ backgroundColor: value === a.id ? C.ink : "#fff", color: value === a.id ? "#fff" : C.inkSoft, border: `1px solid ${value === a.id ? C.ink : C.border}` }}>
          <Icon name={a.icon} size={13} color={value === a.id ? "#fff" : C.inkSoft} /> {a.name}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------- balances / filters ---------------------------------- */

function accountBalance(accountId, accounts, transactions) {
  const acc = accounts.find((a) => a.id === accountId);
  if (!acc) return 0;
  let bal = acc.initialBalance || 0;
  transactions.forEach((t) => {
    if (t.type === "income" && t.accountId === accountId) bal += t.amount;
    else if (t.type === "expense" && t.accountId === accountId) bal -= t.amount;
    else if (t.type === "transfer" && FMT.includeTransfers) {
      if (t.accountId === accountId) bal -= t.amount;
      if (t.toAccountId === accountId) bal += t.amount;
    }
  });
  return bal;
}

function inRange(tx, start, end) {
  const t = new Date(tx.date).getTime();
  return t >= start.getTime() && t <= end.getTime();
}

function filterByAccount(tx, accountFilter) {
  if (accountFilter === "all") return true;
  return tx.accountId === accountFilter || tx.toAccountId === accountFilter;
}

/* ---------------------------------- add/edit transaction modal ---------------------------------- */

function TxModal({ open, onClose, onSave, onDelete, accounts, categories, editing, defaultType }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(isoDay(new Date()));
  const [accountId, setAccountId] = useState(accounts[0]?.id);
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id || accounts[0]?.id);
  const [categoryId, setCategoryId] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setType(editing.type); setAmount(String(editing.amount)); setDate(isoDay(editing.date));
      setAccountId(editing.accountId); setToAccountId(editing.toAccountId || accounts[0]?.id);
      setCategoryId(editing.categoryId); setNote(editing.note || "");
    } else {
      setType(defaultType || "expense"); setAmount(""); setDate(isoDay(new Date()));
      setAccountId(accounts[0]?.id); setToAccountId(accounts[1]?.id || accounts[0]?.id);
      setCategoryId(null); setNote("");
    }
  }, [open, editing, defaultType]);

  if (!open) return null;
  const cats = categories.filter((c) => c.type === type);

  const canSave = amount && parseFloat(amount) > 0 && accountId && (type === "transfer" ? toAccountId && toAccountId !== accountId : categoryId);

  const save = () => {
    if (!canSave) return;
    onSave({
      id: editing?.id || uid(), type, amount: parseFloat(amount), date: new Date(date).toISOString(),
      accountId, toAccountId: type === "transfer" ? toAccountId : null,
      categoryId: type === "transfer" ? null : categoryId, note,
    });
  };

  const typeColor = { income: C.emerald, expense: C.rose, transfer: C.blue }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: "rgba(11,31,58,0.45)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl p-5 max-h-[92vh] overflow-y-auto" style={{ backgroundColor: C.surface }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: C.ink }}>{editing ? "Editar movimiento" : "Nuevo movimiento"}</h2>
          <button onClick={onClose}><X size={22} color={C.inkSoft} /></button>
        </div>

        <div className="flex gap-2 mb-4">
          {[{ id: "expense", label: "Gasto" }, { id: "income", label: "Ingreso" }, { id: "transfer", label: "Transferencia" }].map((t) => (
            <button key={t.id} onClick={() => { setType(t.id); setCategoryId(null); }} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
              style={{ backgroundColor: type === t.id ? { income: C.emerald, expense: C.rose, transfer: C.blue }[t.id] : "#F1F3F6", color: type === t.id ? "#fff" : C.inkSoft }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="text-[12px] font-medium" style={{ color: C.muted }}>Importe</label>
          <div className="flex items-center rounded-xl px-3 mt-1" style={{ border: `1.5px solid ${C.border}` }}>
            <input type="number" inputMode="decimal" placeholder="0,00" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-full py-3 text-2xl font-bold outline-none" style={{ color: typeColor, fontVariantNumeric: "tabular-nums" }} />
            <span className="text-lg font-semibold" style={{ color: C.muted }}>{CURRENCY_SYMBOLS[FMT.currency] || "€"}</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[12px] font-medium" style={{ color: C.muted }}>Fecha</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl text-[14px]" style={{ border: `1px solid ${C.border}` }} />
        </div>

        <div className="mb-4">
          <label className="text-[12px] font-medium" style={{ color: C.muted }}>{type === "transfer" ? "Desde la cuenta" : "Cuenta"}</label>
          <div className="flex gap-1.5 mt-1 flex-wrap">
            {accounts.map((a) => (
              <button key={a.id} onClick={() => setAccountId(a.id)} className="px-3 py-2 rounded-xl text-[13px] font-medium flex items-center gap-1.5"
                style={{ backgroundColor: accountId === a.id ? C.ink : "#F1F3F6", color: accountId === a.id ? "#fff" : C.inkSoft }}>
                <Icon name={a.icon} size={14} color={accountId === a.id ? "#fff" : C.inkSoft} /> {a.name}
              </button>
            ))}
          </div>
        </div>

        {type === "transfer" && (
          <div className="mb-4">
            <label className="text-[12px] font-medium" style={{ color: C.muted }}>Hacia la cuenta</label>
            <div className="flex gap-1.5 mt-1 flex-wrap">
              {accounts.filter((a) => a.id !== accountId).map((a) => (
                <button key={a.id} onClick={() => setToAccountId(a.id)} className="px-3 py-2 rounded-xl text-[13px] font-medium flex items-center gap-1.5"
                  style={{ backgroundColor: toAccountId === a.id ? C.ink : "#F1F3F6", color: toAccountId === a.id ? "#fff" : C.inkSoft }}>
                  <Icon name={a.icon} size={14} color={toAccountId === a.id ? "#fff" : C.inkSoft} /> {a.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {type !== "transfer" && (
          <div className="mb-4">
            <label className="text-[12px] font-medium" style={{ color: C.muted }}>Categoría</label>
            <div className="grid grid-cols-4 gap-2 mt-1.5">
              {cats.map((c) => (
                <button key={c.id} onClick={() => setCategoryId(c.id)} className="flex flex-col items-center gap-1 py-2 rounded-xl"
                  style={{ backgroundColor: categoryId === c.id ? c.color + "22" : "transparent", border: `1.5px solid ${categoryId === c.id ? c.color : "transparent"}` }}>
                  <CatBadge cat={c} size={34} />
                  <span className="text-[10.5px] text-center leading-tight" style={{ color: C.inkSoft }}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-5">
          <label className="text-[12px] font-medium" style={{ color: C.muted }}>Nota (opcional)</label>
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej. cena con amigos"
            className="w-full mt-1 px-3 py-2.5 rounded-xl text-[14px]" style={{ border: `1px solid ${C.border}` }} />
        </div>

        <div className="flex gap-2">
          {editing && (
            <button onClick={() => onDelete(editing.id)} className="px-4 py-3 rounded-xl" style={{ backgroundColor: "#FBEAEA" }}>
              <Trash2 size={19} color={C.rose} />
            </button>
          )}
          <button onClick={save} disabled={!canSave} className="flex-1 py-3 rounded-xl font-semibold text-[15px]"
            style={{ backgroundColor: canSave ? C.ink : "#D5DAE2", color: "#fff" }}>
            {editing ? "Guardar cambios" : "Añadir movimiento"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- transaction row ---------------------------------- */

function TxRow({ tx, categories, accounts, onClick }) {
  const cat = categories.find((c) => c.id === tx.categoryId);
  const acc = accounts.find((a) => a.id === tx.accountId);
  const toAcc = accounts.find((a) => a.id === tx.toAccountId);
  const isTransfer = tx.type === "transfer";
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 py-2.5 text-left">
      {isTransfer ? (
        <div className="flex items-center justify-center rounded-full shrink-0" style={{ width: 38, height: 38, backgroundColor: C.blue + "1c" }}>
          <ArrowLeftRight size={17} color={C.blue} />
        </div>
      ) : <CatBadge cat={cat} />}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium truncate" style={{ color: C.ink }}>
          {isTransfer ? `${acc?.name} → ${toAcc?.name}` : (cat?.name || "Otros")}
        </p>
        <p className="text-[12px] truncate" style={{ color: C.muted }}>
          {new Date(tx.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}{tx.note ? ` · ${tx.note}` : ""}{!isTransfer ? ` · ${acc?.name}` : ""}
        </p>
      </div>
      <AmountText value={tx.amount} type={tx.type} />
    </button>
  );
}

/* ---------------------------------- INICIO (dashboard) ---------------------------------- */

function Inicio({ accounts, categories, transactions, period, setPeriod, accountFilter, setAccountFilter, openAdd, openEdit }) {
  const [start, end] = getRange(period.type, period.anchor, period.customStart, period.customEnd);

  const periodTx = transactions.filter((t) => inRange(t, start, end) && filterByAccount(t, accountFilter));
  const income = periodTx.filter((t) => t.type === "income" && (accountFilter === "all" || t.accountId === accountFilter)).reduce((s, t) => s + t.amount, 0);
  const expense = periodTx.filter((t) => t.type === "expense" && (accountFilter === "all" || t.accountId === accountFilter)).reduce((s, t) => s + t.amount, 0);
  const net = income - expense;

  const totalBalance = accounts.reduce((s, a) => s + accountBalance(a.id, accounts, transactions), 0);
  const filteredBalance = accountFilter === "all" ? totalBalance : accountBalance(accountFilter, accounts, transactions);

  const expenseByCat = useMemo(() => {
    const map = {};
    periodTx.filter((t) => t.type === "expense" && (accountFilter === "all" || t.accountId === accountFilter)).forEach((t) => { map[t.categoryId] = (map[t.categoryId] || 0) + t.amount; });
    return Object.entries(map).map(([catId, total]) => ({ cat: categories.find((c) => c.id === catId), total }))
      .sort((a, b) => b.total - a.total);
  }, [periodTx, categories, accountFilter]);

  const recent = transactions.filter((t) => filterByAccount(t, accountFilter)).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  const spendRatio = income > 0 ? Math.min(100, (expense / income) * 100) : (expense > 0 ? 100 : 0);

  return (
    <div className="space-y-4 pb-4">
      <AccountChips accounts={accounts} value={accountFilter} onChange={setAccountFilter} />
      <PeriodBar period={period} setPeriod={setPeriod} />

      <Card style={{ backgroundColor: C.ink }} className="text-white">
        <p className="text-[12px]" style={{ color: "#AFC0D6" }}>Saldo {accountFilter === "all" ? "total" : accounts.find((a) => a.id === accountFilter)?.name}</p>
        <p className="text-[32px] font-bold mt-0.5" style={{ fontVariantNumeric: "tabular-nums" }}>{eur(filteredBalance)}</p>
        <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.14)" }}>
          <div className="flex items-center gap-1.5">
            <ArrowUpRight size={15} color={C.emerald} /><span className="text-[13px] font-semibold" style={{ color: "#fff" }}>{eur(income)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ArrowDownRight size={15} color="#F0A0A4" /><span className="text-[13px] font-semibold" style={{ color: "#fff" }}>{eur(expense)}</span>
          </div>
          <div className="ml-auto text-[13px] font-semibold" style={{ color: net >= 0 ? C.emerald : "#F0A0A4" }}>
            {net >= 0 ? "+" : ""}{eur(net)}
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] font-medium" style={{ color: C.inkSoft }}>Gastado sobre lo ingresado</span>
          <span className="text-[13px] font-semibold" style={{ color: C.ink }}>{spendRatio.toFixed(0)}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "#EEF1F5" }}>
          <div className="h-full rounded-full" style={{ width: `${spendRatio}%`, backgroundColor: spendRatio > 90 ? C.rose : spendRatio > 65 ? "#E08E45" : C.emerald }} />
        </div>
      </Card>

      {expenseByCat.length > 0 && (
        <Card>
          <SectionTitle>Gastos por categoría</SectionTitle>
          <div className="flex items-center mb-3">
            <div style={{ width: 120, height: 120 }} className="shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseByCat} dataKey="total" nameKey={(d) => d.cat?.name} innerRadius={38} outerRadius={58} paddingAngle={2} stroke="none">
                    {expenseByCat.map((e, i) => <Cell key={i} fill={e.cat?.color || C.muted} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 pl-3 space-y-1.5 min-w-0">
              {expenseByCat.slice(0, 4).map((e, i) => (
                <div key={i} className="flex items-center gap-2 text-[12.5px]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.cat?.color || C.muted }} />
                  <span className="truncate flex-1" style={{ color: C.inkSoft }}>{e.cat?.name || "Otros"}</span>
                  <span className="font-semibold shrink-0" style={{ color: C.ink }}>{eur(e.total)}</span>
                </div>
              ))}
            </div>
          </div>
          {expenseByCat.length > 4 && (
            <div className="pt-2 space-y-1.5" style={{ borderTop: `1px solid ${C.border}` }}>
              {expenseByCat.slice(4).map((e, i) => (
                <div key={i} className="flex items-center gap-2 text-[12.5px]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: e.cat?.color || C.muted }} />
                  <span className="truncate flex-1" style={{ color: C.inkSoft }}>{e.cat?.name || "Otros"}</span>
                  <span className="font-semibold shrink-0" style={{ color: C.ink }}>{eur(e.total)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <Card>
        <SectionTitle>Saldo por cuenta</SectionTitle>
        <div className="space-y-2.5">
          {accounts.map((a) => (
            <div key={a.id} className="flex items-center gap-2.5">
              <div className="flex items-center justify-center rounded-lg" style={{ width: 30, height: 30, backgroundColor: a.color + "1c" }}>
                <Icon name={a.icon} size={15} color={a.color} />
              </div>
              <span className="flex-1 text-[13.5px]" style={{ color: C.inkSoft }}>{a.name}</span>
              <span className="text-[13.5px] font-semibold" style={{ color: C.ink, fontVariantNumeric: "tabular-nums" }}>{eur(accountBalance(a.id, accounts, transactions))}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle>Últimos movimientos</SectionTitle>
        {recent.length === 0 ? (
          <p className="text-[13px] py-6 text-center" style={{ color: C.muted }}>Aún no hay movimientos. Añade el primero con el botón +.</p>
        ) : (
          <div className="divide-y" style={{ borderColor: C.border }}>
            {recent.map((t) => <TxRow key={t.id} tx={t} categories={categories} accounts={accounts} onClick={() => openEdit(t)} />)}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---------------------------------- MOVIMIENTOS ---------------------------------- */

function Movimientos({ accounts, categories, transactions, accountFilter, setAccountFilter, openEdit }) {
  const [period, setPeriod] = useState({ type: "month", anchor: new Date() });
  const [query, setQuery] = useState("");
  const [start, end] = getRange(period.type, period.anchor, period.customStart, period.customEnd);

  const list = transactions
    .filter((t) => inRange(t, start, end) && filterByAccount(t, accountFilter))
    .filter((t) => !query || (t.note || "").toLowerCase().includes(query.toLowerCase()) || (categories.find((c) => c.id === t.categoryId)?.name || "").toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const groups = {};
  list.forEach((t) => {
    const key = new Date(t.date).toLocaleDateString("es-ES", { weekday: "long", day: "2-digit", month: "long" });
    groups[key] = groups[key] || [];
    groups[key].push(t);
  });

  const totalPeriod = list.filter((t) => t.type !== "transfer").reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0);

  return (
    <div className="space-y-3 pb-4">
      <AccountChips accounts={accounts} value={accountFilter} onChange={setAccountFilter} />
      <PeriodBar period={period} setPeriod={setPeriod} />
      <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ backgroundColor: "#fff", border: `1px solid ${C.border}` }}>
        <Search size={16} color={C.muted} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por categoría o nota"
          className="flex-1 text-[13.5px] outline-none" style={{ color: C.ink }} />
      </div>

      <Card>
        {list.length === 0 ? (
          <p className="text-[13px] py-8 text-center" style={{ color: C.muted }}>No hay movimientos en este período.</p>
        ) : Object.entries(groups).map(([day, txs]) => (
          <div key={day} className="mb-1">
            <p className="text-[11.5px] font-semibold uppercase pt-2 pb-1" style={{ color: C.muted, letterSpacing: "0.03em" }}>{day}</p>
            <div className="divide-y" style={{ borderColor: C.border }}>
              {txs.map((t) => <TxRow key={t.id} tx={t} categories={categories} accounts={accounts} onClick={() => openEdit(t)} />)}
            </div>
          </div>
        ))}
      </Card>

      {list.length > 0 && (
        <div className="text-center text-[13px]" style={{ color: C.inkSoft }}>
          Balance del período: <span className="font-semibold" style={{ color: totalPeriod >= 0 ? C.emerald : C.rose }}>{eur(totalPeriod)}</span>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- REPORTES ---------------------------------- */

function ReportesPorCategoria({ accounts, categories, transactions, accountFilter, setAccountFilter }) {
  const [period, setPeriod] = useState({ type: "month", anchor: new Date() });
  const [flow, setFlow] = useState("expense");
  const [start, end] = getRange(period.type, period.anchor, period.customStart, period.customEnd);

  const filtered = transactions.filter((t) => t.type === flow && inRange(t, start, end) && (accountFilter === "all" || t.accountId === accountFilter));
  const total = filtered.reduce((s, t) => s + t.amount, 0);
  const byCat = useMemo(() => {
    const map = {};
    filtered.forEach((t) => { map[t.categoryId] = (map[t.categoryId] || 0) + t.amount; });
    return Object.entries(map).map(([catId, amt]) => ({ cat: categories.find((c) => c.id === catId), amt, pct: total ? (amt / total) * 100 : 0 })).sort((a, b) => b.amt - a.amt);
  }, [filtered, categories, total]);

  return (
    <div className="space-y-3">
      <AccountChips accounts={accounts} value={accountFilter} onChange={setAccountFilter} />
      <div className="flex gap-2">
        <button onClick={() => setFlow("expense")} className="flex-1 py-2 rounded-xl text-[13px] font-semibold" style={{ backgroundColor: flow === "expense" ? C.rose : "#F1F3F6", color: flow === "expense" ? "#fff" : C.inkSoft }}>Gastos</button>
        <button onClick={() => setFlow("income")} className="flex-1 py-2 rounded-xl text-[13px] font-semibold" style={{ backgroundColor: flow === "income" ? C.emerald : "#F1F3F6", color: flow === "income" ? "#fff" : C.inkSoft }}>Ingresos</button>
      </div>
      <PeriodBar period={period} setPeriod={setPeriod} />

      <Card>
        {byCat.length === 0 ? (
          <p className="text-[13px] py-8 text-center" style={{ color: C.muted }}>Sin datos para este período.</p>
        ) : (
          <>
            <div className="flex justify-center py-2">
              <div style={{ width: 180, height: 180, position: "relative" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={byCat} dataKey="amt" innerRadius={56} outerRadius={86} paddingAngle={2} stroke="none">
                      {byCat.map((e, i) => <Cell key={i} fill={e.cat?.color || C.muted} />)}
                    </Pie>
                    <Tooltip formatter={(v) => eur(v)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[19px] font-bold" style={{ color: C.ink }}>{eur(total)}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-2">
              {byCat.map((e, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-1">
                    <CatBadge cat={e.cat} size={28} />
                    <span className="flex-1 text-[13.5px]" style={{ color: C.ink }}>{e.cat?.name || "Otros"}</span>
                    <span className="text-[13px] font-semibold" style={{ color: C.ink }}>{eur(e.amt)}</span>
                    <span className="text-[12px] w-12 text-right" style={{ color: C.muted }}>{e.pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden ml-9" style={{ backgroundColor: "#EEF1F5" }}>
                    <div className="h-full rounded-full" style={{ width: `${e.pct}%`, backgroundColor: e.cat?.color || C.muted }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

function ReportesPorFecha({ accounts, categories, transactions, accountFilter, setAccountFilter }) {
  const [flow, setFlow] = useState("expense");
  const [year, setYear] = useState(new Date().getFullYear());

  const data = MONTHS_SHORT.map((m, i) => {
    const s = new Date(year, i, 1), e = endOfMonth(new Date(year, i, 1));
    const amt = transactions.filter((t) => t.type === flow && inRange(t, s, e) && (accountFilter === "all" || t.accountId === accountFilter)).reduce((sum, t) => sum + t.amount, 0);
    return { month: m, amt };
  });
  const total = data.reduce((s, d) => s + d.amt, 0);

  return (
    <div className="space-y-3">
      <AccountChips accounts={accounts} value={accountFilter} onChange={setAccountFilter} />
      <div className="flex gap-2">
        <button onClick={() => setFlow("expense")} className="flex-1 py-2 rounded-xl text-[13px] font-semibold" style={{ backgroundColor: flow === "expense" ? C.rose : "#F1F3F6", color: flow === "expense" ? "#fff" : C.inkSoft }}>Gastos</button>
        <button onClick={() => setFlow("income")} className="flex-1 py-2 rounded-xl text-[13px] font-semibold" style={{ backgroundColor: flow === "income" ? C.emerald : "#F1F3F6", color: flow === "income" ? "#fff" : C.inkSoft }}>Ingresos</button>
      </div>
      <div className="flex items-center justify-between rounded-xl px-1" style={{ backgroundColor: "#EFF2F6" }}>
        <button onClick={() => setYear((y) => y - 1)} className="p-2"><ChevronLeft size={18} color={C.inkSoft} /></button>
        <span className="text-[14px] font-semibold" style={{ color: C.ink }}>{year}</span>
        <button onClick={() => setYear((y) => y + 1)} className="p-2"><ChevronRight size={18} color={C.inkSoft} /></button>
      </div>

      <Card>
        <div style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} width={36} />
              <Tooltip formatter={(v) => eur(v)} />
              <Bar dataKey="amt" radius={[5, 5, 0, 0]} fill={flow === "expense" ? C.rose : C.emerald} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 divide-y" style={{ borderColor: C.border }}>
          {data.filter((d) => d.amt > 0).map((d, i) => (
            <div key={i} className="flex items-center justify-between py-2 text-[13.5px]">
              <span style={{ color: C.inkSoft }} className="capitalize">{d.month}</span>
              <span className="font-semibold" style={{ color: C.ink }}>{eur(d.amt)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 mt-1" style={{ borderTop: `1px solid ${C.border}` }}>
          <span className="text-[13px] font-semibold" style={{ color: C.inkSoft }}>Total {year}</span>
          <span className="text-[15px] font-bold" style={{ color: C.ink }}>{eur(total)}</span>
        </div>
      </Card>
    </div>
  );
}

function Reportes({ accounts, categories, transactions, accountFilter, setAccountFilter }) {
  const [tab, setTab] = useState("categoria");
  return (
    <div className="space-y-3 pb-4">
      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: "#EFF2F6" }}>
        <button onClick={() => setTab("categoria")} className="flex-1 py-2 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5"
          style={{ backgroundColor: tab === "categoria" ? "#fff" : "transparent", color: C.ink, boxShadow: tab === "categoria" ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>
          <PieIcon size={14} /> Por categoría
        </button>
        <button onClick={() => setTab("fecha")} className="flex-1 py-2 rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5"
          style={{ backgroundColor: tab === "fecha" ? "#fff" : "transparent", color: C.ink, boxShadow: tab === "fecha" ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>
          <LayoutGrid size={14} /> Por fecha
        </button>
      </div>
      {tab === "categoria"
        ? <ReportesPorCategoria accounts={accounts} categories={categories} transactions={transactions} accountFilter={accountFilter} setAccountFilter={setAccountFilter} />
        : <ReportesPorFecha accounts={accounts} categories={categories} transactions={transactions} accountFilter={accountFilter} setAccountFilter={setAccountFilter} />}
    </div>
  );
}

/* ---------------------------------- AHORRO (simulador) ---------------------------------- */

function Ahorro({ sim, setSim }) {
  const { initial, monthly, rate, mode, goal, months } = sim;

  const result = useMemo(() => {
    const r = (parseFloat(rate) || 0) / 100 / 12;
    let bal = parseFloat(initial) || 0;
    const m = parseFloat(monthly) || 0;
    const g = parseFloat(goal) || 0;
    const cap = mode === "goal" ? 600 : Math.max(1, Math.min(parseInt(months) || 12, 600));
    const data = [{ mes: 0, saldo: bal }];
    let reached = null;
    for (let i = 1; i <= cap; i++) {
      bal = bal * (1 + r) + m;
      data.push({ mes: i, saldo: bal });
      if (mode === "goal" && reached === null && bal >= g) { reached = i; break; }
    }
    const finalBal = data[data.length - 1].saldo;
    const totalAportado = (parseFloat(initial) || 0) + m * (reached ?? cap);
    const interes = finalBal - totalAportado;
    return { data, reached, finalBal, totalAportado, interes };
  }, [initial, monthly, rate, mode, goal, months]);

  const upd = (k, v) => setSim({ ...sim, [k]: v });

  return (
    <div className="space-y-4 pb-4">
      <Card style={{ backgroundColor: C.ink }}>
        <div className="flex items-center gap-2 mb-1">
          <PiggyBank size={18} color={C.gold} />
          <span className="text-[13px] font-semibold" style={{ color: "#fff" }}>Simulador de ahorro</span>
        </div>
        <p className="text-[12px]" style={{ color: "#AFC0D6" }}>Proyecta cuánto puedes ahorrar y cuándo alcanzarás tu meta.</p>
      </Card>

      <Card>
        <div className="flex gap-2 mb-4">
          <button onClick={() => upd("mode", "goal")} className="flex-1 py-2 rounded-xl text-[13px] font-semibold" style={{ backgroundColor: mode === "goal" ? C.ink : "#F1F3F6", color: mode === "goal" ? "#fff" : C.inkSoft }}>Por meta (€)</button>
          <button onClick={() => upd("mode", "months")} className="flex-1 py-2 rounded-xl text-[13px] font-semibold" style={{ backgroundColor: mode === "months" ? C.ink : "#F1F3F6", color: mode === "months" ? "#fff" : C.inkSoft }}>Por plazo (meses)</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] font-medium" style={{ color: C.muted }}>Ahorro inicial</label>
            <input type="number" value={initial} onChange={(e) => upd("initial", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl text-[14px]" style={{ border: `1px solid ${C.border}` }} />
          </div>
          <div>
            <label className="text-[12px] font-medium" style={{ color: C.muted }}>Aporte mensual</label>
            <input type="number" value={monthly} onChange={(e) => upd("monthly", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl text-[14px]" style={{ border: `1px solid ${C.border}` }} />
          </div>
          {mode === "goal" ? (
            <div className="col-span-2">
              <label className="text-[12px] font-medium" style={{ color: C.muted }}>Meta de ahorro</label>
              <input type="number" value={goal} onChange={(e) => upd("goal", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl text-[14px]" style={{ border: `1px solid ${C.border}` }} />
            </div>
          ) : (
            <div className="col-span-2">
              <label className="text-[12px] font-medium" style={{ color: C.muted }}>Plazo (meses)</label>
              <input type="number" value={months} onChange={(e) => upd("months", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl text-[14px]" style={{ border: `1px solid ${C.border}` }} />
            </div>
          )}
          <div className="col-span-2">
            <label className="text-[12px] font-medium" style={{ color: C.muted }}>Interés anual estimado (%, opcional)</label>
            <input type="number" value={rate} onChange={(e) => upd("rate", e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-xl text-[14px]" style={{ border: `1px solid ${C.border}` }} />
          </div>
        </div>
      </Card>

      <Card>
        {mode === "goal" && (
          <p className="text-[13.5px] mb-2" style={{ color: C.inkSoft }}>
            {result.reached
              ? <>Alcanzarás tu meta en <span className="font-bold" style={{ color: C.ink }}>{result.reached} meses</span> (aprox. {MONTHS[new Date(new Date().setMonth(new Date().getMonth() + result.reached)).getMonth()]} {new Date(new Date().setMonth(new Date().getMonth() + result.reached)).getFullYear()}).</>
              : "Con estos datos no alcanzas la meta en 50 años. Prueba a subir el aporte mensual."}
          </p>
        )}
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.data}>
              <defs>
                <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.gold} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F5" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} label={{ value: "meses", position: "insideBottom", offset: -2, fontSize: 10, fill: C.muted }} />
              <YAxis tick={{ fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} width={40} />
              <Tooltip formatter={(v) => eur(v)} labelFormatter={(l) => `Mes ${l}`} />
              <Area type="monotone" dataKey="saldo" stroke={C.gold} strokeWidth={2.5} fill="url(#savGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
          <div>
            <p className="text-[11px]" style={{ color: C.muted }}>Aportado</p>
            <p className="text-[13px] font-bold" style={{ color: C.ink }}>{eur(result.totalAportado)}</p>
          </div>
          <div>
            <p className="text-[11px]" style={{ color: C.muted }}>Interés generado</p>
            <p className="text-[13px] font-bold" style={{ color: C.emerald }}>{eur(result.interes)}</p>
          </div>
          <div>
            <p className="text-[11px]" style={{ color: C.muted }}>Saldo final</p>
            <p className="text-[13px] font-bold" style={{ color: C.ink }}>{eur(result.finalBal)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------- MÁS (cuentas + categorías) ---------------------------------- */

function CuentaForm({ onSave, onCancel, editing }) {
  const [name, setName] = useState(editing?.name || "");
  const [initialBalance, setInitialBalance] = useState(editing ? String(editing.initialBalance) : "0");
  const [icon, setIcon] = useState(editing?.icon || "Wallet");
  const iconOptions = ["Landmark", "Wallet", "CreditCard", "PiggyBank", "Briefcase"];
  return (
    <Card className="mb-3">
      <input placeholder="Nombre de la cuenta" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-[14px] mb-2" style={{ border: `1px solid ${C.border}` }} />
      <input type="number" placeholder="Saldo inicial" value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-[14px] mb-2" style={{ border: `1px solid ${C.border}` }} />
      <div className="flex gap-2 mb-3">
        {iconOptions.map((i) => (
          <button key={i} onClick={() => setIcon(i)} className="p-2.5 rounded-xl" style={{ backgroundColor: icon === i ? C.ink : "#F1F3F6" }}>
            <Icon name={i} size={16} color={icon === i ? "#fff" : C.inkSoft} />
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-[13.5px] font-semibold" style={{ backgroundColor: "#F1F3F6", color: C.inkSoft }}>Cancelar</button>
        <button onClick={() => name && onSave({ id: editing?.id || uid(), name, icon, color: editing?.color || C.blue, initialBalance: parseFloat(initialBalance) || 0 })}
          className="flex-1 py-2.5 rounded-xl text-[13.5px] font-semibold" style={{ backgroundColor: C.ink, color: "#fff" }}>Guardar</button>
      </div>
    </Card>
  );
}

function CategoriaForm({ onSave, onCancel, editing, type }) {
  const [name, setName] = useState(editing?.name || "");
  const [icon, setIcon] = useState(editing?.icon || "HelpCircle");
  const [color, setColor] = useState(editing?.color || C.blue);
  const iconOptions = Object.keys(ICONS);
  const colorOptions = [C.emerald, C.blue, C.rose, C.gold, "#7C5CBF", "#2AAFD6", "#E08E45", C.inkSoft];
  return (
    <Card className="mb-3">
      <input placeholder="Nombre de la categoría" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-[14px] mb-3" style={{ border: `1px solid ${C.border}` }} />
      <p className="text-[12px] font-medium mb-1.5" style={{ color: C.muted }}>Icono</p>
      <div className="grid grid-cols-6 gap-2 mb-3">
        {iconOptions.map((i) => (
          <button key={i} onClick={() => setIcon(i)} className="p-2 rounded-xl flex items-center justify-center" style={{ backgroundColor: icon === i ? color + "33" : "#F1F3F6", border: icon === i ? `1.5px solid ${color}` : "1.5px solid transparent" }}>
            <Icon name={i} size={15} color={icon === i ? color : C.inkSoft} />
          </button>
        ))}
      </div>
      <p className="text-[12px] font-medium mb-1.5" style={{ color: C.muted }}>Color</p>
      <div className="flex gap-2 mb-3">
        {colorOptions.map((c) => (
          <button key={c} onClick={() => setColor(c)} className="w-7 h-7 rounded-full" style={{ backgroundColor: c, outline: color === c ? `2px solid ${C.ink}` : "none", outlineOffset: 2 }} />
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-[13.5px] font-semibold" style={{ backgroundColor: "#F1F3F6", color: C.inkSoft }}>Cancelar</button>
        <button onClick={() => name && onSave({ id: editing?.id || uid(), name, icon, color, type })}
          className="flex-1 py-2.5 rounded-xl text-[13.5px] font-semibold" style={{ backgroundColor: C.ink, color: "#fff" }}>Guardar</button>
      </div>
    </Card>
  );
}

function Mas({ accounts, setAccounts, categories, setCategories, transactions, setTransactions, settings, updateSettings }) {
  const [section, setSection] = useState("cuentas");
  const [editingAcc, setEditingAcc] = useState(undefined);
  const [editingCat, setEditingCat] = useState(undefined);
  const [catType, setCatType] = useState("expense");

  const saveAccount = (acc) => {
    setAccounts((prev) => editingAcc ? prev.map((a) => a.id === acc.id ? acc : a) : [...prev, acc]);
    setEditingAcc(undefined);
  };
  const deleteAccount = (id) => {
    if (accounts.length <= 1) return;
    if (!window.confirm("¿Eliminar esta cuenta? Los movimientos asociados no se borrarán.")) return;
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };
  const saveCategory = (cat) => {
    setCategories((prev) => editingCat ? prev.map((c) => c.id === cat.id ? cat : c) : [...prev, cat]);
    setEditingCat(undefined);
  };
  const deleteCategory = (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-3 pb-4">
      <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: C.surfaceAlt }}>
        <button onClick={() => setSection("cuentas")} className="flex-1 py-2 rounded-lg text-[12.5px] font-semibold" style={{ backgroundColor: section === "cuentas" ? C.surface : "transparent", color: C.ink, boxShadow: section === "cuentas" ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>Cuentas</button>
        <button onClick={() => setSection("categorias")} className="flex-1 py-2 rounded-lg text-[12.5px] font-semibold" style={{ backgroundColor: section === "categorias" ? C.surface : "transparent", color: C.ink, boxShadow: section === "categorias" ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>Categorías</button>
        <button onClick={() => setSection("ajustes")} className="flex-1 py-2 rounded-lg text-[12.5px] font-semibold" style={{ backgroundColor: section === "ajustes" ? C.surface : "transparent", color: C.ink, boxShadow: section === "ajustes" ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>Ajustes</button>
      </div>

      {section === "cuentas" ? (
        <>
          {editingAcc !== undefined && <CuentaForm editing={editingAcc || null} onSave={saveAccount} onCancel={() => setEditingAcc(undefined)} />}
          <Card>
            <div className="divide-y" style={{ borderColor: C.border }}>
              {accounts.map((a) => (
                <div key={a.id} className="flex items-center gap-2.5 py-2.5">
                  <div className="flex items-center justify-center rounded-lg" style={{ width: 34, height: 34, backgroundColor: a.color + "1c" }}>
                    <Icon name={a.icon} size={16} color={a.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13.5px] font-medium" style={{ color: C.ink }}>{a.name}</p>
                    <p className="text-[12px]" style={{ color: C.muted }}>{eur(accountBalance(a.id, accounts, transactions))}</p>
                  </div>
                  <button onClick={() => setEditingAcc(a)} className="p-2"><Pencil size={15} color={C.inkSoft} /></button>
                  <button onClick={() => deleteAccount(a.id)} className="p-2"><Trash2 size={15} color={C.rose} /></button>
                </div>
              ))}
            </div>
          </Card>
          {editingAcc === undefined && (
            <button onClick={() => setEditingAcc(null)} className="w-full py-3 rounded-xl text-[13.5px] font-semibold flex items-center justify-center gap-1.5" style={{ backgroundColor: "#F1F3F6", color: C.ink }}>
              <Plus size={16} /> Añadir cuenta
            </button>
          )}
        </>
      ) : section === "categorias" ? (
        <>
          <div className="flex gap-2">
            <button onClick={() => setCatType("expense")} className="flex-1 py-2 rounded-xl text-[13px] font-semibold" style={{ backgroundColor: catType === "expense" ? C.rose : "#F1F3F6", color: catType === "expense" ? "#fff" : C.inkSoft }}>Gastos</button>
            <button onClick={() => setCatType("income")} className="flex-1 py-2 rounded-xl text-[13px] font-semibold" style={{ backgroundColor: catType === "income" ? C.emerald : "#F1F3F6", color: catType === "income" ? "#fff" : C.inkSoft }}>Ingresos</button>
          </div>
          {editingCat !== undefined && <CategoriaForm editing={editingCat || null} type={catType} onSave={saveCategory} onCancel={() => setEditingCat(undefined)} />}
          <Card>
            <div className="divide-y" style={{ borderColor: C.border }}>
              {categories.filter((c) => c.type === catType).map((c) => (
                <div key={c.id} className="flex items-center gap-2.5 py-2.5">
                  <CatBadge cat={c} size={34} />
                  <span className="flex-1 text-[13.5px]" style={{ color: C.ink }}>{c.name}</span>
                  <button onClick={() => setEditingCat(c)} className="p-2"><Pencil size={15} color={C.inkSoft} /></button>
                  <button onClick={() => deleteCategory(c.id)} className="p-2"><Trash2 size={15} color={C.rose} /></button>
                </div>
              ))}
            </div>
          </Card>
          {editingCat === undefined && (
            <button onClick={() => setEditingCat(null)} className="w-full py-3 rounded-xl text-[13.5px] font-semibold flex items-center justify-center gap-1.5" style={{ backgroundColor: "#F1F3F6", color: C.ink }}>
              <Plus size={16} /> Añadir categoría
            </button>
          )}
        </>
      ) : (
        <Ajustes accounts={accounts} categories={categories} transactions={transactions}
          setAccounts={setAccounts} setCategories={setCategories} setTransactions={setTransactions}
          settings={settings} updateSettings={updateSettings} />
      )}
    </div>
  );
}

/* ---------------------------------- AJUSTES ---------------------------------- */

function SegRow({ label, options, value, onChange }) {
  return (
    <div className="mb-3 last:mb-0">
      {label && <p className="text-[12px] font-medium mb-1.5" style={{ color: C.muted }}>{label}</p>}
      <div className="flex gap-1.5 flex-wrap">
        {options.map((o) => (
          <button key={o.value} onClick={() => onChange(o.value)} className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium"
            style={{ backgroundColor: value === o.value ? C.primary : C.surfaceAlt, color: value === o.value ? "#fff" : C.inkSoft }}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Ajustes({ accounts, categories, transactions, setAccounts, setCategories, setTransactions, settings, updateSettings }) {
  const fileInputRef = React.useRef(null);

  const exportBackup = () => {
    const payload = JSON.stringify({ accounts, categories, transactions, settings, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cuenta-clara-respaldo-${isoDay(new Date())}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const header = ["Fecha", "Tipo", "Categoría", "Cuenta", "Cuenta destino", "Importe", "Nota"];
    const escapeCsv = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
    const rows = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date)).map((t) => {
      const cat = categories.find((c) => c.id === t.categoryId);
      const acc = accounts.find((a) => a.id === t.accountId);
      const toAcc = accounts.find((a) => a.id === t.toAccountId);
      const tipo = t.type === "income" ? "Ingreso" : t.type === "expense" ? "Gasto" : "Transferencia";
      const fecha = new Date(t.date).toLocaleDateString("es-ES");
      const importe = t.amount.toFixed(2).replace(".", ",");
      return [fecha, tipo, cat?.name || "", acc?.name || "", toAcc?.name || "", importe, t.note || ""].map(escapeCsv).join(";");
    });
    const csv = [header.map(escapeCsv).join(";"), ...rows].join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cuenta-clara-movimientos-${isoDay(new Date())}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const triggerImport = () => fileInputRef.current?.click();

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data.accounts || !data.categories || !data.transactions) throw new Error("Formato inválido");
        if (!window.confirm("Esto reemplazará todos tus datos actuales por los del respaldo. ¿Continuar?")) return;
        setAccounts(data.accounts);
        setCategories(data.categories);
        setTransactions(data.transactions);
        if (data.settings) updateSettings(data.settings);
        window.alert("Respaldo restaurado correctamente.");
      } catch (err) {
        window.alert("No se pudo leer el archivo de respaldo.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const resetDatabase = () => {
    if (!window.confirm("Esto borrará TODAS tus cuentas, categorías y movimientos. Esta acción no se puede deshacer. ¿Seguro que quieres continuar?")) return;
    setAccounts(DEFAULT_ACCOUNTS);
    setCategories(DEFAULT_CATEGORIES);
    setTransactions([]);
    window.alert("Base de datos reiniciada.");
  };

  return (
    <div className="space-y-3">
      <Card>
        <div className="flex items-center gap-3">
          <img src={DEV_PHOTO} alt="Juan Carlos Calderón" className="w-14 h-14 rounded-full object-cover shrink-0" style={{ border: `2px solid ${C.primarySoft}` }} />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold" style={{ color: C.ink }}>Juan Carlos Calderón</p>
            <p className="text-[12px]" style={{ color: C.muted }}>Desarrollador de Cuenta Clara</p>
            <p className="text-[11.5px] truncate" style={{ color: C.muted }}>jctecnologia.sys@gmail.com</p>
          </div>
        </div>
      </Card>

      <p className="text-[12px] font-semibold uppercase px-1" style={{ color: C.primary, letterSpacing: "0.04em" }}>Generales</p>

      <Card>
        <SectionTitle>Formato de moneda</SectionTitle>
        <p className="text-[26px] font-bold mb-3" style={{ color: C.ink, fontVariantNumeric: "tabular-nums" }}>{eur(6785)}</p>
        <SegRow label="Moneda" value={settings.currency}
          options={[{ value: "EUR", label: "€ Euro" }, { value: "USD", label: "$ Dólar" }]}
          onChange={(v) => updateSettings({ currency: v })} />
        <SegRow label="Separador" value={settings.thousands}
          options={[{ value: "en", label: "1,000.00" }, { value: "es", label: "1.000,00" }]}
          onChange={(v) => updateSettings({ thousands: v })} />
        <SegRow label="Decimales" value={settings.decimals}
          options={[{ value: 0, label: "0" }, { value: 2, label: "2" }, { value: 3, label: "3" }, { value: 4, label: "4" }]}
          onChange={(v) => updateSettings({ decimals: v })} />
        <SegRow label="Símbolo" value={settings.symbolVisible}
          options={[{ value: false, label: "Oculto" }, { value: true, label: "Visible" }]}
          onChange={(v) => updateSettings({ symbolVisible: v })} />
        <SegRow label="Posición del símbolo" value={settings.symbolSide}
          options={[{ value: "left", label: "Izquierda" }, { value: "right", label: "Derecha" }]}
          onChange={(v) => updateSettings({ symbolSide: v })} />
      </Card>

      <Card>
        <SectionTitle>Formato de fecha</SectionTitle>
        <SegRow label="Primer día de la semana" value={settings.weekStart}
          options={[{ value: "sunday", label: "Domingo" }, { value: "monday", label: "Lunes" }]}
          onChange={(v) => updateSettings({ weekStart: v })} />
      </Card>

      <Card>
        <SectionTitle>Transferencias</SectionTitle>
        <p className="text-[12.5px] mb-2" style={{ color: C.inkSoft }}>Incluye o excluye las transferencias entre cuentas de los saldos.</p>
        <SegRow label="" value={settings.includeTransfers}
          options={[{ value: true, label: "Incluir en saldos" }, { value: false, label: "Excluir de saldos" }]}
          onChange={(v) => updateSettings({ includeTransfers: v })} />
      </Card>

      <p className="text-[12px] font-semibold uppercase px-1" style={{ color: C.primary, letterSpacing: "0.04em" }}>Apariencia</p>

      <Card>
        <SectionTitle>Tema de la aplicación</SectionTitle>
        <SegRow label="" value={settings.theme}
          options={[{ value: "light", label: "☀️ Claro" }, { value: "dark", label: "🌙 Oscuro" }]}
          onChange={(v) => updateSettings({ theme: v })} />
      </Card>

      <Card>
        <SectionTitle>Botón flotante</SectionTitle>
        <SegRow label="" value={settings.fabMode}
          options={[{ value: "simple", label: "Simple" }, { value: "menu", label: "Con menú" }, { value: "oculto", label: "Ocultar" }]}
          onChange={(v) => updateSettings({ fabMode: v })} />
      </Card>

      <p className="text-[12px] font-semibold uppercase px-1" style={{ color: C.primary, letterSpacing: "0.04em" }}>Base de datos</p>

      <Card>
        <p className="text-[12.5px] mb-3" style={{ color: C.inkSoft }}>
          {accounts.length} cuentas · {categories.length} categorías · {transactions.length} movimientos guardados.
        </p>
        <div className="space-y-2">
          <button onClick={exportBackup} className="w-full py-2.5 rounded-xl text-[13px] font-semibold" style={{ border: `1.5px solid ${C.primary}`, color: C.primary }}>
            Crear respaldo
          </button>
          <button onClick={exportCSV} className="w-full py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5" style={{ border: `1.5px solid ${C.primary}`, color: C.primary }}>
            <Download size={15} /> Exportar movimientos a CSV
          </button>
          <button onClick={triggerImport} className="w-full py-2.5 rounded-xl text-[13px] font-semibold" style={{ border: `1.5px solid ${C.primary}`, color: C.primary }}>
            Restaurar respaldo
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
          <button onClick={resetDatabase} className="w-full py-2.5 rounded-xl text-[13px] font-semibold" style={{ backgroundColor: C.rose, color: "#fff" }}>
            Resetear base de datos
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------- PROFILE MENU ---------------------------------- */

function ProfileMenu({ open, onClose, tab, setTab }) {
  if (!open) return null;
  const tabs = [
    { id: "inicio", label: "Inicio", icon: LayoutGrid },
    { id: "movimientos", label: "Movimientos", icon: List },
    { id: "reportes", label: "Reportes", icon: PieIcon },
    { id: "ahorro", label: "Ahorro", icon: PiggyBank },
    { id: "mas", label: "Cuentas y categorías", icon: Settings },
  ];
  return (
    <div className="fixed inset-0 z-50 flex" style={{ backgroundColor: "rgba(15,42,74,0.5)" }} onClick={onClose}>
      <div className="w-[82%] max-w-xs h-full overflow-y-auto" style={{ backgroundColor: C.surface }} onClick={(e) => e.stopPropagation()}>
        <div style={{ backgroundColor: C.primary }} className="px-5 pt-6 pb-5 relative">
          <button onClick={onClose} className="absolute top-4 right-4"><X size={20} color="#fff" /></button>
          <img src={DEV_PHOTO} alt="Juan Carlos Calderón" className="w-20 h-20 rounded-full object-cover"
            style={{ border: "3px solid rgba(255,255,255,0.6)" }} />
          <p className="text-white font-bold text-[16px] mt-3 leading-tight">Juan Carlos Calderón</p>
          <p className="text-[12.5px]" style={{ color: "#DCE9FF" }}>Desarrollador de Cuenta Clara</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Mail size={12.5} color="#DCE9FF" />
            <span className="text-[11.5px]" style={{ color: "#DCE9FF" }}>jctecnologia.sys@gmail.com</span>
          </div>
        </div>

        <div className="px-5 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Code2 size={14} color={C.primary} />
            <span className="text-[12px] font-semibold uppercase" style={{ color: C.primary, letterSpacing: "0.04em" }}>Sobre mí</span>
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: C.inkSoft }}>
            Fanático del desarrollo web y de las nuevas tecnologías. Me gusta diseñar y programar aplicaciones
            claras y útiles para el día a día, y sigo de cerca todo lo que va surgiendo en el mundo tech.
          </p>
        </div>

        <div className="py-2">
          {tabs.map((t) => {
            const Icn = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => { setTab(t.id); onClose(); }}
                className="w-full flex items-center gap-3 px-5 py-3"
                style={{ backgroundColor: active ? C.primarySoft : "transparent" }}>
                <Icn size={18} color={active ? C.primary : C.inkSoft} />
                <span className="text-[14px] font-medium" style={{ color: active ? C.primary : C.ink }}>{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="px-5 py-4 mt-2" style={{ borderTop: `1px solid ${C.border}` }}>
          <p className="text-[11px] text-center" style={{ color: C.muted }}>Cuenta Clara · hecho por Juan Carlos Calderón</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- APP ---------------------------------- */

export default function App() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState(DEFAULT_ACCOUNTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [transactions, setTransactions] = useState([]);
  const [tab, setTab] = useState("inicio");
  const [accountFilter, setAccountFilter] = useState("all");
  const [dashPeriod, setDashPeriod] = useState({ type: "month", anchor: new Date() });
  const [modal, setModal] = useState({ open: false, editing: null, defaultType: "expense" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [fabExpanded, setFabExpanded] = useState(false);
  const [sim, setSim] = useState({ initial: "0", monthly: "100", rate: "0", mode: "goal", goal: "1000", months: "12" });
  const [settings, setSettings] = useState({
    decimals: 2, thousands: "es", symbolVisible: true, symbolSide: "right",
    weekStart: "monday", dateOrder: "dmy", includeTransfers: true,
    theme: "light", fabMode: "simple", currency: "EUR",
  });

  useEffect(() => {
    (async () => {
      try {
        const a = await window.storage.get("accounts");
        setAccounts(JSON.parse(a.value));
      } catch { await safeSet("accounts", DEFAULT_ACCOUNTS); }
      try {
        const c = await window.storage.get("categories");
        setCategories(JSON.parse(c.value));
      } catch { await safeSet("categories", DEFAULT_CATEGORIES); }
      try {
        const t = await window.storage.get("transactions");
        setTransactions(JSON.parse(t.value));
      } catch { const seed = seedTransactions(); setTransactions(seed); await safeSet("transactions", seed); }
      try {
        const s = await window.storage.get("savings-sim");
        setSim(JSON.parse(s.value));
      } catch { /* keep defaults */ }
      try {
        const st = await window.storage.get("settings");
        const loaded = { currency: "EUR", ...JSON.parse(st.value) };
        setSettings(loaded);
        applyTheme(loaded.theme === "dark");
        applyFormatSettings(loaded);
      } catch { /* keep defaults */ }
      setLoading(false);
    })();
  }, []);

  const safeSet = async (key, val) => { try { await window.storage.set(key, JSON.stringify(val)); } catch (e) { console.error(e); } };

  useEffect(() => { if (!loading) safeSet("accounts", accounts); }, [accounts, loading]);
  useEffect(() => { if (!loading) safeSet("categories", categories); }, [categories, loading]);
  useEffect(() => { if (!loading) safeSet("transactions", transactions); }, [transactions, loading]);
  useEffect(() => { if (!loading) safeSet("savings-sim", sim); }, [sim, loading]);
  useEffect(() => { if (!loading) safeSet("settings", settings); }, [settings, loading]);

  // Settings mutate the module-level C/FMT objects synchronously so every
  // component picks up the change on the next render triggered by setSettings.
  const updateSettings = useCallback((partial) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      applyTheme(next.theme === "dark");
      applyFormatSettings(next);
      return next;
    });
  }, []);

  const openAdd = useCallback((defaultType = "expense") => setModal({ open: true, editing: null, defaultType }), []);
  const openEdit = useCallback((tx) => setModal({ open: true, editing: tx, defaultType: tx.type }), []);
  const closeModal = () => setModal({ open: false, editing: null, defaultType: "expense" });

  const saveTx = (tx) => {
    setTransactions((prev) => modal.editing ? prev.map((t) => t.id === tx.id ? tx : t) : [...prev, tx]);
    closeModal();
  };
  const deleteTx = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    closeModal();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.bg }}>
        <div className="flex flex-col items-center gap-2 animate-pulse">
          <LogoMark size={44} />
          <span className="text-[13px]" style={{ color: C.muted }}>Cargando…</span>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "inicio", label: "Inicio", icon: LayoutGrid },
    { id: "movimientos", label: "Movimientos", icon: List },
    { id: "reportes", label: "Reportes", icon: PieIcon },
    { id: "ahorro", label: "Ahorro", icon: PiggyBank },
    { id: "mas", label: "Más", icon: Settings },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <div className="max-w-md mx-auto min-h-screen relative" style={{ backgroundColor: C.bg }}>

        <header className="sticky top-0 z-30 px-4 pt-4 pb-3" style={{ backgroundColor: C.primary }}>
          <div className="flex items-center gap-2.5">
            <LogoMark size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-white leading-tight">Cuenta Clara</p>
              <p className="text-[10.5px] leading-snug" style={{ color: "#DCE9FF" }}>Desarrollado por: Juan Carlos Calderón</p>
            </div>
            <button onClick={() => setMenuOpen(true)} className="p-2 -mr-1.5 shrink-0" aria-label="Abrir menú">
              <Menu size={22} color="#fff" />
            </button>
          </div>
        </header>

        <main className="px-4 pt-4" style={{ paddingBottom: 96 }}>
          {tab === "inicio" && (
            <Inicio accounts={accounts} categories={categories} transactions={transactions}
              period={dashPeriod} setPeriod={setDashPeriod}
              accountFilter={accountFilter} setAccountFilter={setAccountFilter}
              openAdd={openAdd} openEdit={openEdit} />
          )}
          {tab === "movimientos" && (
            <Movimientos accounts={accounts} categories={categories} transactions={transactions}
              accountFilter={accountFilter} setAccountFilter={setAccountFilter} openEdit={openEdit} />
          )}
          {tab === "reportes" && (
            <Reportes accounts={accounts} categories={categories} transactions={transactions}
              accountFilter={accountFilter} setAccountFilter={setAccountFilter} />
          )}
          {tab === "ahorro" && <Ahorro sim={sim} setSim={setSim} />}
          {tab === "mas" && (
            <Mas accounts={accounts} setAccounts={setAccounts} categories={categories} setCategories={setCategories}
              transactions={transactions} setTransactions={setTransactions} settings={settings} updateSettings={updateSettings} />
          )}
        </main>

        {settings.fabMode !== "oculto" && (
          <>
            {settings.fabMode === "menu" && fabExpanded && (
              <div className="fixed z-40 flex flex-col items-end gap-2.5" style={{ bottom: 148, right: "calc(50% - 210px)" }}>
                {[
                  { type: "transfer", label: "Transferencia", color: C.blue, Icn: ArrowLeftRight },
                  { type: "income", label: "Ingreso", color: C.emerald, Icn: ArrowUpRight },
                  { type: "expense", label: "Gasto", color: C.rose, Icn: ArrowDownRight },
                ].map((o) => (
                  <button key={o.type} onClick={() => { openAdd(o.type); setFabExpanded(false); }}
                    className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-full shadow-lg" style={{ backgroundColor: "#fff", border: `1px solid ${C.border}` }}>
                    <div className="flex items-center justify-center rounded-full" style={{ width: 26, height: 26, backgroundColor: o.color }}>
                      <o.Icn size={14} color="#fff" />
                    </div>
                    <span className="text-[12.5px] font-semibold" style={{ color: C.ink }}>{o.label}</span>
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => settings.fabMode === "menu" ? setFabExpanded((v) => !v) : openAdd()}
              className="fixed z-40 flex items-center justify-center rounded-full shadow-lg"
              style={{ width: 56, height: 56, backgroundColor: C.primary, bottom: 84, right: "calc(50% - 210px)", transform: fabExpanded ? "rotate(45deg)" : "none", transition: "transform 0.15s" }}>
              <Plus size={26} color="#fff" strokeWidth={2.5} />
            </button>
          </>
        )}

        <ProfileMenu open={menuOpen} onClose={() => setMenuOpen(false)} tab={tab} setTab={setTab} />

        <nav className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto" style={{ backgroundColor: "#fff", borderTop: `1px solid ${C.border}` }}>
          <div className="flex items-stretch">
            {tabs.map((t) => {
              const Icn = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} className="flex-1 flex flex-col items-center gap-0.5 py-2.5">
                  <Icn size={20} color={active ? C.ink : C.muted} strokeWidth={active ? 2.4 : 2} />
                  <span className="text-[10.5px] font-medium" style={{ color: active ? C.ink : C.muted }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <TxModal open={modal.open} onClose={closeModal} onSave={saveTx} onDelete={deleteTx}
          accounts={accounts} categories={categories} editing={modal.editing} defaultType={modal.defaultType} />
      </div>
    </div>
  );
}
