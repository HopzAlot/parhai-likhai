import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '../config/firebase'
import type { AuthUser, Role } from '../types/auth'

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  loginWithGoogle: (role: Role) => Promise<AuthUser>
  register: (
    email: string,
    password: string,
    displayName: string,
    role: Role
  ) => Promise<AuthUser>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid))

        if (snap.exists()) {
          const data = snap.data()

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            displayName: firebaseUser.displayName ?? '',
            role: data.role as Role,
          })
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return unsub
  }, [])

  const saveUserToFirestore = async (
    uid: string,
    email: string,
    displayName: string,
    role: Role
  ) => {
    await setDoc(doc(db, 'users', uid), {
      uid,
      email,
      displayName,
      role,
    })
  }

  const login = async (
    email: string,
    password: string
  ): Promise<AuthUser> => {
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

    const snap = await getDoc(doc(db, 'users', result.user.uid))

    if (!snap.exists()) {
      throw new Error('User profile not found')
    }

    const data = snap.data()

    const authUser: AuthUser = {
      uid: result.user.uid,
      email: result.user.email ?? '',
      displayName: result.user.displayName ?? '',
      role: data.role as Role,
    }

    setUser(authUser)

    return authUser
  }

  const loginWithGoogle = async (
    role: Role
  ): Promise<AuthUser> => {
    const result = await signInWithPopup(auth, googleProvider)

    const { uid, email, displayName } = result.user

    let userRole = role

    const snap = await getDoc(doc(db, 'users', uid))

    if (!snap.exists()) {
      await saveUserToFirestore(
        uid,
        email ?? '',
        displayName ?? '',
        role
      )
    } else {
      userRole = snap.data().role as Role
    }

    const authUser: AuthUser = {
      uid,
      email: email ?? '',
      displayName: displayName ?? '',
      role: userRole,
    }

    setUser(authUser)

    return authUser
  }

  const register = async (
    email: string,
    password: string,
    displayName: string,
    role: Role
  ): Promise<AuthUser> => {
    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    await updateProfile(result.user, {
      displayName,
    })

    await saveUserToFirestore(
      result.user.uid,
      email,
      displayName,
      role
    )

    const authUser: AuthUser = {
      uid: result.user.uid,
      email,
      displayName,
      role,
    }

    setUser(authUser)

    return authUser
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}