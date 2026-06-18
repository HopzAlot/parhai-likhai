import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box, Button, Divider, Paper, Stack, TextField, Typography,
  Alert, ToggleButton, ToggleButtonGroup,
} from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes'
import type { Role } from '../../types/auth'

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
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 420 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Create account</Typography>
            <Typography color="text.secondary" variant="body2">Join LMS as a student or instructor</Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <Box>
            <Typography variant="body2" gutterBottom>I am a:</Typography>
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
          </Box>

          <Box component="form" onSubmit={handleRegister}>
            <Stack spacing={2}>
              <TextField label="Full name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} fullWidth required />
              <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
              <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required helperText="At least 6 characters" />
              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </Stack>
          </Box>

          <Divider>or</Divider>

          <Button variant="outlined" fullWidth onClick={handleGoogle}>
            Continue with Google as {role}
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} style={{ color: 'inherit' }}>Sign in</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}