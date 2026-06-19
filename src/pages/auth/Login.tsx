import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes'

export function Login() {
  const { login, loginWithGoogle, user } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

useEffect(() => {
  if (user) {
    navigate(
      user.role === 'student'
        ? ROUTES.STUDENT_DASHBOARD
        : ROUTES.INSTRUCTOR_DASHBOARD,
      { replace: true }
    )
  }
}, [user, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const loggedInUser = await login(email, password)

navigate(
  loggedInUser.role === 'student'
    ? ROUTES.STUDENT_DASHBOARD
    : ROUTES.INSTRUCTOR_DASHBOARD,
  { replace: true }
)
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')

    try {
      const loggedInUser = await loginWithGoogle('student')

      navigate(
        loggedInUser.role === 'student'
          ? ROUTES.STUDENT_DASHBOARD
          : ROUTES.INSTRUCTOR_DASHBOARD,
        { replace: true }
      )
    } catch {
      setError('Google sign-in failed.')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: 5,
        background:
          'linear-gradient(135deg, rgba(37, 99, 235, 0.12), transparent 36%), #f7f8fb',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 980,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 560,
            p: 5,
            color: 'white',
            background:
              'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(30, 64, 175, 0.88))',
          }}
        >
          <Box>
            <Typography variant="h4">Parhai Likhai</Typography>
            <Typography sx={{ mt: 2, maxWidth: 360, color: 'rgba(255,255,255,0.74)' }}>
              Modern learning workspace for students and instructors.
            </Typography>
          </Box>
          <Stack spacing={2}>
            {['Your goto LMS!','Live course updates', 'Clean progress tracking'].map(
              (item) => (
                <Box
                  key={item}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <Typography sx={{ fontWeight: 700 }}>{item}</Typography>
                </Box>
              )
            )}
          </Stack>
        </Box>

        <Box sx={{ p: { xs: 3, sm: 5 }, display: 'grid', alignContent: 'center' }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4">Welcome back</Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
              Sign in to continue your workspace.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleLogin}>
            <Stack spacing={2}>
              <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
              <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required />
              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </Stack>
          </Box>

          <Divider>or</Divider>

          <Button variant="outlined" fullWidth onClick={handleGoogle}>
            Continue with Google
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} style={{ color: 'inherit' }}>Register</Link>
          </Typography>
        </Stack>
        </Box>
      </Paper>
    </Box>
  )
}
