import { TEMPLATES } from '#mjml';

export default async function getEmailHtml({ template_name, variables }) {
  const template = await TEMPLATES[template_name];

  return template.replace(/{{(.*?)}}/g, (_, key) => variables[key.trim()] || '');
}
