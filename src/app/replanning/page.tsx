import { db } from "@/lib/db";
import { requirementChanges, requirements, modules, tasks } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function ReplanningPage() {
  // Load all requirements
  const allRequirements = await db
    .select()
    .from(requirements)
    .orderBy(asc(requirements.id));

  const requirementMap = new Map(allRequirements.map((r) => [r.id, r]));
  const firstRequirement = allRequirements[0] || null;

  // Load all requirement changes
  const allChanges = await db
    .select()
    .from(requirementChanges)
    .orderBy(desc(requirementChanges.createdAt));

  const changeMap = new Map(allChanges.map((c) => [c.id, c]));

  // Load modules and tasks that need replanning
  const modulesNeedingReplanning = await db
    .select()
    .from(modules)
    .where(eq(modules.needsReplanning, true))
    .orderBy(asc(modules.id));

  const tasksNeedingReplanning = await db
    .select()
    .from(tasks)
    .where(eq(tasks.needsReplanning, true))
    .orderBy(asc(tasks.id));

  // Load modules/tasks for context
  const allModules = await db
    .select()
    .from(modules)
    .orderBy(asc(modules.id));

  const allTasks = await db
    .select()
    .from(tasks)
    .orderBy(asc(tasks.id));

  const moduleMap = new Map(allModules.map((m) => [m.id, m]));
  const taskMap = new Map(allTasks.map((t) => [t.id, t]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Requirement Changes & Replanning</h1>
        <p className="mt-2 text-gray-600">
          Track requirement evolution and identify modules/tasks needing re-scoping.
        </p>
      </div>

      {/* Current Requirement State */}
      {firstRequirement && (
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-4">Current Requirement State</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Title</h4>
              <p className="text-gray-900 mt-1">{firstRequirement.title}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Status</h4>
              <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                firstRequirement.status === "active" ? "bg-green-100 text-green-700" :
                firstRequirement.status === "approved" ? "bg-blue-100 text-blue-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {firstRequirement.status}
              </span>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="text-gray-600 mt-1 text-sm">{firstRequirement.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Priority</h4>
              <p className="text-gray-900 mt-1 font-mono">{firstRequirement.priority}</p>
            </div>
          </div>
        </div>
      )}

      {/* Requirement Changes Section */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">
          Requirement Changes ({allChanges.length})
        </h3>
        {allChanges.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No requirement changes recorded yet. Create one via API: `POST /api/requirement-changes`
          </p>
        ) : (
          <div className="space-y-3">
            {allChanges.map((change) => {
              const req = requirementMap.get(change.requirementId);
              return (
                <div key={change.id} className="border border-gray-100 rounded-md p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {req?.title || `Requirement #${change.requirementId}`}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono">
                        {change.versionLabel}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      change.status === "approved" ? "bg-green-100 text-green-700" :
                      change.status === "rejected" ? "bg-red-100 text-red-700" :
                      change.status === "implemented" ? "bg-gray-100 text-gray-700" :
                      change.status === "proposed" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {change.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{change.changeSummary}</p>
                  {change.rationale && (
                    <p className="text-xs text-gray-500 italic">Rationale: {change.rationale}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {change.createdAt ? new Date(change.createdAt).toLocaleString() : "N/A"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Impacted Items Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Modules needing replanning */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-4">
            Modules Needing Replanning ({modulesNeedingReplanning.length})
          </h3>
          {modulesNeedingReplanning.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No modules currently need replanning.
            </p>
          ) : (
            <div className="space-y-2">
              {modulesNeedingReplanning.map((mod) => {
                const req = mod.requirementId ? requirementMap.get(mod.requirementId) : undefined;
                const change = mod.requirementChangeId ? changeMap.get(mod.requirementChangeId) : undefined;
                return (
                  <div key={mod.id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{mod.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {req && <span className="text-xs text-gray-500">{req.title}</span>}
                        {change && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono">{change.versionLabel}</span>}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-700">
                      {mod.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tasks needing replanning */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-4">
            Tasks Needing Replanning ({tasksNeedingReplanning.length})
          </h3>
          {tasksNeedingReplanning.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No tasks currently need replanning.
            </p>
          ) : (
            <div className="space-y-2">
              {tasksNeedingReplanning.map((task) => {
                const mod = task.moduleId ? moduleMap.get(task.moduleId) : undefined;
                const change = task.requirementChangeId ? changeMap.get(task.requirementChangeId) : undefined;
                return (
                  <div key={task.id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {mod && <span className="text-xs text-gray-500">{mod.name}</span>}
                        {change && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono">{change.versionLabel}</span>}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-700">
                      {task.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Original Intent Preservation Note */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-2">📜 Original Intent Preservation</h3>
        <p className="text-sm text-gray-600">
          Requirement changes are recorded as separate version entries. The original requirement intent remains visible
          in the <code className="text-xs bg-gray-100 px-1 rounded">requirements</code> table and is never overwritten.
          Each change links to its parent requirement via <code className="text-xs bg-gray-100 px-1 rounded">requirement_id</code>.
        </p>
      </div>
    </div>
  );
}
