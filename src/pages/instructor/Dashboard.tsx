import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useAuth } from '../../hooks/useAuth'
import { subscribeToInstructorCourses } from '../../services/courseService'
import { subscribeToInstructorEnrollments } from '../../services/enrollmentService'
import type { Course, Enrollment } from '../../types/course'

export function InstructorDashboard() {
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [loadingEnrollments, setLoadingEnrollments] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsubCourses = subscribeToInstructorCourses(
      user.uid,
      (data) => {
        setCourses(data)
        setLoadingCourses(false)
      },
      (error) => {
        enqueueSnackbar(error.message, { variant: 'error' })
        setLoadingCourses(false)
      }
    )

    const unsubEnrollments = subscribeToInstructorEnrollments(
      user.uid,
      (data) => {
        setEnrollments(data)
        setLoadingEnrollments(false)
      },
      (error) => {
        enqueueSnackbar(error.message, { variant: 'error' })
        setLoadingEnrollments(false)
      }
    )

    return () => {
      unsubCourses()
      unsubEnrollments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid])

  const enrolledCountFor = (courseId: string) =>
    enrollments.filter((e) => e.courseId === courseId).length

  const loading = loadingCourses || loadingEnrollments

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Hello, {user?.displayName} 👋
        </Typography>
        <Typography color="text.secondary">
          Here's an overview of your courses.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {courses.length}
              </Typography>
              <Typography color="text.secondary">
                Courses Created
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {enrollments.length}
              </Typography>
              <Typography color="text.secondary">Total Students</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {courses.length}
              </Typography>
              <Typography color="text.secondary">Active Courses</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Your Courses
        </Typography>
        {courses.length === 0 ? (
          <Typography color="text.secondary">
            You haven't created any courses yet.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {courses.map((course) => (
              <Grid size={{ xs: 12, sm: 6 }} key={course.id}>
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
                      <Typography variant="caption" color="text.secondary">
                        {enrolledCountFor(course.id)} students ·{' '}
                        {course.duration}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Stack>
  )
}