import { templates } from '#mjml';

export default async function getEmailHtml({ template_name, variables }) {
  return templates[template_name].replace(/{{(.*?)}}/g, (_, key) => variables[key.trim()] || '');
}
