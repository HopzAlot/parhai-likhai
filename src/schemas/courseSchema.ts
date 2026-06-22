import { z } from 'zod'

export const courseSchema = z.object({
  title: z.string().min(1, 'Course title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  duration: z.string().min(1, 'Duration is required'),
  prerequisites: z.string().optional(),
})

export type CourseFormValues = z.infer<typeof courseSchema>
