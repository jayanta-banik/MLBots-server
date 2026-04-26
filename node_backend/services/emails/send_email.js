export default async function sendEmail({ html, subject, text, to }) {
  console.info('Email delivery is not configured yet. Previewing email payload instead.', {
    html,
    subject,
    text,
    to,
  });

  return {
    delivered: false,
    preview: { subject, to },
  };
}
