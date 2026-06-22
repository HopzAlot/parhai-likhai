import { z } from 'zod'

export const registrationSchema = z.object({
  // Step 1: Your details
  studentName: z.string().min(1, 'Your name is required'),
  studentEmail: z.string().email('Enter a valid email'),
  studentPhone: z.string().min(1, 'Phone number is required'),

  // Step 2: Course Info (read-only confirmation, pulled from selected course)
  courseId: z.string().min(1),
  courseTitle: z.string().min(1),
  category: z.string().min(1),
  duration: z.string().min(1),

  // Step 2: Instructor Info (read-only confirmation)
  instructorId: z.string().min(1),
  instructorName: z.string().min(1),
  instructorEmail: z.string().email(),

  // Step 3: Prerequisites
  acceptedPrerequisites: z.boolean().refine((value) => value, {
    message: 'You must confirm you meet the prerequisites',
  }),

  paymentReference: z.string().optional(),
})

export type RegistrationFormValues = z.infer<typeof registrationSchema>

export const STEP_FIELDS: Record<number, (keyof RegistrationFormValues)[]> = {
  0: ['studentName', 'studentEmail', 'studentPhone'],
  1: ['courseId', 'courseTitle', 'category', 'duration'],
  2: ['instructorId', 'instructorName', 'instructorEmail', 'acceptedPrerequisites', 'paymentReference'],
}
