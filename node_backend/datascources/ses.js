import { SESv2Client, SendBulkEmailCommand, SendEmailCommand } from '@aws-sdk/client-sesv2';

const ses = new SESv2Client();

const toSesAttachments = (attachments = []) => {
  if (!attachments?.length) return undefined;

  return attachments.map((a) => ({
    FileName: a.filename,
    ...(a.contentType ? { ContentType: a.contentType } : {}),
    ContentDisposition: a.contentDisposition || 'ATTACHMENT', // allow override if you want
    RawContent: a.content, // Buffer / Uint8Array
    ContentTransferEncoding: a.contentTransferEncoding || 'BASE64',
  }));
};

const buildSimpleContent = ({ subject, body, attachments } = {}) => {
  const simple = {};

  if (subject) simple.Subject = { Data: subject };
  if (body) simple.Body = { Html: { Data: body } };

  const sesAttachments = toSesAttachments(attachments);
  if (sesAttachments) simple.Attachments = sesAttachments;

  return simple;
};

export async function sendEmail({ to = [], subject, body, source, attachments = [] }) {
  const params = {
    FromEmailAddress: source || process.env.SOURCE_EMAIL,
    Destination: { ToAddresses: to },
    Content: { Simple: buildSimpleContent({ subject, body, attachments }) },
  };

  try {
    const data = await ses.send(new SendEmailCommand(params));
    // log in database
    console.debug('Email sent successfully:', data);
  } catch (error) {
    // also log in database
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendBulkEmail({ to = [], subject, body, source, attachments = [], bodyData }) {
  if (!to.length) throw new Error('to is required');
  if (!subject) throw new Error('subject is required');
  if (!body) throw new Error('body is required');

  const from = source || process.env.SOURCE_EMAIL;

  const getData = (i, email) => {
    if (!bodyData) return {};
    if (typeof bodyData === 'function') return bodyData({ index: i, to: email });
    if (Array.isArray(bodyData)) {
      if (bodyData.length !== to.length) throw new Error('bodyData length must match to length');
      return bodyData[i] || {};
    }
    return bodyData; // broadcast object
  };

  const render = (tpl, data) => tpl.replace(/{{\s*([\w.-]+)\s*}}/g, (_, k) => k.split('.').reduce((a, b) => a?.[b], data) ?? '');

  const bulkEntries = to.map((email, i) => {
    const data = getData(i, email);
    const html = typeof body === 'function' ? body(data, { index: i, to: email }) : render(body, data);

    return {
      Destination: { ToAddresses: [email] },
      ReplacementEmailContent: {
        ReplacementSubject: { Data: subject },
        ReplacementBody: { Html: { Data: html } },
      },
    };
  });

  const params = {
    FromEmailAddress: from,
    DefaultContent: {
      Template: {
        TemplateContent: { Subject: subject, Html: body },
        TemplateData: JSON.stringify({}),
        ...(attachments?.length ? { Attachments: toSesAttachments(attachments) } : {}),
      },
    },
    BulkEmailEntries: bulkEntries,
  };

  const res = await ses.send(new SendBulkEmailCommand(params));

  return {
    sent: res.BulkEmailEntryResults?.map((r, i) => (r.Status === 'SUCCESS' ? to[i] : null)).filter(Boolean),
    failed: res.BulkEmailEntryResults?.map((r, i) => (r.Status !== 'SUCCESS' ? { to: to[i], error: r.Error } : null)).filter(Boolean),
  };
}
