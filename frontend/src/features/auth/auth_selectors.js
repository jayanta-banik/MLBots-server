export const select_auth_status = (state) => state.auth.status;
export const select_auth_user = (state) => state.auth.user;
export const select_auth_error = (state) => state.auth.error;
export const select_is_authenticated = (state) => Boolean(state.auth.token && state.auth.user);
