import React from 'react'
import { Link } from 'react-router-dom'
import { FiUploadCloud, FiEye, FiCreditCard } from 'react-icons/fi'

export default function Dashboard() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 tracking-tight">
          Welcome to Your Dashboard
        </h1>

        <p className="text-gray-600 mb-10">
          Quickly access your tools, submit new tasks, and track your AI-powered evaluations.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Submit Task */}
          <Link
            to="/submit-task"
            className="group p-6 bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-200"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 mb-4 group-hover:bg-indigo-200 transition">
              <FiUploadCloud className="text-indigo-600 text-3xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition">
              Submit Task
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Upload your code or file and let AI evaluate your work instantly.
            </p>
          </Link>

          {/* View Evaluations */}
          <Link
            to="/evaluations"
            className="group p-6 bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-200"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-4 group-hover:bg-blue-200 transition">
              <FiEye className="text-blue-600 text-3xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition">
              View Evaluations
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Access detailed AI feedback on all tasks you've submitted.
            </p>
          </Link>

          {/* Payment Page */}
          <Link
            to="/pay"
            className="group p-6 bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-200"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4 group-hover:bg-green-200 transition">
              <FiCreditCard className="text-green-600 text-3xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 group-hover:text-green-600 transition">
              Payment
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Unlock full AI reports and view your payment history.
            </p>
          </Link>

        </div>
      </div>
    </main>
  )
}
