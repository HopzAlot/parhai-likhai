export type Role = 'student' | 'instructor'

export type AuthUser = {
  uid: string
  email: string
  displayName: string
  role: Role
}