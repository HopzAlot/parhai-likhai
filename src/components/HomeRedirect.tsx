import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../constants/routes'

export function HomeRedirect() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return (
    <Navigate
      replace
      to={
        user.role === 'student'
          ? ROUTES.STUDENT_DASHBOARD
          : ROUTES.INSTRUCTOR_DASHBOARD
      }
    />
  )
}