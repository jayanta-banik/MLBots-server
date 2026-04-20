const SERVICE_ENDPOINTS = [
  {
    service_name: 'node_backend',
    endpoint: '/api/node/health',
  },
  {
    service_name: 'python_backend',
    endpoint: '/api/python/health',
  },
];

function normalize_service_payload(payload, fallback_name) {
  return {
    service_name: payload.service_name ?? payload.serviceName ?? fallback_name,
    status: payload.status ?? 'unknown',
    timestamp: payload.timestamp ?? '',
    message: payload.message ?? 'Endpoint responded successfully.',
  };
}

export async function fetch_service_statuses() {
  const service_results = await Promise.all(
    SERVICE_ENDPOINTS.map(async ({ service_name, endpoint }) => {
      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();

        return {
          ...normalize_service_payload(payload, service_name),
          reachable: true,
        };
      } catch (error) {
        return {
          service_name,
          status: 'unreachable',
          timestamp: '',
          message: error instanceof Error ? error.message : 'Unknown fetch error.',
          reachable: false,
        };
      }
    }),
  );

  return service_results;
}
