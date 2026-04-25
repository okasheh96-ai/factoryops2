import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TechView from './pages/TechView';
import ManagerDashboard from './pages/ManagerDashboard';
import { useAppStore } from './store/useAppStore';

function ProtectedApp() {
  const user = useAppStore((s) => s.user);
  if (!user) return <Navigate to="/" replace />;
  if (user.role === 'tech') return <TechView />;
  if (user.role === 'owner') return <ManagerDashboard ownerMode />;
  return <ManagerDashboard />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/app" element={<ProtectedApp />} />
    </Routes>
  );
}
