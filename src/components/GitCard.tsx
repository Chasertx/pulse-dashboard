import React from 'react';
import { Github, GitCommit, CheckCircle2, AlertCircle, Clock, Hash } from 'lucide-react';

interface GitRepo {
  repoName: string;
  branch: string;
  commitCount: number;
  latestCommitHash: string;
  status: string;
  lastActivity: string;
}

// Short comment: UI card to display GitHub repository health and activity
export const GitCard = ({ repo }: { repo: GitRepo }) => {
  const isHealthy = repo.status === 'success';
  
  // Short comment: Format timestamp to show actual activity time
  const formattedTime = new Date(repo.lastActivity).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg hover:border-purple-500/40 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/10 rounded-lg group-hover:bg-purple-600/20 transition-colors">
            <Github className="text-purple-400" size={20} />
          </div>
          <div>
            <h3 className="text-slate-100 font-bold text-lg leading-tight">{repo.repoName}</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
              Branch: <span className="text-slate-400">{repo.branch}</span>
            </p>
          </div>
        </div>
        {isHealthy ? (
          <CheckCircle2 className="text-emerald-500" size={20} />
        ) : (
          <AlertCircle className="text-rose-500" size={20} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold mb-1">
            <GitCommit size={12} className="text-purple-500" />
            <span>24h Commits</span>
          </div>
          <p className="text-2xl font-mono font-bold text-slate-100">{repo.commitCount}</p>
        </div>

        <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold mb-1">
            <Hash size={12} className="text-purple-500" />
            <span>Latest SHA</span>
          </div>
          <p className="text-sm font-mono text-purple-300 mt-1">
            {repo.latestCommitHash}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/50 flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase">
          <Clock size={12} />
          <span>Last Activity: {formattedTime}</span>
        </div>
        {/* Short comment: Visual pulse to indicate active tracking */}
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-slate-600 font-bold uppercase">Live</span>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};