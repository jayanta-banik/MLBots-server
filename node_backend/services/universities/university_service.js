import { fetchUniversityDirectory } from '#models/universities';

function serializeFaculty(faculty) {
  return {
    id: faculty.id,
    name: faculty.name,
    googleScholarId: faculty.google_scholar_id,
    createdAt: faculty.created_at,
  };
}

function serializeUniversity(university) {
  return {
    id: university.id,
    name: university.name,
    location: university.location,
    state: university.state,
    createdAt: university.created_at,
    facultyCount: university.faculties.length,
    faculties: university.faculties.map(serializeFaculty),
  };
}

export async function getUniversityDirectory() {
  const universities = await fetchUniversityDirectory();

  return {
    universities: universities.map(serializeUniversity),
  };
}
