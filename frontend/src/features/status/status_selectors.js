export const select_service_statuses = (state) => state.status.services;
export const select_services_loading = (state) => state.status.isLoading;
export const select_services_error = (state) => state.status.loadError;
export const select_services_updated_at = (state) => state.status.lastUpdatedAt;
