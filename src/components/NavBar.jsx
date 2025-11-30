// frontend/src/components/NavBar.jsx
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'
import { supabase } from '../lib/supabaseClient'

export default function NavBar() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  function goSignup() {
    if (user) navigate('/dashboard')
    else navigate('/login')
  }

  return (
    <nav className="w-full py-4 bg-white/80 backdrop-blur shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6">

        <Link to="/" className="text-2xl font-bold text-indigo-600">
          Smart Task Evaluator
        </Link>

        <div className="flex items-center gap-4">

          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
              <Link to="/submit-task" className="text-gray-700 hover:text-indigo-600">Submit Task</Link>
              <Link to="/evaluations" className="text-gray-700 hover:text-indigo-600">Evaluations</Link>
              <Link to="/pay" className="text-gray-700 hover:text-indigo-600">Payment</Link>

              <div className="ml-4 flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm">
                  {user.email ?? user.id}
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-500 text-white rounded">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
              <button onClick={goSignup} className="text-gray-700 hover:text-indigo-600">
                Signup
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  )
}
