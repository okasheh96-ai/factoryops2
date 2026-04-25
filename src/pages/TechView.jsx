import { useMemo, useState } from 'react';
import GlassCard from '../components/GlassCard';
import { useAppStore } from '../store/useAppStore';

export default function TechView() {
  const { workOrders, parts, completeTechJob } = useAppStore();
  const jobs = useMemo(() => workOrders.filter(w => w.technician === 'tech' && w.status !== 'Closed'), [workOrders]);
  const [selected, setSelected] = useState(jobs[0]);
  const [loto, setLoto] = useState([false, false, false]);
  const [partNo, setPartNo] = useState(parts[0]?.partNo || '');
  const [notes, setNotes] = useState('');

  const allChecked = loto.every(Boolean);
  return (
    <div className="min-h-screen bg-bg flex justify-center p-2 text-slate-100">
      <div className="w-full max-w-[430px] space-y-3">
        <GlassCard>
          <div className="flex justify-between"><h2 className="font-semibold">My Jobs Today</h2><span className="text-slate-400">⟳ Offline</span></div>
          <div className="space-y-2 mt-2">
            {jobs.map(j => (
              <button key={j.id} onClick={() => setSelected(j)} className="w-full text-left p-2 rounded bg-slate-900/40 border border-white/10">
                <div className="flex justify-between"><span>{j.id} · {j.machine}</span><span>{j.priority}</span></div>
                <div className="text-xs text-slate-300">{j.zone} • {j.jobType} • due {j.dueTime} • {j.partsNeeded}</div>
              </button>
            ))}
          </div>
        </GlassCard>
        {selected && <GlassCard>
          <h3 className="font-semibold">Execution: {selected.id}</h3>
          <p className="text-sm text-slate-300 mb-2">Mandatory LOTO checklist</p>
          {['Power isolated', 'Tag applied', 'Supervisor verified'].map((l, i) => (
            <label key={l} className="flex gap-2 text-sm"><input type="checkbox" checked={loto[i]} onChange={() => setLoto(s => s.map((v, idx) => idx === i ? !v : v))} />{l}</label>
          ))}
          <div className="mt-2 text-sm">Parts used</div>
          <select value={partNo} onChange={(e) => setPartNo(e.target.value)} className="w-full bg-slate-900/60 border border-white/10 rounded p-2">
            {parts.map(p => <option key={p.partNo} value={p.partNo}>{p.partNo} - {p.partName}</option>)}
          </select>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" className="w-full mt-2 bg-slate-900/60 border border-white/10 rounded p-2" />
          <button disabled={!allChecked} onClick={() => completeTechJob(selected.id, partNo, notes)} className="w-full mt-2 py-2 rounded bg-electric disabled:bg-slate-600">Mark Complete</button>
        </GlassCard>}
      </div>
    </div>
  );
}
