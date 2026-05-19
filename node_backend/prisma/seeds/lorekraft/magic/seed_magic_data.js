// import Prisma from "@prisma/client";

import prisma from '#prisma';
import { titleCase } from '#utils/string_handler';

import { MagicAttributes } from './magic_data.js';

// 1. Create all magic attributes first
await prisma.magic_attribution.createMany({
  data: MagicAttributes.map((item) => ({
    name: titleCase(item.name.trim()),
    is_base_element: item.is_base_element || false,
    base_element: item.base_element,
  })),
  skipDuplicates: true,
});

console.debug('Magic attributes seeded successfully.');

// 2. Fetch all attributes
const allAttributes = await prisma.magic_attribution.findMany();
const attributeByName = new Map(allAttributes.map((attr) => [attr.name, attr]));
console.debug('Fetched all magic attributes for component linking.', allAttributes[0]);

// 3. Create component links
const data = MagicAttributes.flatMap((item) => {
  if (!item.components || item.components.length === 0) return [];

  return item.components.map((componentName) => ({
    magic_attribution_id: attributeByName.get(titleCase(item.name.trim())).id,
    component_magic_attribution_id: attributeByName.get(titleCase(componentName.trim())).id,
  }));
});

await prisma.magic_attribution_component.createMany({
  data,
  skipDuplicates: true,
});

console.log('Magic attribution seed completed.');
