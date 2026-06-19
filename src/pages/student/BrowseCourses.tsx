import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { subscribeToAllCourses } from '../../services/courseService'
import type { Course } from '../../types/course'

export function BrowseCourses() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToAllCourses(
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
  }, [])

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
        <Typography variant="h5">Browse Courses</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Find courses that match your next skill goal.
        </Typography>
      </Box>

      {courses.length === 0 ? (
        <Card variant="outlined">
          <CardContent sx={{ py: 5, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No courses available yet. Check back soon.
            </Typography>
          </CardContent>
        </Card>
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
                      {course.instructorName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {course.duration}
                    </Typography>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ alignSelf: 'flex-start', mt: 1.5 }}
                      onClick={() =>
                        navigate(`/student/register/${course.id}`)
                      }
                    >
                      Register
                    </Button>
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
