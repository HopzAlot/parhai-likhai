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
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useAuth } from '../../hooks/useAuth'
import {
  subscribeToInstructorCourses,
  updateCourse,
  deleteCourse,
} from '../../services/courseService'
import type { Course, CourseInput } from '../../types/course'

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        My Courses
      </Typography>

      {courses.length === 0 ? (
        <Typography color="text.secondary">
          You haven't created any courses yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {courses.map((course) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Chip
                      label={course.category}
                      size="small"
                      color="secondary"
                      sx={{ alignSelf: 'flex-start' }}
                    />
                    <Typography sx={{ fontWeight: 600 }}>
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
  const [form, setForm] = useState<CourseInput>({
    title: course.title,
    description: course.description,
    category: course.category,
    duration: course.duration,
    prerequisites: course.prerequisites,
    instructorId: course.instructorId,
    instructorName: course.instructorName,
    instructorEmail: course.instructorEmail,
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
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
          <TextField
            label="Course Title"
            fullWidth
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <TextField
            label="Category"
            select
            fullWidth
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Duration"
            fullWidth
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
          <TextField
            label="Prerequisites"
            fullWidth
            multiline
            minRows={2}
            value={form.prerequisites}
            onChange={(e) =>
              setForm({ ...form, prerequisites: e.target.value })
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}