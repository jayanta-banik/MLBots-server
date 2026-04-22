import { createAsyncThunk } from '@reduxjs/toolkit';

import aiClient from '../../utils/aiClient.js';
import apiClient from '../../utils/apiClient.js';

function normalize_service_payload(payload, fallback_name) {
  return {
    service_name: payload.service_name ?? payload.serviceName ?? fallback_name,
    status: payload.status ?? 'unknown',
    timestamp: payload.timestamp ?? '',
    message: payload.message ?? 'Endpoint responded successfully.',
  };
}

export const fetch_service_statuses = createAsyncThunk('status/fetchServices', async () => {
  const service_results = await Promise.all(
    [
      { client: apiClient, path: '/health', service_name: 'node_backend' },
      { client: aiClient, path: '/health', service_name: 'python_backend' },
    ].map(async ({ client, path, service_name }) => {
      try {
        const response = await client().get(path);

        return {
          ...normalize_service_payload(response.data, service_name),
          reachable: true,
        };
      } catch (error) {
        return {
          service_name,
          status: 'unreachable',
          timestamp: '',
          message: error.response?.data?.message ?? error.message ?? 'Unknown fetch error.',
          reachable: false,
        };
      }
    }),
  );

  return {
    services: service_results,
    lastUpdatedAt: new Date().toISOString(),
    loadError: service_results.some((service) => service.reachable) ? '' : 'All monitored services are currently unavailable. Retry when the endpoints are reachable again.',
  };
});
