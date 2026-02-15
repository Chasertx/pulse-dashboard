import { useEffect, useState } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { ServicePod } from './components/ServicePod';
import { ActivityFeed } from './components/ActivityFeed';

function App() {
  const [resources, setResources] = useState<any[]>([]);
  const [gitRepos, setGitRepos] = useState<any[]>([]);

  // Short comment: Fetches cloud resources (now with Status) and git telemetry
  const fetchVitals = async () => {
    try {
      const [resData, gitData] = await Promise.all([
        axios.get('http://localhost:5000/api/dashboard/resources'),
        axios.get('http://localhost:5000/api/git/latest')
      ]);
      
      setResources(resData.data);
      setGitRepos(gitData.data);
      
      // Short comment: Debug log to verify Status is arriving from Postgres
      if (resData.data.length > 0) {
        console.log(`Pulse: ${resData.data[0].name} is ${resData.data[0].status}`);
      }
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
    <div 
      className="flex flex-col h-screen w-full overflow-hidden" 
      style={{ backgroundColor: '#050506', color: '#D4D4D8' }}
    >
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <section className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          <header className="mb-8 flex items-center gap-4">
            <h2 style={{ color: '#A78BFA', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em' }}>
              Infrastructure
            </h2>
            <div className="h-[1px] flex-1 bg-zinc-800" />
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {gitRepos.map(repo => {
              const matchedResource = resources.find(res => {
                const normalizedRes = res.name.toLowerCase().replace(/-/g, '');
                const normalizedRepo = repo.repoName.toLowerCase().replace(/-/g, '');
                return normalizedRes.includes(normalizedRepo) || normalizedRepo.includes(normalizedRes);
              });

              return (
                <ServicePod 
                  key={repo.repoName} 
                  repo={repo} 
                  // Short comment: Resource now includes the .status field from the backend
                  resource={matchedResource} 
                />
              );
            })}
          </div>
        </section>

        <aside 
          className="w-96 border-l border-zinc-800 flex flex-col z-10"
          style={{ backgroundColor: '#080809' }}
        >
          <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
            <span style={{ color: '#F5D0FE', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}>
              Activity Log
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
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