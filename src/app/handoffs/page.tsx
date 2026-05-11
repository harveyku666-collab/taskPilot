import { db } from "@/lib/db";
import { handoffs, acceptances, tasks } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function HandoffsPage() {
  // Load all handoffs
  const allHandoffs = await db
    .select()
    .from(handoffs)
    .orderBy(desc(handoffs.createdAt));

  // Load all acceptances
  const allAcceptances = await db
    .select()
    .from(acceptances)
    .orderBy(desc(acceptances.createdAt));

  // Load tasks for context
  const allTasks = await db
    .select()
    .from(tasks)
    .orderBy(asc(tasks.id));

  const taskMap = new Map(allTasks.map((t) => [t.id, t]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Handoffs & Acceptance</h1>
        <p className="mt-2 text-gray-600">
          Track task handoffs between roles and human acceptance decisions.
        </p>
      </div>

      {/* Handoffs Section */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">
          Handoffs ({allHandoffs.length})
        </h3>
        {allHandoffs.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No handoffs recorded yet. Create one via API: `POST /api/handoffs`
          </p>
        ) : (
          <div className="space-y-3">
            {allHandoffs.map((h) => {
              const task = taskMap.get(h.taskId);
              return (
                <div key={h.id} className="border border-gray-100 rounded-md p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {task?.title || `Task #${h.taskId}`}
                      </span>
                      <span className="text-xs text-gray-500">
                        {h.fromRole} → {h.toRole}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      h.status === "accepted" ? "bg-green-100 text-green-700" :
                      h.status === "rejected" ? "bg-red-100 text-red-700" :
                      h.status === "returned" ? "bg-orange-100 text-orange-700" :
                      h.status === "in_review" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {h.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{h.summary}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {h.createdAt ? new Date(h.createdAt).toLocaleString() : "N/A"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Acceptances Section */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">
          Acceptance Records ({allAcceptances.length})
        </h3>
        {allAcceptances.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No acceptance records yet. Create one via API: `POST /api/acceptances`
          </p>
        ) : (
          <div className="space-y-3">
            {allAcceptances.map((a) => {
              const task = taskMap.get(a.taskId);
              return (
                <div key={a.id} className="border border-gray-100 rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {task?.title || `Task #${a.taskId}`}
                      </span>
                      {a.reviewerRole && (
                        <span className="text-xs text-gray-500">
                          reviewed by {a.reviewerRole}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      a.decision === "approved" ? "bg-green-100 text-green-700" :
                      a.decision === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {a.decision}
                    </span>
                  </div>
                  {a.notes && (
                    <p className="text-sm text-gray-600">{a.notes}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {a.createdAt ? new Date(a.createdAt).toLocaleString() : "N/A"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
