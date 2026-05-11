"use client";

import { useEffect, useState } from "react";

interface ContextMemory {
  id: number;
  projectId: number;
  summary: string;
  currentStatus: string;
  blockers: string | null;
  nextStep: string;
  createdAt: string;
  updatedAt: string;
}

interface ContextMemoryCardProps {
  projectId: number;
}

export function ContextMemoryCard({ projectId }: ContextMemoryCardProps) {
  const [memory, setMemory] = useState<ContextMemory | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    summary: "",
    currentStatus: "",
    blockers: "",
    nextStep: "",
  });

  useEffect(() => {
    fetch(`/api/context-memory?projectId=${projectId}`)
      .then((r) => r.json())
      .then((data) => {
        setMemory(data);
        if (data) {
          setForm({
            summary: data.summary,
            currentStatus: data.currentStatus,
            blockers: data.blockers || "",
            nextStep: data.nextStep,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  const handleSave = async () => {
    const res = await fetch("/api/context-memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, ...form }),
    });
    if (res.ok) {
      const data = await res.json();
      setMemory(data);
      setEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <p className="text-gray-500">Loading context memory...</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          🧠 Durable Context Memory
        </h3>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-sm px-3 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            {memory ? "Update" : "Create"}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="text-sm px-3 py-1 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false);
                if (memory) {
                  setForm({
                    summary: memory.summary,
                    currentStatus: memory.currentStatus,
                    blockers: memory.blockers || "",
                    nextStep: memory.nextStep,
                  });
                }
              }}
              className="text-sm px-3 py-1 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Summary
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              rows={3}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Status
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              value={form.currentStatus}
              onChange={(e) =>
                setForm({ ...form, currentStatus: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blockers
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              rows={2}
              value={form.blockers}
              onChange={(e) => setForm({ ...form, blockers: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Next Step
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              rows={2}
              value={form.nextStep}
              onChange={(e) => setForm({ ...form, nextStep: e.target.value })}
            />
          </div>
        </div>
      ) : memory ? (
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Summary</h4>
            <p className="text-gray-900 mt-1">{memory.summary}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Current Status
              </h4>
              <p className="text-gray-900 mt-1">{memory.currentStatus}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Blockers</h4>
              <p className="text-gray-900 mt-1">
                {memory.blockers || "None"}
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Next Step</h4>
            <p className="text-gray-900 mt-1">{memory.nextStep}</p>
          </div>
          <p className="text-xs text-gray-400">
            Last updated: {new Date(memory.updatedAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          No context memory recorded yet. Click &quot;Create&quot; to add one.
        </p>
      )}
    </div>
  );
}
