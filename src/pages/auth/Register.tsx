import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Button, Divider, Stack, Typography,
  Alert,
} from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes'
import type { Role } from '../../types/auth'
import { AuthShell } from '../../components/ui/AuthShell'
import { FormTextField } from '../../components/forms/FormTextField'
import { FormRadioGroup } from '../../components/forms/FormRadioGroup'

type RegisterFormValues = {
  displayName: string
  email: string
  password: string
  role: Role
}

export function Register() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit, watch } = useForm<RegisterFormValues>({
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      role: 'student',
    },
  })
  const role = watch('role')

const handleRegister = async (values: RegisterFormValues) => {
  setError('')
  setLoading(true)

  try {
    const newUser = await register(
      values.email,
      values.password,
      values.displayName,
      values.role
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

      <FormRadioGroup
        control={control}
        name="role"
        label="I am a"
        options={['student', 'instructor']}
      />

      <form noValidate onSubmit={handleSubmit(handleRegister)}>
        <Stack spacing={2}>
          <FormTextField
            control={control}
            name="displayName"
            label="Full name"
            required
          />
          <FormTextField
            control={control}
            name="email"
            label="Email"
            type="email"
            required
          />
          <FormTextField
            control={control}
            name="password"
            label="Password"
            type="password"
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
