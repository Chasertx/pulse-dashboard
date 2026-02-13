import { useEffect, useState } from 'react';
import { Cloud, Database, Globe, Server } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import api from '../api/axios';
import type { AzureResource, PulseMetric } from '../types/pulse';

export const ResourceCard = ({ resource }: { resource: AzureResource }) => {
  const { id, name, type, latestPulse } = resource;
  const [history, setHistory] = useState<PulseMetric[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const encodedId = encodeURIComponent(encodeURIComponent(id));
        const { data } = await api.get(`/dashboard/metrics/${encodedId}`);
        setHistory(data);
      } catch (err) {
        if (Math.random() > 0.8) console.warn(`Retry skip for ${name}`);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 20000);
    return () => clearInterval(interval);
  }, [id, name]);

  const getMetricContext = () => {
    const t = type.toLowerCase();
    if (t.includes('staticsites')) return { label: 'Requests', unit: 'req/m', icon: <Globe className="text-emerald-400" /> };
    if (t.includes('flexibleservers')) return { label: 'Utilization', unit: '%', icon: <Database className="text-purple-400" /> };
    if (t.includes('containerapps')) return { label: 'CPU Usage', unit: '%', icon: <Server className="text-blue-400" /> };
    return { label: 'Usage', unit: '%', icon: <Cloud className="text-slate-400" /> };
  };

  const { label, unit, icon } = getMetricContext();
  const displayValue = history.length > 0 ? history[history.length - 1].value : (latestPulse?.value ?? 0);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/50 transition-all flex flex-col h-full shadow-lg group">
      <div className="flex justify-between items-center mb-4">
        <div className="p-2 bg-slate-800 rounded-lg">{icon}</div>
        <span className="relative flex h-3 w-3">
          <span className={`animate-ping absolute h-full w-full rounded-full opacity-75 ${displayValue > 0 ? 'bg-green-400' : 'bg-slate-600'}`}></span>
          <span className={`relative rounded-full h-3 w-3 ${displayValue > 0 ? 'bg-green-500' : 'bg-slate-700'}`}></span>
        </span>
      </div>

      <h3 className="text-lg font-bold text-white truncate" title={name}>{name}</h3>
      <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
        {type.split('/').pop()}
      </p>

      {/* Sparkline with Tooltip functionality */}
      <div className="h-16 w-full mt-4" style={{ minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-800 border border-slate-700 px-2 py-1 rounded shadow-xl text-[10px]">
                      <p className="text-white font-mono">{data.value.toFixed(2)}{unit}</p>
                      <p className="text-slate-400">{new Date(data.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: '#334155', strokeWidth: 1 }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={true}
            />
            <YAxis hide domain={['auto', 'auto']} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-auto pt-4 flex items-baseline gap-2">
        <span className="text-3xl font-mono font-bold text-white tracking-tighter">
          {displayValue.toFixed(1)}
        </span>
        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
          {unit} {label}
        </span>
      </div>
    </div>
  );
};