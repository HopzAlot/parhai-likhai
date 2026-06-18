import { Box, Card, CardContent, Grid, Typography, Stack } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { ALL_COURSES, STUDENT_ENROLLED_IDS } from '../../constants/courses'

export function StudentDashboard() {
  const { user } = useAuth()
  const enrolled = ALL_COURSES.filter((c) => STUDENT_ENROLLED_IDS.includes(c.id))

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Welcome back, {user?.displayName} 👋</Typography>
        <Typography color="text.secondary">Here's what's happening with your courses.</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card><CardContent>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{enrolled.length}</Typography>
            <Typography color="text.secondary">Enrolled Courses</Typography>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card><CardContent>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>1</Typography>
            <Typography color="text.secondary">In Progress</Typography>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card><CardContent>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>0</Typography>
            <Typography color="text.secondary">Completed</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Continue Learning</Typography>
        <Grid container spacing={2}>
          {enrolled.map((course) => (
            <Grid size={{ xs: 12, sm: 6 }} key={course.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography sx={{ fontWeight: 600 }}>{course.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{course.instructor}</Typography>
                  <Typography variant="caption" color="primary">{course.category} · {course.duration}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  )
}