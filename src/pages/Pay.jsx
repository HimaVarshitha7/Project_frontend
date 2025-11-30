import React, { useContext, useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";

export default function Pay() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const evalIdFromQuery = searchParams.get("evaluationId") || searchParams.get("eval");
  const evalIdFromState = location.state?.evaluationId;
  const [evalId, setEvalId] = useState(evalIdFromQuery || evalIdFromState || "");
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (evalIdFromQuery && !evalId) setEvalId(evalIdFromQuery);
    if (evalIdFromState && !evalId) setEvalId(evalIdFromState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evalIdFromQuery, evalIdFromState]);

  async function handleCheckout() {
    if (!evalId) {
      alert("No evaluation id provided. Please paste the evaluation id or open Pay from a report.");
      return;
    }
    if (!user?.id) {
      alert("You must be logged in to pay. Please login first.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ evaluationId: evalId }),
      });

      const text = await res.text();
      if (!res.ok) {
        const snippet = text?.slice ? text.slice(0, 1000) : String(text);
        throw new Error(`Checkout failed: ${res.status} - ${snippet}`);
      }

      const { url } = JSON.parse(text || "{}");
      if (!url) throw new Error("Checkout did not return a URL.");
      window.location.href = url;
    } catch (err) {
      console.error("create-checkout error", err);
      alert(err.message || "Checkout error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white mt-8 rounded shadow">
      <h2 className="text-xl mb-4">Unlock Full Report</h2>
      <p>Pay $4.99 to unlock the full evaluation report.</p>

      <label className="block text-sm mt-4 mb-1">Evaluation ID</label>
      <input
        value={evalId}
        onChange={(e) => setEvalId(e.target.value)}
        placeholder="Paste evaluation id or open pay from a report"
        className="w-full p-2 border rounded mb-3"
      />

      <div className="mt-4">
        <button
          onClick={handleCheckout}
          className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600"}`}
          disabled={loading}
        >
          {loading ? "Redirecting..." : "Pay & Unlock"}
        </button>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        If you clicked Unlock from a report, it should auto-fill. Otherwise paste the evaluation id here.
      </p>
    </div>
  );
}
