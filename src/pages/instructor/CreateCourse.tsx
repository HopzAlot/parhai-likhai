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
import { FormSelectField } from '../../components/forms/FormSelectField'
import { FormTextField } from '../../components/forms/FormTextField'
import { PageHeader } from '../../components/ui/PageHeader'
import { courseSchema, type CourseFormValues } from '../../schemas/courseSchema'

const categories = ['Frontend', 'Backend', 'Design', 'Data', 'DevOps', 'Mobile']

export function CreateCourse() {
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
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
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <FormTextField
              control={control}
              name="title"
              label="Course Title"
              required
            />
            <FormTextField
              control={control}
              name="description"
              label="Description"
              multiline
              minRows={3}
              required
            />
            <FormSelectField
              control={control}
              name="category"
              label="Category"
              options={categories}
              required
            />
            <FormTextField
              control={control}
              name="duration"
              label="Duration (e.g. 10h)"
              required
            />
            <FormTextField
              control={control}
              name="prerequisites"
              label="Prerequisites"
              multiline
              minRows={2}
              placeholder="e.g. Basic JavaScript knowledge"
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
