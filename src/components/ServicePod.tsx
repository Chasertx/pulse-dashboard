import { Cloud, Hash, CheckCircle2, AlertCircle, Github } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

interface ServicePodProps {
  repo: any;
  resource?: any;
}

export const ServicePod = ({ repo, resource }: ServicePodProps) => {
  // Short comment: Matches "Active" or "Running" from your specific API response [cite: 2026-02-14]
  const statusRaw = resource?.status?.toLowerCase() || '';
  const isOnline = statusRaw === 'active' || statusRaw === 'running';
  
  // Short comment: Emerald if Azure is Active/Running OR if unlinked repo succeeded
  const showGreen = resource ? isOnline : repo.status === 'success';
  
  // Short comment: Active apps glow emerald; Offline/Stopped apps use zinc
  const statusColor = isOnline ? '#34d399' : '#52525b';

  const sparkData = resource?.history?.length > 0 
    ? resource.history.map((p: any) => ({ 
        value: Number(p.value), 
        time: new Date(p.recordedAt).toLocaleTimeString() 
      })) 
    : [];

  return (
    <div className="bg-[#0A0A0B] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all group relative overflow-hidden">
      
      {/* Short comment: Pulse indicator synced to "Active" status [cite: 2026-02-14] */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 animate-pulse" 
        style={{ 
          backgroundColor: showGreen ? '#34d399' : '#f43f5e', 
          boxShadow: showGreen ? '0 0 15px #34d399' : '0 0 15px #f43f5e' 
        }}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="font-bold text-white text-base tracking-tight truncate group-hover:text-[#F5D0FE] transition-colors">
              {repo.repoName}
            </h3>
            
            <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono">
              <div className="flex items-center gap-1 font-bold" style={{ color: '#FBCFE8' }}>
                <Hash size={12} />
                <span>{repo.latestCommitHash || "-------"}</span>
              </div>
              
              {resource ? (
                <div className="flex items-center gap-1 border-l border-zinc-800 pl-3" style={{ color: '#C4B5FD' }}>
                  <Cloud size={12} />
                  <span className="truncate max-w-[120px]">{resource.name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-zinc-600 border-l border-zinc-800 pl-3">
                  <Github size={12} />
                  <span>STANDALONE</span>
                </div>
              )}
            </div>

            {/* Short comment: Label now correctly reflects "Active" status */}
            <div className="flex items-center gap-1.5 mt-3">
              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
              <span style={{ color: statusColor, fontSize: '9px' }} className="font-black uppercase tracking-widest">
                {resource?.status || 'Offline'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-white leading-none tabular-nums">{repo.commitCount}</div>
              <div className="text-[9px] uppercase font-black text-zinc-500 mt-1">Hits</div>
            </div>
            {showGreen ? (
              <CheckCircle2 size={18} style={{ color: '#34d399', opacity: 0.6 }} />
            ) : (
              <AlertCircle size={18} style={{ color: '#f43f5e', opacity: 0.6 }} />
            )}
          </div>
        </div>

        <div className="h-16 w-full mt-2 relative">
          {!resource ? (
            <div className="absolute inset-0 flex items-center justify-center border border-dashed border-zinc-900 rounded-lg">
              <span className="text-[9px] text-zinc-700 font-black uppercase tracking-widest">Unlinked</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData} margin={{ top: 5, bottom: 5 }}>
                <YAxis hide domain={[0, 10]} />
                <Tooltip 
                  formatter={(value: any) => [Number(value).toFixed(2), "Pulse"]}
                  labelStyle={{ display: 'none' }}
                  contentStyle={{ backgroundColor: '#111113', border: '1px solid #27272a', borderRadius: '6px', fontSize: '11px' }}
                  itemStyle={{ color: '#F5D0FE' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#818CF8" 
                  strokeWidth={2} 
                  fillOpacity={0.15} 
                  fill="#818CF8" 
                  isAnimationActive={false} 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};