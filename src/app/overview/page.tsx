import { ContextMemoryCard } from "@/components/context-memory-card";
import { db } from "@/lib/db";
import { projects, requirements, modules, tasks, contextMemories } from "@/db/schema";
import { eq, asc, desc, count } from "drizzle-orm";

export const dynamic = "force-dynamic";

type RecentItem = {
  id: number;
  type: string;
  title: string;
  createdAt: string | null;
  status?: string | null;
};

export default async function OverviewPage() {
  // Get the first project (demo project)
  const [firstProject] = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.id))
    .limit(1);

  if (!firstProject) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Project Overview</h1>
        <p className="text-gray-500">No project found. Run `npm run db:init` to seed sample data.</p>
      </div>
    );
  }

  const projectId = firstProject.id;

  // Load requirements count
  const [reqCount] = await db
    .select({ count: count() })
    .from(requirements)
    .where(eq(requirements.projectId, projectId));

  // Load modules with their task counts
  const projectModules = await db
    .select()
    .from(modules)
    .where(eq(modules.projectId, projectId))
    .orderBy(asc(modules.sequence), asc(modules.id));

  // Load all tasks for this project
  const projectTasks = await db
    .select()
    .from(tasks)
    .where(
      eq(
        tasks.moduleId,
        projectModules.length > 0
          ? projectModules[0].id
          : -1
      )
    )
    .orderBy(desc(tasks.createdAt));

  // Load tasks for all modules
  let allTasks: typeof tasks.$inferSelect[] = [];
  if (projectModules.length > 0) {
    for (const mod of projectModules) {
      const modTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.moduleId, mod.id))
        .orderBy(desc(tasks.createdAt));
      allTasks = allTasks.concat(modTasks);
    }
  }

  // Sort all tasks by created_at descending
  allTasks.sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  // Calculate progress summary
  const totalTasks = allTasks.length;
  const approvedTasks = allTasks.filter((t) => t.status === "approved").length;
  const inProgressTasks = allTasks.filter((t) => t.status === "in_progress").length;
  const blockedTasks = allTasks.filter((t) => t.status === "blocked").length;
  const draftTasks = allTasks.filter((t) => t.status === "draft").length;

  const totalModules = projectModules.length;
  const doneModules = projectModules.filter((m) => m.status === "done").length;
  const inDevModules = projectModules.filter((m) => m.status === "in_development").length;
  const blockedModules = projectModules.filter((m) => m.status === "blocked").length;

  // Pending actions: tasks not yet approved or done, modules not done
  const pendingTasks = allTasks.filter(
    (t) => t.status && !["approved", "closed", "rejected"].includes(t.status)
  );
  const pendingModules = projectModules.filter(
    (m) => m.status && !["done", "blocked"].includes(m.status)
  );

  // Recent activity: combine recently created/updated entities
  const recentItems: RecentItem[] = [];

  // Add recent tasks
  for (const task of allTasks.slice(0, 3)) {
    recentItems.push({
      id: task.id,
      type: "task",
      title: task.title,
      createdAt: task.createdAt,
      status: task.status,
    });
  }

  // Add recent modules
  for (const mod of projectModules.slice(0, 2)) {
    recentItems.push({
      id: mod.id,
      type: "module",
      title: mod.name,
      createdAt: mod.createdAt,
      status: mod.status,
    });
  }

  // Add recent requirements
  const projectRequirements = await db
    .select()
    .from(requirements)
    .where(eq(requirements.projectId, projectId))
    .orderBy(desc(requirements.createdAt))
    .limit(2);

  for (const req of projectRequirements) {
    recentItems.push({
      id: req.id,
      type: "requirement",
      title: req.title,
      createdAt: req.createdAt,
      status: req.status,
    });
  }

  // Add context memory update if exists
  const [latestMemory] = await db
    .select()
    .from(contextMemories)
    .where(eq(contextMemories.projectId, projectId))
    .limit(1);

  if (latestMemory) {
    recentItems.push({
      id: latestMemory.id,
      type: "context_memory",
      title: "Context memory updated",
      createdAt: latestMemory.updatedAt,
    });
  }

  // Sort by created_at descending and take top 5
  recentItems.sort(
    (a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    }
  );
  const recentActivity = recentItems.slice(0, 5);

  // Task progress percentage
  const taskProgressPercent =
    totalTasks > 0 ? Math.round((approvedTasks / totalTasks) * 100) : 0;

  // Module progress percentage
  const moduleProgressPercent =
    totalModules > 0 ? Math.round((doneModules / totalModules) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Project Overview</h1>
        <p className="mt-2 text-gray-600">
          Dashboard for &quot;{firstProject.name}&quot; — status:{" "}
          <span className="font-medium capitalize">{firstProject.status}</span>
          {firstProject.currentPhase && (
            <span>
              {" "}
              | Phase: <span className="font-medium">{firstProject.currentPhase}</span>
            </span>
          )}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-gray-200 rounded-lg p-5 bg-white">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Requirements</h3>
          <p className="text-3xl font-bold text-indigo-600">{reqCount.count}</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-5 bg-white">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Modules</h3>
          <p className="text-3xl font-bold text-blue-600">{totalModules}</p>
          <p className="text-xs text-gray-400 mt-1">
            {doneModules} done, {inDevModules} in progress
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-5 bg-white">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Tasks</h3>
          <p className="text-3xl font-bold text-green-600">{totalTasks}</p>
          <p className="text-xs text-gray-400 mt-1">
            {approvedTasks} approved, {inProgressTasks} in progress
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-5 bg-white">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Pending Actions</h3>
          <p className="text-3xl font-bold text-orange-600">
            {pendingTasks.length + pendingModules.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {pendingTasks.length} tasks, {pendingModules.length} modules
          </p>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-4">Task Progress</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Approved</span>
              <span className="text-sm font-medium text-green-600">
                {approvedTasks} / {totalTasks}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${taskProgressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="text-sm font-medium text-blue-600">
                {inProgressTasks}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Blocked</span>
              <span className="text-sm font-medium text-red-600">
                {blockedTasks}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Draft</span>
              <span className="text-sm font-medium text-gray-500">
                {draftTasks}
              </span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-4">Module Progress</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Done</span>
              <span className="text-sm font-medium text-green-600">
                {doneModules} / {totalModules}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${moduleProgressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">In Development</span>
              <span className="text-sm font-medium text-blue-600">
                {inDevModules}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Blocked</span>
              <span className="text-sm font-medium text-red-600">
                {blockedModules}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Context Memory */}
      <ContextMemoryCard projectId={projectId} />

      {/* Recent Activity */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No recent activity to display.
          </p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={`${item.type}-${item.id}`} className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  item.type === "task" ? "bg-green-500" :
                  item.type === "module" ? "bg-blue-500" :
                  item.type === "requirement" ? "bg-indigo-500" :
                  "bg-purple-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 capitalize">
                      {item.type.replace("_", " ")}
                    </span>
                    {item.status && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        item.status === "approved" || item.status === "done" ? "bg-green-50 text-green-700" :
                        item.status === "in_progress" || item.status === "in_development" ? "bg-blue-50 text-blue-700" :
                        item.status === "blocked" ? "bg-red-50 text-red-700" :
                        "bg-gray-50 text-gray-600"
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Actions */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">Pending Actions</h3>
        {pendingTasks.length === 0 && pendingModules.length === 0 ? (
          <p className="text-gray-500 text-sm">
            All items are complete. No pending actions.
          </p>
        ) : (
          <div className="space-y-4">
            {pendingModules.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Modules ({pendingModules.length})
                </h4>
                <div className="space-y-2">
                  {pendingModules.map((mod) => (
                    <div key={mod.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">{mod.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        mod.status === "blocked" ? "bg-red-50 text-red-700" :
                        mod.status === "in_development" ? "bg-blue-50 text-blue-700" :
                        "bg-gray-50 text-gray-600"
                      }`}>
                        {mod.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {pendingTasks.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Tasks ({pendingTasks.length})
                </h4>
                <div className="space-y-2">
                  {pendingTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900 truncate">{task.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ml-2 flex-shrink-0 ${
                        task.status === "blocked" ? "bg-red-50 text-red-700" :
                        task.status === "in_progress" ? "bg-blue-50 text-blue-700" :
                        "bg-gray-50 text-gray-600"
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                  {pendingTasks.length > 5 && (
                    <p className="text-xs text-gray-400">
                      ...and {pendingTasks.length - 5} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
