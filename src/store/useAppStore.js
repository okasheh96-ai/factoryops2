import { create } from 'zustand';

const users = {
  owner: { role: 'owner', password: 'owner123', name: 'Factory Owner' },
  manager: { role: 'manager', password: 'mgr123', name: 'Plant Manager' },
  tech: { role: 'tech', password: 'tech123', name: 'Technician' },
};

const priorityColors = {
  Critical: '#EF4444',
  High: '#F97316',
  Medium: '#EAB308',
  Low: '#22C55E',
};

const stages = ['Assigned', 'Accepted', 'Waiting for Parts', 'In Progress', 'QC Review', 'Closed'];

const machines = [
  ['M-HP01', 'Hydraulic Press HP-01', 'Sahab Zone A', 'HP500', 'SN-HP-101'],
  ['M-CNC03', 'CNC Lathe CNC-03', 'Russeifa Zone B', 'CNC-900', 'SN-CNC-303'],
  ['M-AC02', 'Air Compressor AC-02', 'Sahab Zone A', 'ACX-2', 'SN-AC-202'],
  ['M-CB05', 'Conveyor Belt CB-05', 'Russeifa Zone C', 'CB-77', 'SN-CB-505'],
  ['M-IM01', 'Injection Molder IM-01', 'Sahab Zone B', 'IM-Pro', 'SN-IM-111'],
  ['M-CH02', 'Industrial Chiller CH-02', 'Russeifa Zone A', 'CH-42', 'SN-CH-222'],
  ['M-WR04', 'Welding Robot WR-04', 'Sahab Zone C', 'WR-A1', 'SN-WR-404'],
  ['M-PL01', 'Packaging Line PL-01', 'Russeifa Zone B', 'PL-Max', 'SN-PL-101'],
].map((m, idx) => ({
  id: m[0], name: m[1], zone: m[2], model: m[3], serial: m[4],
  lastService: `2026-0${(idx % 4) + 1}-0${(idx % 8) + 1}`,
  nextPM: `2026-0${(idx % 4) + 5}-1${(idx % 8)}`,
  status: idx % 3 ? 'Running' : 'Needs Service',
  costYtd: 1200 + idx * 350,
}));

const workOrders = Array.from({ length: 15 }).map((_, i) => ({
  id: `WO-${1001 + i}`,
  machine: machines[i % 8].name,
  zone: machines[i % 8].zone,
  technician: i % 2 ? 'tech' : 'team-a',
  priority: ['Critical', 'High', 'Medium', 'Low'][i % 4],
  stage: stages[i % 6],
  ageHrs: 2 + i * 3,
  cost: i === 3 ? 730 : 90 + i * 35,
  jobType: i % 2 ? 'Preventive' : 'Corrective',
  dueTime: `${8 + (i % 8)}:00`,
  partsNeeded: ['Hydraulic Seal Kit', 'Belt B-220', 'Coolant Filter'][i % 3],
  loto: [false, false, false],
  startedAt: null,
  completedAt: null,
  notes: '',
  status: i % 6 === 5 ? 'Closed' : 'Open',
}));

const parts = [
  ['P-101', 'Hydraulic Seal Kit', 'Hydraulic Press HP-01', 3, 5, 24, 'Jordan Industrial Supply'],
  ['P-102', 'Drive Belt B-220', 'Conveyor Belt CB-05', 7, 6, 12, 'Amman Motion Co'],
  ['P-103', 'CNC Coolant Filter', 'CNC Lathe CNC-03', 2, 4, 18, 'Levant Filtration'],
  ['P-104', 'Air Intake Filter', 'Air Compressor AC-02', 18, 8, 10, 'Petra Parts'],
  ['P-105', 'Nozzle Pack', 'Injection Molder IM-01', 4, 4, 22, 'Jordan Molding Tech'],
  ['P-106', 'Refrigerant Valve', 'Industrial Chiller CH-02', 9, 5, 33, 'Aqaba Cooling'],
  ['P-107', 'Weld Tip Set', 'Welding Robot WR-04', 21, 10, 15, 'RoboWeld MENA'],
  ['P-108', 'Photo Sensor', 'Packaging Line PL-01', 6, 6, 19, 'Arab Automation'],
  ['P-109', 'Motor Coupling', 'Packaging Line PL-01', 1, 3, 28, 'Amman Motion Co'],
  ['P-110', 'Bearing Set', 'Conveyor Belt CB-05', 14, 7, 16, 'Jordan Industrial Supply'],
].map(p => ({ partNo: p[0], partName: p[1], linked: p[2], stock: p[3], min: p[4], unitCost: p[5], supplier: p[6] }));

