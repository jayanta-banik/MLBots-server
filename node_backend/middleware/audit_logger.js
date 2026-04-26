import prisma from '#prisma';

export const OMITTED_AUDIT_LOGS = {
  status_code: [304, 404, 500],
  methods: ['OPTIONS', 'HEAD'],
};

export default function auditLogger({ allowedParamKeys, allowedBodyKeys } = {}) {
  return (req, res, next) => {
    res.on('finish', async () => {
      const { method, originalUrl, query, params, body, ip } = req;
      const status = res.statusCode;
      const userId = res.locals?.user?.id;

      if (OMITTED_AUDIT_LOGS.status_code.includes(status) || OMITTED_AUDIT_LOGS.methods.includes(method)) {
        return;
      }

      const data = {
        user_id: userId,
        status_code: status,
        endpoint: originalUrl,
        method,
        query: JSON.stringify(query),
        ip_address: ip,
        created_at: new Date(),
      };

      if (allowedParamKeys) {
        data.param = JSON.stringify(allowedParamKeys.includes('*') ? params : Object.fromEntries(Object.entries(params || {}).filter(([key]) => allowedParamKeys.includes(key))));
      }
      if (allowedBodyKeys) {
        data.body = JSON.stringify(allowedBodyKeys.includes('*') ? body : Object.fromEntries(Object.entries(body || {}).filter(([key]) => allowedBodyKeys.includes(key))));
      }

      await prisma.audit_logs.createMany({ data: [data] });
    });
    next();
  };
}
