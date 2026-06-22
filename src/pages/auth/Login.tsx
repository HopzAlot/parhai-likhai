import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Button,
  Divider,
  Stack,
  Typography,
  Alert,
} from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes'
import { AuthShell } from '../../components/ui/AuthShell'
import { FormTextField } from '../../components/ui/FormTextField'

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
    <AuthShell
      title="Welcome back"
      panelTitle="Parhai Likhai"
      subtitle="Sign in to continue your workspace."
      panelSubtitle="Modern learning workspace for students and instructors."
      features={['Your goto LMS!', 'Live course updates', 'Clean progress tracking']}
    >
      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleLogin}>
        <Stack spacing={2}>
          <FormTextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormTextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </Stack>
      </form>

      <Divider>or</Divider>

      <Button variant="outlined" fullWidth onClick={handleGoogle}>
        Continue with Google
      </Button>

      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} style={{ color: 'inherit' }}>
          Register
        </Link>
      </Typography>
    </AuthShell>
  )
}
