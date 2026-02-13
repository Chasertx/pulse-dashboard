// Core React hooks and external dependencies
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { ResourceCard } from './components/ResourceCard';
import type { AzureResource } from './types/pulse';

function App() {
  // Local state to store the list of monitored Azure resources
  const [resources, setResources] = useState<AzureResource[]>([]);

  // Fetches latest telemetry data from the backend API
  const fetchVitals = async () => {
    try {
      console.log("Syncing with Pulse API..."); 
      const { data } = await axios.get('http://localhost:5000/api/dashboard/resources');
      setResources(data);
    } catch (err) {
      console.error("API link severed.");
    }
  };

  // Sets up data polling cycle on component mount
  useEffect(() => {
    fetchVitals();
    // Refresh data every 30 seconds to keep dashboard current
    const timer = setInterval(fetchVitals, 30000); 
    // Clean up interval on unmount to prevent memory leaks
    return () => clearInterval(timer);
  }, []);

  return (
    // Main layout wrapper with dark mode background
    <div className="min-h-screen bg-slate-950">
      <Header />
      {/* Responsive grid container for resource metrics */}
      <main className="max-w-7xl mx-auto p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map(res => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;