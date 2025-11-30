// frontend/src/pages/Signup.jsx
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../components/AuthProvider'
import { supabase } from '../lib/supabaseClient'

export default function Signup() {

  // if user logged in → auto redirect to dashboard
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user, navigate])

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)

    try {
      // store values to use after magic-link redirect
      localStorage.setItem('signup_name', name)
      localStorage.setItem('signup_phone', phone)
      localStorage.setItem('signup_email', email)

      const redirectTo = `${import.meta.env.VITE_APP_URL}/set-password`

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo }
      })

      if (error) throw error

      alert("Magic link sent to your email. Open it to create your password ❤️")
      navigate('/login')

    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 p-6">
      <form
        onSubmit={handleSignup}
        className="bg-white/80 backdrop-blur-xl shadow-lg p-8 rounded-2xl w-full max-w-md border border-white/30"
      >

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Create Account ✨
        </h2>

        <label className="block text-sm mb-1 font-medium text-gray-700">Full Name</label>
        <input
          required
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-purple-400 outline-none"
          placeholder="Your Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <label className="block text-sm mb-1 font-medium text-gray-700">Phone Number</label>
        <input
          required
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-purple-400 outline-none"
          placeholder="+91xxxxxxxx"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
        />

        <label className="block text-sm mb-1 font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          className="w-full p-3 border rounded-lg mb-6 focus:ring-2 focus:ring-purple-400 outline-none"
          placeholder="you@example.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <button
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 transition text-white rounded-lg font-semibold"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>

        <p className="text-center mt-4 text-gray-600 text-sm">
          You'll receive a mail to create your password.
        </p>

      </form>
    </main>
  )
}
