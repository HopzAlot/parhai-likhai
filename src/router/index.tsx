import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { RoleRoute } from '../components/RoleRoute'
import { AppLayout } from '../components/layouts/AppLayout'
import { Login } from '../pages/auth/Login'
import { Register } from '../pages/auth/Register'
import { StudentDashboard } from '../pages/student/Dashboard'
import { StudentMyCourses } from '../pages/student/MyCourses'
import { BrowseCourses } from '../pages/student/BrowseCourses'
import { RegisterCourse } from '../pages/student/RegisterCourse'
import { InstructorDashboard } from '../pages/instructor/Dashboard'
import { InstructorMyCourses } from '../pages/instructor/MyCourses'
import { CreateCourse } from '../pages/instructor/CreateCourse'
import { NotFound } from '../pages/NotFound'
import { PublicRoute } from '../components/PublicRoute'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to={ROUTES.LOGIN} replace /> },

{
  path: ROUTES.LOGIN,
  element: (
    <PublicRoute>
      <Login />
    </PublicRoute>
  ),
},
{
  path: ROUTES.REGISTER,
  element: (
    <PublicRoute>
      <Register />
    </PublicRoute>
  ),
},

  {
    path: '/student',
    element: (
      <ProtectedRoute>
        <RoleRoute role="student">
          <AppLayout role="student" />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={ROUTES.STUDENT_DASHBOARD} replace /> },
      { path: 'dashboard', element: <StudentDashboard /> },
      { path: 'my-courses', element: <StudentMyCourses /> },
      { path: 'browse', element: <BrowseCourses /> },
      { path: 'register/:courseId', element: <RegisterCourse /> },
    ],
  },

  {
    path: '/instructor',
    element: (
      <ProtectedRoute>
        <RoleRoute role="instructor">
          <AppLayout role="instructor" />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={ROUTES.INSTRUCTOR_DASHBOARD} replace /> },
      { path: 'dashboard', element: <InstructorDashboard /> },
      { path: 'my-courses', element: <InstructorMyCourses /> },
      { path: 'create-course', element: <CreateCourse /> },
    ],
  },

  { path: '*', element: <NotFound /> },
])
