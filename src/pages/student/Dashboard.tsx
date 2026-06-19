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
    <Stack spacing={3.5}>
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          color: 'white',
          background:
            'linear-gradient(135deg, rgba(37, 99, 235, 0.96), rgba(15, 118, 110, 0.9))',
          boxShadow: '0 22px 55px rgba(37, 99, 235, 0.22)',
        }}
      >
        <Typography variant="h4">
          Welcome back, {user?.displayName}
        </Typography>
        <Typography sx={{ mt: 1, color: 'rgba(255,255,255,0.78)', maxWidth: 620 }}>
          Track progress, continue active courses, and keep momentum visible.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {[
          { label: 'Enrolled Courses', value: enrollments.length, color: 'primary.main' },
          { label: 'In Progress', value: activeCount, color: 'secondary.main' },
          { label: 'Completed', value: completedCount, color: '#111827' },
        ].map((stat) => (
          <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
            <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box
                sx={{
                  width: 38,
                  height: 4,
                  borderRadius: 999,
                  bgcolor: stat.color,
                  mb: 2,
                }}
              />
              <Typography variant="h4">
                {stat.value}
              </Typography>
              <Typography color="text.secondary">
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        ))}
      </Grid>

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Continue Learning
        </Typography>
        {enrollments.length === 0 ? (
          <Card variant="outlined">
            <CardContent sx={{ py: 5, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No enrollments yet. Browse courses to get started.
          </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {enrollments.map((enrollment) => (
              <Grid size={{ xs: 12, sm: 6 }} key={enrollment.id}>
                <Card variant="outlined">
                  <CardContent sx={{ display: 'grid', gap: 1 }}>
                    <Typography sx={{ fontWeight: 800 }}>
                      {enrollment.courseTitle}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{ fontWeight: 800, textTransform: 'uppercase' }}
                    >
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
