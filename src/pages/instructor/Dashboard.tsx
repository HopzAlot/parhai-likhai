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
import { EmptyState } from '../../components/ui/EmptyState'
import { StatCard } from '../../components/ui/StatCard'

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
    <Stack spacing={3.5}>
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          color: 'white',
          background:
            'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(15, 118, 110, 0.92))',
          boxShadow: '0 22px 55px rgba(15, 118, 110, 0.18)',
        }}
      >
        <Typography variant="h4">
          Hello, {user?.displayName}
        </Typography>
        <Typography sx={{ mt: 1, color: 'rgba(255,255,255,0.74)', maxWidth: 620 }}>
          Monitor course inventory, student activity, and publishing momentum.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {[
          { label: 'Courses Created', value: courses.length, color: 'secondary.main' },
          { label: 'Total Students', value: enrollments.length, color: 'primary.main' },
          { label: 'Active Courses', value: courses.length, color: '#111827' },
        ].map((stat) => (
          <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Your Courses
        </Typography>
        {courses.length === 0 ? (
          <EmptyState message="You haven't created any courses yet." />
        ) : (
          <Grid container spacing={2}>
            {courses.map((course) => (
              <Grid size={{ xs: 12, sm: 6 }} key={course.id}>
                <Card variant="outlined">
                  <CardContent sx={{ display: 'grid', gap: 1 }}>
                    <Stack spacing={1}>
                      <Chip
                        label={course.category}
                        size="small"
                        color="secondary"
                        sx={{ alignSelf: 'flex-start' }}
                      />
                      <Typography sx={{ fontWeight: 800 }}>
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
