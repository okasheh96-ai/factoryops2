import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';

export default function Layout({ children, readOnly = false }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang, setLang, logout, rtl, user } = useAppStore();
  const menus = ['dashboard', 'workOrders', 'machines', 'inventory', 'reports', 'settings'];

  const flip = () => {
    const next = lang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(next);
    setLang(next);
  };

  return (
    <div className="min-h-screen bg-bg text-slate-100" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="flex">
        <aside className="w-64 p-4 border-r border-white/10 min-h-screen hidden md:block">
          <h1 className="text-xl font-bold text-electric">FactoryOps</h1>
          <p className="text-xs text-slate-400 mt-1">{user?.name}</p>
          <nav className="mt-6 space-y-2">
            {menus.map((m) => <Link key={m} to="#" className="block px-3 py-2 rounded-lg hover:bg-white/10">{t(m)}</Link>)}
          </nav>
          <button onClick={() => { logout(); navigate('/'); }} className="mt-8 text-sm text-red-300">{t('logout')}</button>
        </aside>
        <main className="flex-1 p-4 md:p-6 animate-[fade_0.2s_ease]">
          <header className="flex justify-between items-center mb-4">
            <div>{readOnly && <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-400 text-red-200">{t('executiveReadOnly')}</span>}</div>
            <button onClick={flip} className="px-3 py-1 border border-white/20 rounded-lg">EN | عربي</button>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
