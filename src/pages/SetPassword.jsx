import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function SetPassword() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [validSession, setValidSession] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setValidSession(!!data?.session)
      setSessionReady(true)
    })
  }, [])

  async function handleSetPassword(e) {
    e.preventDefault()
    if (password.length < 8)
      return alert("Password must be at least 8 characters.")

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData?.session?.user?.id

      const name = localStorage.getItem('signup_name')
      const phone = localStorage.getItem('signup_phone')
      const email = localStorage.getItem('signup_email')

      if (userId) {
        await supabase.from('profiles').upsert({
          id: userId,
          email,
          full_name: name,
          phone
        })
      }

      localStorage.clear()
      alert("Password created successfully! ❤️")
      navigate('/login')

    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!sessionReady)
    return <div className="p-6 text-center">Checking your session...</div>

  if (!validSession)
    return (
      <div className="p-6 text-center">
        <h2>No active session</h2>
        <p>Please click the magic link from your email again.</p>
      </div>
    )

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-6">
      <form 
        onSubmit={handleSetPassword}
        className="bg-white/80 backdrop-blur-xl shadow-lg p-8 rounded-2xl w-full max-w-md border border-white/30"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Set Your Password 🔐
        </h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
        <div className="relative mb-6">
          <input
            required
            type={showPassword ? "text" : "password"}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            placeholder="Enter new password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <span 
            className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={()=>setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </span>
        </div>

        <button 
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 transition text-white rounded-lg font-semibold"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Set Password"}
        </button>
      </form>
    </main>
  )
}
