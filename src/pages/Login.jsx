// frontend/src/pages/Login.jsx
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../components/AuthProvider'
import { supabase } from '../lib/supabaseClient'

export default function Login() {

  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // ⭐ If already logged in → redirect to dashboard
  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user, navigate])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      navigate('/dashboard')

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white/80 backdrop-blur-xl shadow-lg p-8 rounded-2xl w-full max-w-md border border-white/30"
      >

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Welcome Back 👋
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-3">{error}</p>
        )}

        {/* Email */}
        <label className="block text-sm mb-1 font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="you@example.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        {/* Password */}
        <label className="block text-sm mb-1 font-medium text-gray-700">Password</label>
        <input
          type="password"
          required
          className="w-full p-3 border rounded-lg mb-6 focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="Your password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg font-semibold"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

      </form>
    </main>
  )
}
