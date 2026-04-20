const REQUEST_LOG_PREFIX = '[node_backend]';

export function request_logger(request, response, next) {
  const start_time = Date.now();

  response.on('finish', () => {
    const duration_ms = Date.now() - start_time;

    console.info(`${REQUEST_LOG_PREFIX} ${request.method} ${request.originalUrl} ${response.statusCode} ${duration_ms}ms`);
  });

  next();
}
