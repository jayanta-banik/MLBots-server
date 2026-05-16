import prisma from '#prisma';

export default async function fetchUniversityDirectory() {
  return prisma.universities.findMany({
    orderBy: [{ name: 'asc' }],
    select: {
      id: true,
      name: true,
      location: true,
      state: true,
      created_at: true,
      faculties: {
        orderBy: [{ name: 'asc' }],
        select: {
          id: true,
          name: true,
          google_scholar_id: true,
          created_at: true,
        },
      },
    },
  });
}
