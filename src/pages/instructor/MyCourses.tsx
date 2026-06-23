import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import { useAuth } from '../../hooks/useAuth'
import {
  subscribeToInstructorCourses,
  updateCourse,
  deleteCourse,
} from '../../services/courseService'
import type { Course, CourseInput } from '../../types/course'
import { EmptyState } from '../../components/ui/EmptyState'
import { FormSelectField } from '../../components/ui/FormSelectField'
import { FormTextField } from '../../components/ui/FormTextField'
import { PageHeader } from '../../components/ui/PageHeader'

const categories = ['Frontend', 'Backend', 'Design', 'Data', 'DevOps', 'Mobile']

export function InstructorMyCourses() {
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const unsub = subscribeToInstructorCourses(
      user.uid,
      (data) => {
        setCourses(data)
        setLoading(false)
      },
      (error) => {
        enqueueSnackbar(error.message, { variant: 'error' })
        setLoading(false)
      }
    )

    return unsub
  }, [user?.uid])

  const handleDelete = async (courseId: string) => {
    setDeletingId(courseId)
    try {
      await deleteCourse(courseId)
      enqueueSnackbar('Course deleted', { variant: 'success' })
    } catch (err) {
      enqueueSnackbar(
        err instanceof Error ? err.message : 'Failed to delete course',
        { variant: 'error' }
      )
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title="My Courses"
        subtitle="Edit, review, and retire your course catalog."
      />

      {courses.length === 0 ? (
        <EmptyState message="You haven't created any courses yet." />
      ) : (
        <Grid container spacing={2}>
          {courses.map((course) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent sx={{ height: '100%' }}>
                  <Stack spacing={1}>
                    <Chip
                      label={course.category}
                      size="small"
                      color="secondary"
                      sx={{ alignSelf: 'flex-start' }}
                    />
                    <Typography sx={{ fontWeight: 800, fontSize: 18 }}>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {course.duration}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setEditingCourse(course)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        disabled={deletingId === course.id}
                        onClick={() => handleDelete(course.id)}
                      >
                        {deletingId === course.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {editingCourse && (
        <EditCourseDialog
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
        />
      )}
    </Stack>
  )
}

function EditCourseDialog({
  course,
  onClose,
}: {
  course: Course
  onClose: () => void
}) {
  const { enqueueSnackbar } = useSnackbar()
  const [saving, setSaving] = useState(false)
  const { control, handleSubmit } = useForm<CourseInput>({
    defaultValues: {
      title: course.title,
      description: course.description,
      category: course.category,
      duration: course.duration,
      prerequisites: course.prerequisites,
      instructorId: course.instructorId,
      instructorName: course.instructorName,
      instructorEmail: course.instructorEmail,
    },
  })

  const handleSave = async (form: CourseInput) => {
    setSaving(true)
    try {
      await updateCourse(course.id, form)
      enqueueSnackbar('Course updated', { variant: 'success' })
      onClose()
    } catch (err) {
      enqueueSnackbar(
        err instanceof Error ? err.message : 'Failed to update course',
        { variant: 'error' }
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Course</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <FormTextField
            control={control}
            name="title"
            label="Course Title"
          />
          <FormTextField
            control={control}
            name="description"
            label="Description"
            multiline
            minRows={3}
          />
          <FormSelectField
            control={control}
            name="category"
            label="Category"
            options={categories}
          />
          <FormTextField
            control={control}
            name="duration"
            label="Duration"
          />
          <FormTextField
            control={control}
            name="prerequisites"
            label="Prerequisites"
            multiline
            minRows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={saving}
          onClick={handleSubmit(handleSave)}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
