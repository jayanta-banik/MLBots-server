export function createError({ message, statusCode }) {
  return Object.assign(new Error(message || 'An unknown error occurred.'), { statusCode: statusCode || 500 });
}

export function send_error(res, error) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'An unknown error occurred.';

  return res.status(statusCode).json({ message });
}
