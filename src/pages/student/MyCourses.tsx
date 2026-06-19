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
import { subscribeToStudentEnrollments } from '../../services/enrollmentService'
import type { Enrollment } from '../../types/course'

export function StudentMyCourses() {
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

      {enrollments.length === 0 ? (
        <Typography color="text.secondary">
          You haven't enrolled in any courses yet. Browse courses to get
          started.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {enrollments.map((enrollment) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={enrollment.id}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Chip
                      label={enrollment.status}
                      size="small"
                      color={
                        enrollment.status === 'completed'
                          ? 'success'
                          : 'primary'
                      }
                      sx={{ alignSelf: 'flex-start' }}
                    />
                    <Typography sx={{ fontWeight: 600 }}>
                      {enrollment.courseTitle}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  )
}