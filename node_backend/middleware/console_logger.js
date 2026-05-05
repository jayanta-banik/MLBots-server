import { isEmptyObjectValues, printObject } from '#utils/object_handler';

// Console.debug logs for all requests path and query parameters. Does not log request body for security and performance reasons. Does not log requests with status codes 304, 404, and 500, or requests with methods OPTIONS and HEAD, to avoid cluttering the logs with failed requests and health checks.
export default function consoleLogger() {
  return (req, res, next) => {
    res.on('finish', () => {
      const { method, originalUrl, query, params } = req;
      const status = res.statusCode;
      const userId = res.locals?.auth?.userId;
      const validToken = Boolean(res.locals?.token);

      if ([304, 404, 500].includes(status) || ['OPTIONS', 'HEAD'].includes(method)) {
        return;
      }

      console.debug(`[${method}] ${originalUrl} - Status: ${status} - User ID: ${userId} - Valid Token: ${validToken}`);
      if (!isEmptyObjectValues(query)) {
        console.debug(`Query: `);
        printObject(query);
      }
      if (!isEmptyObjectValues(params)) {
        console.debug(`Params: `);
        printObject(params);
      }
      console.debug(`\n`);
    });
    next();
  };
}
