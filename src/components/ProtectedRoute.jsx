// frontend/src/components/ProtectedRoute.jsx
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  // while we check session, avoid flicker
  if (loading) return <div className="p-8 text-center">Checking authentication...</div>

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
