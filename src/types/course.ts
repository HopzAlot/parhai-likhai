import type { Timestamp } from 'firebase/firestore'

export type Course = {
  id: string
  title: string
  description: string
  category: string
  duration: string
  prerequisites: string
  instructorId: string
  instructorName: string
  instructorEmail: string
  createdAt: Timestamp | null
}

export type CourseInput = Omit<Course, 'id' | 'createdAt'>

export type EnrollmentStatus = 'active' | 'completed'

export type Enrollment = {
  id: string
  courseId: string
  courseTitle: string
  studentId: string
  studentName: string
  studentEmail: string
  instructorId: string
  acceptedPrerequisites: boolean
  status: EnrollmentStatus
  enrolledAt: Timestamp | null
}

export type EnrollmentInput = Omit<Enrollment, 'id' | 'enrolledAt'>