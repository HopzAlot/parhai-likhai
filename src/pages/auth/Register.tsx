import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Button, Divider, Stack, Typography,
  Alert, ToggleButton, ToggleButtonGroup,
} from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes'
import type { Role } from '../../types/auth'
import { AuthShell } from '../../components/ui/AuthShell'
import { FormTextField } from '../../components/ui/FormTextField'

export function Register() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault()

  setError('')
  setLoading(true)

  try {
    const newUser = await register(
      email,
      password,
      displayName,
      role
    )

    navigate(
      newUser.role === 'student'
        ? ROUTES.STUDENT_DASHBOARD
        : ROUTES.INSTRUCTOR_DASHBOARD,
      { replace: true }
    )
  } catch {
    setError('Registration failed. Email may already be in use.')
  } finally {
    setLoading(false)
  }
}
const handleGoogle = async () => {
  setError('')

  try {
    const user = await loginWithGoogle(role)

    navigate(
      user.role === 'student'
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
      title="Create account"
      panelTitle="Parhai Likhai"
      subtitle="Join as student or instructor."
      panelSubtitle="Create, enroll, and manage courses from one focused dashboard."
      features={[
        'Student learning paths',
        'Instructor course studio',
        'Firebase backed records',
      ]}
      accent="secondary"
    >
      {error && <Alert severity="error">{error}</Alert>}

      <div>
        <Typography variant="body2" gutterBottom>
          I am a:
        </Typography>
        <ToggleButtonGroup
          value={role}
          exclusive
          onChange={(_, val) => val && setRole(val)}
          fullWidth
          size="small"
        >
          <ToggleButton value="student">Student</ToggleButton>
          <ToggleButton value="instructor">Instructor</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <form onSubmit={handleRegister}>
        <Stack spacing={2}>
          <FormTextField
            label="Full name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
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
            helperText="At least 6 characters"
          />
          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </Stack>
      </form>

      <Divider>or</Divider>

      <Button variant="outlined" fullWidth onClick={handleGoogle}>
        Continue with Google as {role}
      </Button>

      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} style={{ color: 'inherit' }}>
          Sign in
        </Link>
      </Typography>
    </AuthShell>
  )
}
