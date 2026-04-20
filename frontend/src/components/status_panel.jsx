function StatusPanel({ services, isLoading, lastUpdatedAt }) {
  return (
    <section className="status-panel">
      <div className="section-header">
        <p className="eyebrow">Live endpoints</p>
        <h2>Health probes</h2>
        <p className="section-meta">{lastUpdatedAt ? `Last checked at ${lastUpdatedAt}` : 'No probe completed yet.'}</p>
      </div>

      <div className="status-grid">
        {isLoading ? (
          <article className="status-card is-pending">
            <h3>Checking services</h3>
            <p>Polling the Node and Python health endpoints.</p>
          </article>
        ) : (
          services.map((service) => (
            <article key={service.service_name} className={`status-card ${service.reachable ? 'is-ready' : 'is-down'}`}>
              <div className="status-row">
                <h3>{service.service_name}</h3>
                <span className="status-pill">{service.status}</span>
              </div>
              <p>{service.message}</p>
              <small>{service.timestamp || 'No timestamp returned.'}</small>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default StatusPanel;
