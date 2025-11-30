import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import { FiUpload, FiLoader, FiCheckCircle } from "react-icons/fi";

export default function SubmitTask() {
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [evaluation, setEvaluation] = useState(null);

  async function handleUploadAndEvaluate(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user?.id) {
        throw new Error("You must be logged in to submit a task.");
      }

      let task = null;

      // If a file is attached, upload it first
      if (file) {
        const form = new FormData();
        form.append("file", file);
        form.append("title", title);
        form.append("description", description);

        const upRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "x-user-id": user.id },
          body: form,
        });

        const text = await upRes.text();
        if (!upRes.ok) {
          const snippet = text?.slice ? text.slice(0, 1000) : String(text);
          throw new Error(`Upload failed: ${snippet}`);
        }

        const upJson = JSON.parse(text || "{}");
        task = upJson.task;
      } else {
        // No file: call evaluate endpoint directly which will create the task
        const createRes = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, user_id: user.id }),
        });

        const text = await createRes.text();
        if (!createRes.ok) {
          const snippet = text?.slice ? text.slice(0, 1000) : String(text);
          throw new Error(`Evaluation failed: ${snippet}`);
        }

        const createJson = JSON.parse(text || "{}");
        console.log("backend returned evaluation:", createJson.evaluation);
        setEvaluation(createJson.evaluation || null);
        return;
      }

      // If we uploaded a file and received a task, request evaluation for that task
      if (task && task.id) {
        const evalRes = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId: task.id }),
        });

        const text = await evalRes.text();
        if (!evalRes.ok) {
          const snippet = text?.slice ? text.slice(0, 1000) : String(text);
          throw new Error(`Evaluation failed: ${snippet}`);
        }

        const evalJson = JSON.parse(text || "{}");
        console.log("backend returned evaluation:", evalJson.evaluation);
        setEvaluation(evalJson.evaluation || null);
      } else {
        throw new Error("Upload succeeded but returned no task id.");
      }
    } catch (err) {
      console.error(err);
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleUploadAndEvaluate}
        className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Submit Your Task
        </h2>

        {/* Title Field */}
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Task Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a short title"
          className="w-full p-3 border rounded-lg mb-4 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
        />

        {/* Description */}
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Task Description / Code
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="7"
          placeholder="Paste your code or describe your task here..."
          className="w-full p-3 border rounded-lg mb-6 shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
        ></textarea>

        {/* File Upload Box */}
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Attach File (Optional)
        </label>

        <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition">
          <label className="cursor-pointer flex items-center gap-3 w-full">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100">
              <FiUpload className="text-indigo-600 text-2xl" />
            </div>
            <span className="text-gray-700 font-medium">
              {file ? file.name : "Click to upload file"}
            </span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>

        {/* Submit Button */}
        <button
          className="w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin text-xl" /> Evaluating…
            </>
          ) : (
            "Submit & Evaluate"
          )}
        </button>

        {/* Error message */}
        {error && (
          <p className="mt-4 text-red-600 font-medium text-center">{error}</p>
        )}

        {/* Evaluation Result */}
        {evaluation && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow">
            <div className="flex items-center gap-2 mb-3">
              <FiCheckCircle className="text-green-600 text-2xl" />
              <h3 className="text-xl font-bold text-gray-800">
                AI Evaluation Result
              </h3>
            </div>

            <p className="text-lg font-semibold">
              Score: <span className="text-indigo-600">{evaluation.score}/100</span>
            </p>

            <h4 className="font-semibold mt-4">Strengths</h4>
            <ul className="list-disc ml-6 text-gray-700">
              {(evaluation.strengths || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <h4 className="font-semibold mt-4">Improvements</h4>
            <ul className="list-disc ml-6 text-gray-700">
              {(evaluation.improvements || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <div className="mt-4">
              {evaluation.unlocked ? (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Full Report
                  </h4>
                  <pre className="whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-sm">
                    {evaluation.full_report}
                  </pre>
                </div>
              ) : (
                <Link
                  to="/pay"
                  state={{ evaluationId: evaluation.id }}
                  className="inline-block mt-3 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                >
                  Unlock Full Report
                </Link>
              )}
            </div>
          </div>
        )}
      </form>
    </main>
  );
}
