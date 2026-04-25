import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import GlassCard from '../components/GlassCard';

export default function LoginPage() {
  const [username, setUsername] = useState('manager');
  const [password, setPassword] = useState('mgr123');
  const [error, setError] = useState('');
  const login = useAppStore((s) => s.login);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) return setError('Invalid credentials');
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 text-slate-100">
      <GlassCard className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-electric">FactoryOps</h1>
        <p className="text-slate-300 text-sm mb-4">Jordan-ready CMMS + ERP Prototype</p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-900/60 border border-white/10 rounded p-2" placeholder="Username" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900/60 border border-white/10 rounded p-2" placeholder="Password" />
          {error && <p className="text-red-300 text-sm">{error}</p>}
          <button className="w-full bg-electric py-2 rounded font-semibold">Login</button>
        </form>
        <div className="text-xs text-slate-400 mt-4 space-y-1">
          <p>owner / owner123</p>
          <p>manager / mgr123</p>
          <p>tech / tech123</p>
        </div>
      </GlassCard>
    </div>
  );
}
