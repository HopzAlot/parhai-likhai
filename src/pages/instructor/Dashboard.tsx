import { Box, Card, CardContent, Grid, Stack, Typography, Chip } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { ALL_COURSES, INSTRUCTOR_COURSE_IDS } from '../../constants/courses'

export function InstructorDashboard() {
  const { user } = useAuth()
  const myIds = INSTRUCTOR_COURSE_IDS[user?.email ?? ''] ?? []
  const myCourses = ALL_COURSES.filter((c) => myIds.includes(c.id))

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Hello, {user?.displayName} 👋</Typography>
        <Typography color="text.secondary">Here's an overview of your courses.</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card><CardContent>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{myCourses.length}</Typography>
            <Typography color="text.secondary">Courses Created</Typography>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card><CardContent>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{myCourses.reduce((sum, c) => sum + c.enrolled, 0)}</Typography>
            <Typography color="text.secondary">Total Students</Typography>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card><CardContent>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{myCourses.length}</Typography>
            <Typography color="text.secondary">Active Courses</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Your Courses</Typography>
        <Grid container spacing={2}>
          {myCourses.map((course) => (
            <Grid size={{ xs: 12, sm: 6 }} key={course.id}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Chip label={course.category} size="small" color="secondary" sx={{ alignSelf: 'flex-start' }} />
                    <Typography sx={{ fontWeight: 600 }}>{course.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{course.enrolled} students · {course.duration}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  )
}