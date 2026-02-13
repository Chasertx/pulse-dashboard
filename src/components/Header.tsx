// Icons for visual branding and navigation
import { Activity, ShieldCheck } from 'lucide-react';

export const Header = () => (
  // Main navigation bar with dark slate styling
  <header className="flex items-center justify-between px-8 py-4 bg-slate-900 border-b border-slate-800">
    {/* Brand identity section */}
    <div className="flex items-center gap-2">
      <Activity className="text-blue-500" />
      <span className="text-white font-bold tracking-tighter uppercase">Pulse Dashboard</span>
    </div>
    
    {/* Navigation actions for system management */}
    <div className="flex gap-4">
      <button className="px-4 py-2 text-sm text-slate-300 bg-slate-800 rounded hover:bg-slate-700 transition">
        Logs
      </button>
      {/* Primary action for administrative controls */}
      <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-500 transition">
        <ShieldCheck size={16} />
        Admin
      </button>
    </div>
  </header>
);