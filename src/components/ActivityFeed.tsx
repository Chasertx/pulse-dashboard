import { Terminal, GitBranch, Zap, ShieldCheck, ShieldAlert } from 'lucide-react';

interface ActivityFeedProps {
  repos: any[];
}

// Short comment: Chronological system event stream with real-time status
export const ActivityFeed = ({ repos }: ActivityFeedProps) => {
  const sortedEvents = [...repos].sort((a, b) => 
    new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
  );

  return (
    <div className="flex flex-col font-mono">
      {sortedEvents.length === 0 ? (
        <div className="p-10 text-center text-zinc-600 text-[11px] italic">
          No recent activity detected.
        </div>
      ) : (
        sortedEvents.map((event, idx) => {
          const isSuccess = event.status === 'success';

          return (
            <div 
              key={`${event.repoName}-${idx}`} 
              className="p-6 border-b border-zinc-800/50 hover:bg-white/[0.03] transition-colors"
            >
              {/* Short comment: Header with repo name and timestamp */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-purple-500" />
                  <span className="text-[11px] text-zinc-200 font-bold uppercase tracking-widest">
                    {event.repoName}
                  </span>
                </div>
                <span className="text-zinc-500 text-[10px] font-bold">
                  {new Date(event.lastActivity).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>

              {/* Short comment: Inset metadata details */}
              <div className="space-y-3 ml-1 border-l-2 border-zinc-800 pl-5">
                <div className="flex items-center gap-2 text-[11px]">
                  <GitBranch size={12} className="text-zinc-600" />
                  <span className="text-purple-400 font-bold">@{event.latestCommitHash}</span>
                  <span className="text-zinc-500">({event.branch})</span>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <Zap 
                    size={12} 
                    className={event.commitCount > 0 ? "text-amber-400" : "text-zinc-700"} 
                  />
                  <span className={event.commitCount > 0 ? "text-zinc-300" : "text-zinc-500"}>
                    {event.commitCount} commits detected
                  </span>
                </div>

                {/* Short comment: New status line for immediate health context */}
                <div className="flex items-center gap-2 text-[11px]">
                  {isSuccess ? (
                    <ShieldCheck size={12} className="text-emerald-500" />
                  ) : (
                    <ShieldAlert size={12} className="text-rose-500" />
                  )}
                  <span className={isSuccess ? "text-emerald-500/80" : "text-rose-500/80"}>
                    {isSuccess ? "Pipeline Clear" : "Review Required"}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <span className="text-[8px] text-emerald-500/40 font-bold tracking-tighter uppercase">
                  Synchronized
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};