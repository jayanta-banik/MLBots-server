import { useEffect, useState } from 'react';

import StatusPanel from './components/status_panel.jsx';
import './styles/app.css';
import { fetch_service_statuses } from './utils/api_client.js';

const LAYER_ITEMS = [
  {
    name: 'Root repo layer',
    path: '/',
    summary: 'Owns deployment entrypoints, CI workflow files, shared static assets, and Raspberry Pi level server configuration.',
  },
  {
    name: 'Frontend layer',
    path: 'frontend',
    summary: 'Contains the Vite + React application and compiles into the root static folder for serving.',
  },
  {
    name: 'Node layer',
    path: 'node_backend',
    summary: 'Handles Express ESM APIs through routes, services, models, middleware, and utility helpers.',
  },
  {
    name: 'Python layer',
    path: 'python_backend',
    summary: 'Handles FastAPI endpoints and keeps the existing Python-side storage, templates, and legacy support folders together.',
  },
];

function App() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      const nextServices = await fetch_service_statuses();

      if (!isMounted) {
        return;
      }

      setServices(nextServices);
      setLastUpdatedAt(new Date().toLocaleTimeString());
      setIsLoading(false);
    };

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Monorepo service layout</p>
        <h1>MLBots control surface</h1>
        <p className="hero-copy">A single repo that separates frontend delivery, Node APIs, Python APIs, and Raspberry Pi deployment concerns without mixing runtime boundaries.</p>
      </section>

      <section className="layer-panel">
        <div className="section-header">
          <p className="eyebrow">Four layers</p>
          <h2>Folder roles</h2>
        </div>

        <div className="layer-grid">
          {LAYER_ITEMS.map((layerItem) => (
            <article key={layerItem.name} className="layer-card">
              <span className="layer-path">{layerItem.path}</span>
              <h3>{layerItem.name}</h3>
              <p>{layerItem.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <StatusPanel services={services} isLoading={isLoading} lastUpdatedAt={lastUpdatedAt} />
    </main>
  );
}

export default App;
