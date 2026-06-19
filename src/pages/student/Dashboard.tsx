import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useAuth } from '../../hooks/useAuth'
import { subscribeToStudentEnrollments } from '../../services/enrollmentService'
import type { Enrollment } from '../../types/course'

export function StudentDashboard() {
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()

  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsub = subscribeToStudentEnrollments(
      user.uid,
      (data) => {
        setEnrollments(data)
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

  const activeCount = enrollments.filter((e) => e.status === 'active').length
  const completedCount = enrollments.filter(
    (e) => e.status === 'completed'
  ).length

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
          Welcome back, {user?.displayName} 👋
        </Typography>
        <Typography color="text.secondary">
          Here's what's happening with your courses.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {enrollments.length}
              </Typography>
              <Typography color="text.secondary">
                Enrolled Courses
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {activeCount}
              </Typography>
              <Typography color="text.secondary">In Progress</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {completedCount}
              </Typography>
              <Typography color="text.secondary">Completed</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Continue Learning
        </Typography>
        {enrollments.length === 0 ? (
          <Typography color="text.secondary">
            No enrollments yet. Browse courses to get started.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {enrollments.map((enrollment) => (
              <Grid size={{ xs: 12, sm: 6 }} key={enrollment.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography sx={{ fontWeight: 600 }}>
                      {enrollment.courseTitle}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      {enrollment.status}
                    </Typography>
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