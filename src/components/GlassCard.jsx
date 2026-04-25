export default function GlassCard({ children, className = '' }) {
  return <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 ${className}`}>{children}</div>;
}
