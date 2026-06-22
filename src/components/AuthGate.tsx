import type { ReactNode } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../constants/routes'
import type { Role } from '../types/auth'

type AuthGateProps =
  | {
      mode: 'public'
      children: ReactNode
    }
  | {
      mode: 'role'
      role: Role
      children: ReactNode
    }

function LoadingScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  )
}

function getRoleHome(role: Role) {
  return role === 'student'
    ? ROUTES.STUDENT_DASHBOARD
    : ROUTES.INSTRUCTOR_DASHBOARD
}

export function AuthGate(props: AuthGateProps) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />

  if (props.mode === 'public') {
    if (user) return <Navigate replace to={getRoleHome(user.role)} />
    return <>{props.children}</>
  }

  if (!user) return <Navigate replace to={ROUTES.LOGIN} />

  if (user.role !== props.role) {
    return <Navigate replace to={getRoleHome(user.role)} />
  }

  return <>{props.children}</>
}
