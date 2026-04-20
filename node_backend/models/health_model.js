export function build_health_model({ service_name, status, timestamp }) {
  return {
    service_name,
    status,
    timestamp,
    message: `${service_name} is responding.`,
  };
}
