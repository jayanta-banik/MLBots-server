import { build_health_model } from '#models/health_model';
import { to_iso_timestamp } from '#utils/time_utils';

const SERVICE_NAME = 'node_backend';
const SERVICE_STATUS = 'ok';

export function get_health_payload() {
  return build_health_model({
    service_name: SERVICE_NAME,
    status: SERVICE_STATUS,
    timestamp: to_iso_timestamp(),
  });
}
