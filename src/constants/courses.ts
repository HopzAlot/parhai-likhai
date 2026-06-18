export type Course = {
  id: string
  title: string
  instructor: string
  category: string
  duration: string
  enrolled: number
}

export const ALL_COURSES: Course[] = [
  { id: '1', title: 'React from Zero to Hero', instructor: 'Ali Hassan', category: 'Frontend', duration: '12h', enrolled: 340 },
  { id: '2', title: 'Node.js & Express Bootcamp', instructor: 'Sara Khan', category: 'Backend', duration: '10h', enrolled: 210 },
  { id: '3', title: 'UI/UX Design Fundamentals', instructor: 'Usman Tariq', category: 'Design', duration: '8h', enrolled: 180 },
  { id: '4', title: 'TypeScript Deep Dive', instructor: 'Ali Hassan', category: 'Frontend', duration: '6h', enrolled: 290 },
  { id: '5', title: 'Python for Data Science', instructor: 'Hina Malik', category: 'Data', duration: '14h', enrolled: 420 },
  { id: '6', title: 'MongoDB Mastery', instructor: 'Sara Khan', category: 'Backend', duration: '7h', enrolled: 150 },
]

export const STUDENT_ENROLLED_IDS = ['1', '4']

export const INSTRUCTOR_COURSE_IDS: Record<string, string[]> = {
  'ali@lms.com': ['1', '4'],
  'sara@lms.com': ['2', '6'],
  'usman@lms.com': ['3'],
  'hina@lms.com': ['5'],
}