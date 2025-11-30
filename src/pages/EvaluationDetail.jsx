// frontend/src/pages/EvaluationDetail.jsx
import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AuthContext } from '../components/AuthProvider'

export default function EvaluationDetail() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        if (!user?.id) {
          throw new Error('You must be logged in to view this evaluation.')
        }

        const res = await fetch('/api/evaluation/' + id, { headers: { 'x-user-id': user.id } })
        const text = await res.text()

        if (!res.ok) {
          const snippet = text?.slice ? text.slice(0, 800) : String(text)
          throw new Error(`API error (${res.status}): ${snippet}`)
        }

        let j
        try {
          j = JSON.parse(text)
        } catch (e) {
          throw new Error('Invalid JSON from /api/evaluation — response preview: ' + (text.slice(0, 800)))
        }

        setEvaluation(j.evaluation)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (user) load()
  }, [id, user])

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600 break-words">{error}</div>
  if (!evaluation) return <div className="p-8">No evaluation found.</div>

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-2">{evaluation.tasks?.title}</h1>
        <div className="text-sm text-gray-500 mb-4">Submitted: {new Date(evaluation.created_at).toLocaleString()}</div>

        <h3 className="font-semibold">Score: {evaluation.score}</h3>

        <h4 className="mt-4 font-medium">Strengths</h4>
        <ul className="list-disc ml-6">
          {evaluation.strengths?.map((s, i) => <li key={i}>{s}</li>)}
        </ul>

        <h4 className="mt-4 font-medium">Improvements</h4>
        <ul className="list-disc ml-6">
          {evaluation.improvements?.map((s, i) => <li key={i}>{s}</li>)}
        </ul>

        <h4 className="mt-4 font-medium">Full Report</h4>
        {evaluation.unlocked ? (
          <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">{evaluation.full_report}</pre>
        ) : (
          <div>
            <p className="text-sm text-gray-600">Full report is locked. Please pay to unlock.</p>
            <div className="mt-3">
              <Link
                to="/pay"
                state={{ evaluationId: evaluation.id }}
                className="inline-block px-3 py-2 bg-green-600 text-white rounded"
              >
                Unlock Full Report
              </Link>
            </div>
          </div>
        )}

       {evaluation.tasks?.file_url && (
  <div className="mt-4">
    <h4 className="font-medium">Attached File</h4>

    {/* compute absolute URL: if file_url already starts with http, use it; otherwise prefix backend base */}
    {(() => {
      const fileUrl = evaluation.tasks.file_url || ''
      const isAbsolute = fileUrl.startsWith('http://') || fileUrl.startsWith('https://')
      const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787'
      const href = isAbsolute ? fileUrl : `${backend.replace(/\/$/, '')}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`
      return (
        <a
          className="text-indigo-600"
          href={href}
          target="_blank"
          rel="noreferrer"
          download
        >
          Download attachment
        </a>
      )
    })()}
  </div>
)}

      </div>
    </main>
  )
}
