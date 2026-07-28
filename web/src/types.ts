/** Shapes returned by the API. Mirrors the DTOs in api/src. */

export type UserRole = 'student' | 'admin';

export interface User {
  id: number;
  umkcId: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Course {
  id: number;
  courseNo: string;
  courseName: string;
  section: string;
  days: string;
  times: string;
  modality: string;
  room: string | null;
  instructor: string;
}

export type CurrentLevel =
  'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate';

export type Position = 'grader' | 'lab instructor' | 'both';

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  id: number;
  userId: number;
  courseId: number;
  gpa: number;
  hrsCompleted: number;
  currLevel: CurrentLevel;
  gradSemester: string;
  degree: string;
  currMajor: string;
  position: Position;
  certificationTerm: string | null;
  prevDegree: boolean;
  status: ApplicationStatus;
  appliedAt: string;
  user?: User;
  course?: Course;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type ApplicationSortBy =
  'gpa' | 'hrsCompleted' | 'lastName' | 'firstName' | 'appliedAt';

export type SortOrder = 'ASC' | 'DESC';
