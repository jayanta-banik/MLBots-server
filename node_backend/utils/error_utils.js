export function createError({ message, statusCode }) {
  return Object.assign(new Error(message || 'An unknown error occurred.'), { statusCode: statusCode || 500 });
}
