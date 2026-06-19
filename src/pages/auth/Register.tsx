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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: 5,
        background:
          'linear-gradient(135deg, rgba(15, 118, 110, 0.12), transparent 36%), #f7f8fb',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 980,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '0.95fr 1.05fr' },
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
            minHeight: 620,
            p: 5,
            color: 'white',
            background:
              'linear-gradient(145deg, rgba(11, 18, 32, 0.98), rgba(15, 118, 110, 0.88))',
          }}
        >
          <Box>
            <Typography variant="h4">CourseFlow</Typography>
            <Typography sx={{ mt: 2, maxWidth: 360, color: 'rgba(255,255,255,0.74)' }}>
              Create, enroll, and manage courses from one focused dashboard.
            </Typography>
          </Box>
          <Stack spacing={2}>
            {['Student learning paths', 'Instructor course studio', 'Firebase backed records'].map(
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
            <Typography variant="h4">Create account</Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
              Join as student or instructor.
            </Typography>
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
        </Box>
      </Paper>
    </Box>
  )
}
