import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../constants/routes'
import type { Role } from '../types/auth'
import type { ReactNode } from 'react'

type RoleRouteProps = {
  role: Role
  children: ReactNode
}

export function RoleRoute({ role, children }: RoleRouteProps) {
  const { user } = useAuth()

  if (!user) return <Navigate to={ROUTES.LOGIN} replace />

  if (user.role !== role) {
    const fallback = user.role === 'student'
      ? ROUTES.STUDENT_DASHBOARD
      : ROUTES.INSTRUCTOR_DASHBOARD
    return <Navigate to={fallback} replace />
  }

  return <>{children}</>
}