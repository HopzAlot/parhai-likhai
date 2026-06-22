import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSnackbar } from 'notistack'
import { useAuth } from '../../hooks/useAuth'
import { createCourse } from '../../services/courseService'
import { FormSelectField } from '../../components/ui/FormSelectField'
import { FormTextField } from '../../components/ui/FormTextField'
import { PageHeader } from '../../components/ui/PageHeader'
import { courseSchema, type CourseFormValues } from '../../schemas/courseSchema'

const categories = ['Frontend', 'Backend', 'Design', 'Data', 'DevOps', 'Mobile']

export function CreateCourse() {
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      duration: '',
      prerequisites: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (values: CourseFormValues) => {
    if (!user) return

    try {
      await createCourse({
        ...values,
        prerequisites: values.prerequisites ?? '',
        instructorId: user.uid,
        instructorName: user.displayName ?? '',
        instructorEmail: user.email ?? '',
      })

      enqueueSnackbar('Course created successfully', { variant: 'success' })
      reset()
    } catch (err) {
      enqueueSnackbar(
        err instanceof Error ? err.message : 'Failed to create course',
        { variant: 'error' }
      )
    }
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Create a Course"
        subtitle="Publish a structured course for student enrollment."
      />
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2.5, sm: 3 },
          maxWidth: 720,
          boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)',
        }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <FormTextField
              label="Course Title"
              required
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
              {...register('title')}
            />
            <FormTextField
              label="Description"
              multiline
              minRows={3}
              required
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
              {...register('description')}
            />
            <FormSelectField
              label="Category"
              options={categories}
              required
              error={Boolean(errors.category)}
              helperText={errors.category?.message}
              {...register('category')}
            />
            <FormTextField
              label="Duration (e.g. 10h)"
              required
              error={Boolean(errors.duration)}
              helperText={errors.duration?.message}
              {...register('duration')}
            />
            <FormTextField
              label="Prerequisites"
              multiline
              minRows={2}
              placeholder="e.g. Basic JavaScript knowledge"
              error={Boolean(errors.prerequisites)}
              helperText={errors.prerequisites?.message}
              {...register('prerequisites')}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={18} /> : undefined}
              sx={{ alignSelf: 'flex-start', px: 3 }}
            >
              {isSubmitting ? 'Creating...' : 'Create Course'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Stack>
  )
}
