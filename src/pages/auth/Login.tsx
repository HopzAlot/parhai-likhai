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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 420 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Welcome back</Typography>
            <Typography color="text.secondary" variant="body2">Sign in to your LMS account</Typography>
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
      </Paper>
    </Box>
  )
}