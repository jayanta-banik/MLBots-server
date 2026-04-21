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

const AUTH_BASE_PATH = '/api/node/auth';

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

async function send_json_request(path, { body, method = 'GET', token } = {}) {
  const response = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message ?? `Request failed with status ${response.status}`);
  }

  return payload;
}

export function signup_user(payload) {
  return send_json_request(`${AUTH_BASE_PATH}/signup`, {
    method: 'POST',
    body: payload,
  });
}

export function login_user(payload) {
  return send_json_request(`${AUTH_BASE_PATH}/login`, {
    method: 'POST',
    body: payload,
  });
}

export function fetch_current_user(token) {
  return send_json_request(`${AUTH_BASE_PATH}/me`, {
    token,
  });
}
