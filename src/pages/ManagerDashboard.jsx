import { useMemo, useState } from 'react';
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import GlassCard from '../components/GlassCard';
import Layout from '../components/Layout';
import { useAppStore } from '../store/useAppStore';

function KPIBar() {
  const kpis = [
    ['MTBF', '126 h'], ['MTTR', '3.6 h'], ['PM%', '67%'], ['OEE', '83%'], ['Parts Availability', '91%'], ['Cost This Month', '12,410 JOD'],
  ];
  return <div className="grid md:grid-cols-6 gap-2">{kpis.map(k => <GlassCard key={k[0]}><div className="text-xs text-slate-400">{k[0]}</div><div className="text-lg font-bold">{k[1]}</div></GlassCard>)}</div>;
}

function WorkOrderBoard({ readOnly }) {
  const { stages, workOrders, moveWO, priorityColors } = useAppStore();
  return <GlassCard><h3 className="font-semibold mb-2">Kanban Pipeline</h3><div className="grid md:grid-cols-6 gap-2 overflow-x-auto">{stages.map(s => (
    <div key={s} className="min-w-44 bg-slate-900/40 rounded p-2"><div className="text-sm mb-1">{s}</div>{workOrders.filter(w => w.stage === s).map(w => (
      <div key={w.id} className="p-2 rounded mb-2 border border-white/10" style={{ borderLeft: `4px solid ${priorityColors[w.priority]}` }}>
        <div className="text-xs">{w.id} · {w.machine}</div><div className="text-[11px] text-slate-300">{w.technician} · {w.priority} · {w.ageHrs}h</div>
        {!readOnly && <select className="w-full mt-1 text-xs bg-slate-800" value={w.stage} onChange={(e) => {
          if (e.target.value === 'In Progress' && w.cost > 500 && w.stage !== 'Waiting for Parts') return alert('Approval required');
          moveWO(w.id, e.target.value);
        }}>{stages.map(st => <option key={st}>{st}</option>)}</select>}
      </div>
    ))}</div>
  ))}</div></GlassCard>;
}

function MachinesTable() {
  const { machines } = useAppStore();
  return <GlassCard className="overflow-auto"><h3 className="font-semibold mb-2">Machine Register</h3><table className="w-full text-xs"><thead><tr className="text-slate-400"><th>ID</th><th>Name</th><th>Zone</th><th>Model</th><th>Serial</th><th>Last</th><th>Next PM</th><th>Status</th><th>Cost YTD</th><th>QR</th></tr></thead><tbody>{machines.map(m => <tr key={m.id} className="border-t border-white/10"><td>{m.id}</td><td>{m.name}</td><td>{m.zone}</td><td>{m.model}</td><td>{m.serial}</td><td>{m.lastService}</td><td>{m.nextPM}</td><td>{m.status}</td><td>{m.costYtd}</td><td>🔳</td></tr>)}</tbody></table></GlassCard>;
}

function InventoryTable() {
  const { parts, events } = useAppStore();
  const low = parts.filter(p => p.stock < p.min);
  return <GlassCard><h3 className="font-semibold mb-2">Spare Parts Inventory</h3><table className="w-full text-xs"><thead><tr className="text-slate-400"><th>Part No.</th><th>Name</th><th>Machine</th><th>Stock</th><th>Min</th><th>Cost</th><th>Supplier</th></tr></thead><tbody>{parts.map(p => <tr key={p.partNo} className="border-t border-white/10"><td>{p.partNo}</td><td>{p.partName}</td><td>{p.linked}</td><td className={p.stock < p.min ? 'text-red-300' : ''}>{p.stock} {p.stock < p.min && '⚠'}</td><td>{p.min}</td><td>{p.unitCost}</td><td>{p.supplier}</td></tr>)}</tbody></table><p className="text-xs mt-2 text-red-300">Auto-PO drafted for {low.length} breached parts. {events.length > 0 && ''}</p></GlassCard>;
}

function Reports() {
  const { costHistory, workOrders, machines } = useAppStore();
  const woData = ['Assigned', 'Accepted', 'Waiting for Parts', 'In Progress', 'QC Review', 'Closed'].map(s => ({ name: s, value: workOrders.filter(w => w.stage === s).length }));
  const prData = [{ name: 'Planned', value: 67 }, { name: 'Reactive', value: 33 }];
  const mtbf = costHistory.map((r, i) => ({ month: r.month, mtbf: 110 + i * 5 }));
  return <GlassCard><h3 className="font-semibold mb-2">Reporting Dashboard</h3><div className="grid md:grid-cols-2 gap-3 h-[440px]">
    <ResponsiveContainer><LineChart data={costHistory}><XAxis dataKey="month"/><YAxis/><Tooltip/><Line type="monotone" dataKey="HP01" stroke="#3B82F6"/><Line type="monotone" dataKey="CNC03" stroke="#22C55E"/></LineChart></ResponsiveContainer>
    <ResponsiveContainer><BarChart data={woData}><XAxis dataKey="name" hide/><YAxis/><Tooltip/><Bar dataKey="value">{woData.map((e, i) => <Cell key={i} fill={['#3B82F6','#22C55E','#EAB308','#F97316','#EF4444','#60A5FA'][i]} />)}</Bar></BarChart></ResponsiveContainer>
    <ResponsiveContainer><PieChart><Pie data={prData} dataKey="value" innerRadius={50} outerRadius={80} fill="#3B82F6" label/></PieChart></ResponsiveContainer>
    <ResponsiveContainer><LineChart data={mtbf}><XAxis dataKey="month"/><YAxis/><Tooltip/><Line dataKey="mtbf" stroke="#F97316"/></LineChart></ResponsiveContainer>
  </div><div className="text-xs text-slate-400">Filtered for: {machines[0].name} · Last 6 months</div></GlassCard>;
}

