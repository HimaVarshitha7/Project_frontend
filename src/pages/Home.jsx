// frontend/src/pages/Home.jsx
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../components/AuthProvider'

export default function Home() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  function goSignup() {
    if (user) navigate('/dashboard')
    else navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">

      {/* HERO */}
      <div className="flex flex-col items-center justify-center text-center flex-1 px-6 pt-12">
        <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
          Evaluate Your Coding Tasks with <br />
          <span className="text-indigo-600">AI-Powered Precision</span>
        </h2>

        <p className="mt-4 text-gray-600 max-w-xl">
          Upload your coding assignments, get instant AI feedback, and unlock professional reports.
        </p>

        {/* LOGIN + SIGNUP CARDS */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl">

          {/* LOGIN */}
          <Link
            to="/login"
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer border border-gray-200"
          >
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 text-3xl">🔑</span>
              </div>
              <h3 className="text-xl font-semibold mt-4">Login</h3>
              <p className="text-gray-600 text-sm mt-2">
                Already have an account? Access your dashboard.
              </p>
            </div>
          </Link>

          {/* SIGNUP — button for logic */}
          <button
            onClick={goSignup}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer border border-gray-200"
          >
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold mt-4">Signup</h3>
              <p className="text-gray-600 text-sm mt-2">
                Create a new account to start evaluating your tasks with AI.
              </p>
            </div>
          </button>

        </div>
      </div>

      <footer className="py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Smart Task Evaluator — All Rights Reserved
      </footer>
    </div>
  )
}