const events = [
  'WO created', 'part deducted', 'PM triggered', 'stock threshold breached', 'PO drafted', 'job completed',
].flatMap((type, i) => Array.from({ length: 4 }).map((_, j) => ({
  id: `${i}-${j}`,
  ts: new Date(Date.now() - (i * 4 + j) * 3600000).toISOString(),
  actor: j % 2 ? 'manager' : 'system',
  type,
  action: `${type} for WO-${1020 - i * 3 - j}`,
})));

const monthly = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
const costHistory = monthly.map((m, idx) => ({ month: m, HP01: 320 + idx * 20, CNC03: 180 + idx * 13, AC02: 120 + idx * 9, CB05: 210 + idx * 11 }));

const base = {
  user: null,
  lang: localStorage.getItem('lang') || 'en',
  rtl: localStorage.getItem('lang') === 'ar',
  users,
  priorityColors,
  stages,
  machines,
  workOrders,
  parts,
  events,
  costHistory,
  invoices: [],
  erpRows: [
    { id: 1, type: 'Work Order Cost Posting', ref: 'WO-1003', status: 'Pending' },
    { id: 2, type: 'Parts Consumed', ref: 'P-103', status: 'Pending' },
    { id: 3, type: 'Purchase Order', ref: 'PO-DRAFT-11', status: 'Synced' },
    { id: 4, type: 'Stock Level Update', ref: 'Inventory Batch #A7', status: 'Pending' },
  ],
};

export const useAppStore = create((set, get) => ({
  ...base,
  login: (username, password) => {
    const u = users[username];
    if (u && u.password === password) {
      set({ user: { username, ...u } });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null }),
  setLang: (lang) => {
    localStorage.setItem('lang', lang);
    set({ lang, rtl: lang === 'ar' });
  },
  moveWO: (id, nextStage) => set((s) => {
    const currentIdx = s.stages.indexOf(s.workOrders.find(w => w.id === id)?.stage);
    const nextIdx = s.stages.indexOf(nextStage);
    if (nextIdx <= currentIdx) return s;
    return {
      workOrders: s.workOrders.map(w => w.id === id ? { ...w, stage: nextStage, status: nextStage === 'Closed' ? 'Closed' : w.status } : w),
      events: [{ id: crypto.randomUUID(), ts: new Date().toISOString(), actor: s.user?.username || 'manager', type: 'WO stage moved', action: `${id} -> ${nextStage}` }, ...s.events],
    };
  }),
  completeTechJob: (id, partNo, notes) => set((s) => {
    const wo = s.workOrders.find(w => w.id === id);
    if (!wo) return s;
    const updatedParts = s.parts.map(p => p.partNo === partNo ? { ...p, stock: Math.max(p.stock - 1, 0) } : p);
    const laborHours = ((Date.now() - new Date(wo.startedAt || Date.now() - 3600000).getTime()) / 3600000).toFixed(1);
    const partCost = updatedParts.find(p => p.partNo === partNo)?.unitCost || 0;
    const subtotal = partCost + Number(laborHours) * 12;
    const vat = subtotal * 0.16;
    const total = subtotal + vat;
    const invoice = {
      id: `INV-${1000 + s.invoices.length + 1}`,
      date: new Date().toISOString().slice(0, 10),
      machine: wo.machine,
      technician: wo.technician,
      partNo,
      laborHours,
      subtotal: subtotal.toFixed(2),
      vat: vat.toFixed(2),
      total: total.toFixed(2),
    };
    return {
      parts: updatedParts,
      invoices: [...s.invoices, invoice],
      workOrders: s.workOrders.map(w => w.id === id ? { ...w, notes, completedAt: new Date().toISOString(), stage: 'Closed', status: 'Closed' } : w),
      events: [
        { id: crypto.randomUUID(), ts: new Date().toISOString(), actor: 'tech', type: 'job completed', action: `${id} completed with ${partNo}` },
        { id: crypto.randomUUID(), ts: new Date().toISOString(), actor: 'system', type: 'part deducted', action: `${partNo} stock decremented` },
        ...s.events,
      ],
    };
  }),
  simulateSync: () => set((s) => ({ erpRows: s.erpRows.map(r => ({ ...r, status: 'Synced' })) })),
}));