function BigLine() {
  const { events } = useAppStore();
  const [filter, setFilter] = useState('all');
  const rows = filter === 'all' ? events : events.filter(e => e.type === filter);
  const types = ['all', ...new Set(events.map(e => e.type))];
  return <GlassCard><div className="flex justify-between items-center"><h3 className="font-semibold">The Big Line — Live Audit Trail</h3><select className="text-xs bg-slate-900" value={filter} onChange={e => setFilter(e.target.value)}>{types.map(t => <option key={t}>{t}</option>)}</select></div>
  <div className="max-h-40 overflow-auto mt-2 space-y-1">{rows.map((e, idx) => <div key={e.id} className={`text-xs p-1 rounded ${idx < 3 ? 'animate-flash' : ''}`}><span className="text-slate-400">{new Date(e.ts).toLocaleString()}</span> · <b>{e.actor}</b> · {e.action}</div>)}</div></GlassCard>;
}

function ERPPanel({ readOnly }) {
  const { erpRows, simulateSync } = useAppStore();
  return <GlassCard><div className="flex justify-between"><h3 className="font-semibold">ERP Integration Panel</h3>{!readOnly && <button onClick={simulateSync} className="px-2 py-1 bg-electric rounded text-xs">Simulate Sync</button>}</div>
  <p className="text-xs text-slate-400">Compatible with SAP · Oracle · Dynamics · Odoo</p>
  <table className="w-full text-xs mt-2"><thead><tr className="text-slate-400"><th>Type</th><th>Ref</th><th>Status</th></tr></thead><tbody>{erpRows.map(r => <tr key={r.id} className="border-t border-white/10"><td>{r.type}</td><td>{r.ref}</td><td>{r.status === 'Synced' ? 'Synced ✓' : 'Pending ⟳'}</td></tr>)}</tbody></table></GlassCard>;
}

function JoFotara({ readOnly }) {
  const { invoices } = useAppStore();
  return <GlassCard><h3 className="font-semibold">JoFotara Compliance Engine — Jordan VAT 16%</h3>
  <table className="w-full text-xs mt-2"><thead><tr className="text-slate-400"><th>Invoice</th><th>Date</th><th>Machine</th><th>Tech</th><th>Part</th><th>Labor h</th><th>Subtotal</th><th>VAT</th><th>Total</th></tr></thead><tbody>{invoices.map(i => <tr key={i.id} className="border-t border-white/10"><td>{i.id}</td><td>{i.date}</td><td>{i.machine}</td><td>{i.technician}</td><td>{i.partNo}</td><td>{i.laborHours}</td><td>{i.subtotal}</td><td>{i.vat}</td><td>{i.total}</td></tr>)}</tbody></table>
  {!readOnly && <button className="mt-2 px-2 py-1 rounded border border-white/20 text-xs">Export CSV</button>}</GlassCard>;
}

export default function ManagerDashboard({ ownerMode = false }) {
  const readOnly = ownerMode;
  return <Layout readOnly={readOnly}><div className="space-y-3">
    {ownerMode && <GlassCard className="grid md:grid-cols-3 gap-2"><div><div className="text-xs text-slate-400">Sahab Plant</div><div className="text-lg">OEE 84%</div></div><div><div className="text-xs text-slate-400">Russeifa Plant</div><div className="text-lg">OEE 81%</div></div><div><div className="text-xs text-slate-400">P&L Spend vs Budget</div><div className="text-lg">62,300 / 90,000 JOD</div></div></GlassCard>}
    <KPIBar />
    <WorkOrderBoard readOnly={readOnly} />
    <MachinesTable />
    <GlassCard><h3 className="font-semibold mb-2">PM Scheduler</h3><div className="grid md:grid-cols-7 gap-2 text-xs">{Array.from({ length: 14 }).map((_, i) => <div key={i} className={`p-2 rounded border ${i % 5 === 0 ? 'border-red-400 text-red-300' : 'border-white/10'}`}>2026-05-{10 + i}<br/>PM · {i % 3 ? 'Due' : 'Overdue'}</div>)}</div></GlassCard>
    <InventoryTable />
    <Reports />
    <ERPPanel readOnly={readOnly} />
    <JoFotara readOnly={readOnly} />
    <BigLine />
  </div></Layout>;
}
