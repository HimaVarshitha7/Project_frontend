// frontend/src/pages/Evaluations.jsx
import React, {useState, useEffect, useContext} from 'react'
import { AuthContext } from '../components/AuthProvider'
import { Link } from 'react-router-dom'

export default function Evaluations(){
  const { user } = useContext(AuthContext)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    async function fetchEvals(){
      setLoading(true)
      try {
        const res = await fetch('/api/evaluations', { headers: { 'x-user-id': user.id } })
        const text = await res.text()

        if (!res.ok) {
          const snippet = text.length > 800 ? text.slice(0,800) + '…' : text
          throw new Error(`API error (${res.status}): ${snippet}`)
        }

        let j
        try { j = JSON.parse(text) }
        catch (e) { throw new Error('Invalid JSON from /api/evaluations — response preview: ' + (text.slice(0,800))) }

        setList(j.evaluations || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchEvals()
  }, [user])

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600 break-words">{error}</div>

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Past Evaluations</h1>
        {list.length===0 && <p>No evaluations found.</p>}
        <div className="space-y-3">
          {list.map(ev => (
            <div key={ev.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
              <div>
                <div className="font-semibold">{ev.tasks?.title || 'Untitled'}</div>
                <div className="text-sm text-gray-500">Score: {ev.score} • {new Date(ev.created_at).toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-2">{ev.full_report ? ev.full_report.slice(0,120) + '...' : ''}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Link to={`/evaluation/${ev.id}`} className="px-3 py-2 bg-indigo-600 text-white rounded">View</Link>
                {!ev.unlocked && <a href={`/pay?evaluationId=${ev.id}`} className="px-3 py-2 bg-green-600 text-white rounded">Unlock</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
