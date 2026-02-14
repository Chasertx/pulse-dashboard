import { useEffect, useState } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { ResourceCard } from './components/ResourceCard';
import { GitCard } from './components/GitCard'; // Short comment: New git visualization component
import type { AzureResource } from './types/pulse';

function App() {
  const [resources, setResources] = useState<AzureResource[]>([]);
  const [gitRepos, setGitRepos] = useState<any[]>([]); // Short comment: State for GitHub pulse data

  // Short comment: Unified fetch for both Azure and GitHub telemetry
  const fetchVitals = async () => {
    try {
      const [resData, gitData] = await Promise.all([
        axios.get('http://localhost:5000/api/dashboard/resources'),
        axios.get('http://localhost:5000/api/git/latest')
      ]);

      setResources(resData.data);
      setGitRepos(gitData.data);
      
      if (Math.random() > 0.8) console.log("Pulse synced: 🟢 System Healthy");
    } catch (err) {
      console.error("Link to Pulse API severed.");
    }
  };

  useEffect(() => {
    fetchVitals();
    const timer = setInterval(fetchVitals, 30000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      <main className="max-w-7xl mx-auto p-10 space-y-12">
        {/* Short comment: Code Velocity Section */}
        {gitRepos.length > 0 && (
          <section>
            <h2 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Code Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gitRepos.map(repo => (
                <GitCard key={repo.repoName} repo={repo} />
              ))}
            </div>
          </section>
        )}

        {/* Short comment: Infrastructure Health Section */}
        <section>
          <h2 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Cloud Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map(res => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;