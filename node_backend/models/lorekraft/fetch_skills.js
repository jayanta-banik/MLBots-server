import prisma from '#prisma';

export default async function fetchSkills({ where } = {}) {
  return prisma.skills.findMany({ where });
}
