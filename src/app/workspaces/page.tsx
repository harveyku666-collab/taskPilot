import { db } from "@/lib/db";
import { workspaces, tasks } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function WorkspacesPage() {
  // Load all workspaces
  const allWorkspaces = await db
    .select()
    .from(workspaces)
    .orderBy(desc(workspaces.createdAt));

  // Load tasks for context
  const allTasks = await db
    .select()
    .from(tasks)
    .orderBy(asc(tasks.id));

  const taskMap = new Map(allTasks.map((t) => [t.id, t]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Git Workspaces</h1>
        <p className="mt-2 text-gray-600">
          Track task branches and worktree paths.
        </p>
      </div>

      {/* Workspaces Section */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">
          Workspaces ({allWorkspaces.length})
        </h3>
        {allWorkspaces.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No workspaces recorded yet. Create one via API: `POST /api/workspaces`
          </p>
        ) : (
          <div className="space-y-3">
            {allWorkspaces.map((w) => {
              const task = taskMap.get(w.taskId);
              return (
                <div key={w.id} className="border border-gray-100 rounded-md p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {task?.title || `Task #${w.taskId}`}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {w.branchName}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      w.status === "merged" ? "bg-green-100 text-green-700" :
                      w.status === "in_use" ? "bg-blue-100 text-blue-700" :
                      w.status === "under_test" ? "bg-purple-100 text-purple-700" :
                      w.status === "archived" ? "bg-gray-100 text-gray-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {w.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Worktree:</span>{" "}
                      <span className="font-mono text-gray-700">{w.worktreePath}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Base:</span>{" "}
                      <span className="font-mono text-gray-700">{w.baseBranch}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {w.createdAt ? new Date(w.createdAt).toLocaleString() : "N/A"}
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
