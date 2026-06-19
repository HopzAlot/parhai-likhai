import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Course, CourseInput } from '../types/course'

const COURSES_COLLECTION = 'courses'

export function subscribeToAllCourses(
  onData: (courses: Course[]) => void,
  onError: (error: Error) => void
) {
  const q = query(
    collection(db, COURSES_COLLECTION),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const courses = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() } as Course)
      )
      onData(courses)
    },
    onError
  )
}

export function subscribeToInstructorCourses(
  instructorId: string,
  onData: (courses: Course[]) => void,
  onError: (error: Error) => void
) {
  const q = query(
    collection(db, COURSES_COLLECTION),
    where('instructorId', '==', instructorId),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const courses = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() } as Course)
      )
      onData(courses)
    },
    onError
  )
}

export async function createCourse(input: CourseInput): Promise<string> {
  const ref = await addDoc(collection(db, COURSES_COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateCourse(
  courseId: string,
  input: Partial<CourseInput>
): Promise<void> {
  await updateDoc(doc(db, COURSES_COLLECTION, courseId), input)
}

export async function deleteCourse(courseId: string): Promise<void> {
  await deleteDoc(doc(db, COURSES_COLLECTION, courseId))
}