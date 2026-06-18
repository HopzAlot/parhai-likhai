import { Card, CardContent, Grid, Stack, Typography, Chip } from '@mui/material'
import { ALL_COURSES } from '../../constants/courses'

export function BrowseCourses() {
  return (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>Browse Courses</Typography>
      <Grid container spacing={2}>
        {ALL_COURSES.map((course) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1}>
                  <Chip label={course.category} size="small" color="secondary" sx={{ alignSelf: 'flex-start' }} />
                  <Typography sx={{ fontWeight: 600 }}>{course.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{course.instructor}</Typography>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">{course.duration}</Typography>
                    <Typography variant="caption" color="text.secondary">{course.enrolled} enrolled</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}