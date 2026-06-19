import { z } from 'zod'

export const registrationSchema = z.object({
  // Step 1: Course Info (read-only confirmation, pulled from selected course)
  courseId: z.string().min(1),
  courseTitle: z.string().min(1),
  category: z.string().min(1),
  duration: z.string().min(1),

  // Step 2: Instructor Info (read-only confirmation)
  instructorId: z.string().min(1),
  instructorName: z.string().min(1),
  instructorEmail: z.string().email(),

  // Step 3: Prerequisites
  acceptedPrerequisites: z.literal(true, {
    error: 'You must confirm you meet the prerequisites',
  }),
})

export type RegistrationFormValues = z.infer<typeof registrationSchema>

export const STEP_FIELDS: Record<number, (keyof RegistrationFormValues)[]> = {
  0: ['courseId', 'courseTitle', 'category', 'duration'],
  1: ['instructorId', 'instructorName', 'instructorEmail'],
  2: ['acceptedPrerequisites'],
}