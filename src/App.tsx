import { useEffect, useState } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { ServicePod } from './components/ServicePod';
import { ActivityFeed } from './components/ActivityFeed';

function App() {
  const [resources, setResources] = useState<any[]>([]);
  const [gitRepos, setGitRepos] = useState<any[]>([]);

  // Short comment: Fetches infrastructure and git data in parallel
  const fetchVitals = async () => {
    try {
      const [resData, gitData] = await Promise.all([
        axios.get('http://localhost:5000/api/dashboard/resources'),
        axios.get('http://localhost:5000/api/git/latest')
      ]);
      setResources(resData.data);
      setGitRepos(gitData.data);
      
      // Random log as requested
      if (Math.random() > 0.8) console.log("Pulse: Systems synchronized.");
    } catch (err) {
      console.error("Link severed.");
    }
  };

  useEffect(() => {
    fetchVitals();
    const timer = setInterval(fetchVitals, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-black text-slate-300 overflow-hidden">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Infrastructure Grid */}
        <section className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          <header className="mb-8 flex items-center gap-4">
            <h2 className="text-zinc-500 text-[11px] font-bold uppercase tracking-[0.4em]">Infrastructure</h2>
            <div className="h-[1px] flex-1 bg-zinc-900" />
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {gitRepos.map(repo => {
              // Short comment: Precise matching - strips dashes and compares exact normalized strings
              const matchedResource = resources.find(res => {
                const normalizedRes = res.name.toLowerCase().replace(/-/g, '');
                const normalizedRepo = repo.repoName.toLowerCase().replace(/-/g, '');
                return normalizedRes === normalizedRepo;
              });

              return (
                <ServicePod 
                  key={repo.repoName} 
                  repo={repo} 
                  resource={matchedResource} 
                />
              );
            })}
          </div>
        </section>

        {/* Short comment: Obsidian Sidebar for activity feed */}
        <aside className="w-96 bg-[#111113] border-l border-zinc-800 flex flex-col shadow-2xl z-10">
          <div className="p-5 border-b border-zinc-800 bg-white/[0.02] flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Activity Log</span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981] animate-pulse" />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ActivityFeed repos={gitRepos} />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;