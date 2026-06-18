import { Box, Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../constants/routes'

export function NotFound() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const home = user
    ? user.role === 'student' ? ROUTES.STUDENT_DASHBOARD : ROUTES.INSTRUCTOR_DASHBOARD
    : ROUTES.LOGIN

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack spacing={2} sx={{ textAlign: 'center' }}>
        <Typography variant="h1" sx={{ fontWeight: 700, fontSize: '6rem', color: 'text.disabled' }}>404</Typography>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Page not found</Typography>
        <Typography color="text.secondary">The page you're looking for doesn't exist.</Typography>
        <Button variant="contained" onClick={() => navigate(home)}>Go home</Button>
      </Stack>
    </Box>
  )
}