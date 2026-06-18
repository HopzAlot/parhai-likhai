import { Card, CardContent, Grid, Stack, Typography, Chip } from '@mui/material'
import { ALL_COURSES, STUDENT_ENROLLED_IDS } from '../../constants/courses'

export function StudentMyCourses() {
  const enrolled = ALL_COURSES.filter((c) => STUDENT_ENROLLED_IDS.includes(c.id))

  return (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>My Courses</Typography>
      <Grid container spacing={2}>
        {enrolled.map((course) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1}>
                  <Chip label={course.category} size="small" color="primary" sx={{ alignSelf: 'flex-start' }} />
                  <Typography sx={{ fontWeight: 600 }}>{course.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{course.instructor}</Typography>
                  <Typography variant="caption" color="text.secondary">{course.duration}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}