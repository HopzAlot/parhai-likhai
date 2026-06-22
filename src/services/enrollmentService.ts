import {
  collection,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Enrollment, EnrollmentInput } from '../types/course'

const ENROLLMENTS_COLLECTION = 'enrollments'

export function subscribeToStudentEnrollments(
  studentId: string,
  onData: (enrollments: Enrollment[]) => void,
  onError: (error: Error) => void
) {
  const q = query(
    collection(db, ENROLLMENTS_COLLECTION),
    where('studentId', '==', studentId),
    orderBy('enrolledAt', 'desc')
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const enrollments = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() } as Enrollment)
      )
      onData(enrollments)
    },
    onError
  )
}

export function subscribeToInstructorEnrollments(
  instructorId: string,
  onData: (enrollments: Enrollment[]) => void,
  onError: (error: Error) => void
) {
  const q = query(
    collection(db, ENROLLMENTS_COLLECTION),
    where('instructorId', '==', instructorId),
    orderBy('enrolledAt', 'desc')
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const enrollments = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() } as Enrollment)
      )
      onData(enrollments)
    },
    onError
  )
}

export async function createEnrollment(
  input: EnrollmentInput
): Promise<string> {
  const enrollmentId = `${input.studentId}_${input.courseId}`
  const existing = await getDoc(doc(db, ENROLLMENTS_COLLECTION, enrollmentId))

  if (existing.exists()) {
    throw new Error('You are already enrolled in this course.')
  }

  await setDoc(doc(db, ENROLLMENTS_COLLECTION, enrollmentId), {
    ...input,
    enrolledAt: serverTimestamp(),
  })
  return enrollmentId
}

export async function updateEnrollmentStatus(
  enrollmentId: string,
  status: Enrollment['status']
): Promise<void> {
  await updateDoc(doc(db, ENROLLMENTS_COLLECTION, enrollmentId), { status })
}

export async function deleteEnrollment(enrollmentId: string): Promise<void> {
  await deleteDoc(doc(db, ENROLLMENTS_COLLECTION, enrollmentId))
}
