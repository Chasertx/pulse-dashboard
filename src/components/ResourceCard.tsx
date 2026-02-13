// Asset and type imports for resource visualization
import { Cloud, Database, Globe, Server } from 'lucide-react';
import type { AzureResource } from '../types/pulse';

export const ResourceCard = ({ resource }: { resource: AzureResource }) => {
  const { name, type, latestPulse } = resource;

  // Determines the icon based on the Azure resource category
  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('containerapps')) return <Server className="text-blue-400" />;
    if (t.includes('staticsites')) return <Globe className="text-emerald-400" />;
    if (t.includes('flexibleservers')) return <Database className="text-purple-400" />;
    return <Cloud className="text-slate-400" />;
  };

  return (
    // Card container with hover effects and dark theme styling
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/50 transition-all">
      <div className="flex justify-between items-center mb-6">
        {/* Resource-specific icon display */}
        <div className="p-2 bg-slate-800 rounded-lg">{getIcon(type)}</div>
        {/* Visual pulse indicator shown only when live data exists */}
        {latestPulse && (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        )}
      </div>

      {/* Resource name and truncated type descriptor */}
      <h3 className="text-lg font-bold text-white truncate">{name}</h3>
      <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
        {type.split('/').pop()}
      </p>

      {/* Main metric display with conditional unit labeling */}
      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-4xl font-mono font-bold text-white">
          {latestPulse ? latestPulse.value.toFixed(1) : '--'}
        </span>
        <span className="text-slate-500 text-sm">
          {type.toLowerCase().includes('staticsites') ? 'req/m' : '% CPU'}
        </span>
      </div>
    </div>
  );
};