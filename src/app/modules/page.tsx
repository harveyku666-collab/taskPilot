import { db } from "@/lib/db";
import { projects, modules, tasks, requirements } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function ModulesPageContent() {
  // Get the first project (demo project)
  const [firstProject] = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.id))
    .limit(1);

  if (!firstProject) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Modules & Tasks</h1>
        <p className="text-gray-500">No project found. Run `npm run db:init` to seed sample data.</p>
      </div>
    );
  }

  // Load requirements for this project
  const projectRequirements = await db
    .select()
    .from(requirements)
    .where(eq(requirements.projectId, firstProject.id))
    .orderBy(asc(requirements.id));

  // Load modules for this project
  const projectModules = await db
    .select()
    .from(modules)
    .where(eq(modules.projectId, firstProject.id))
    .orderBy(asc(modules.sequence), asc(modules.id));

  // Load tasks for each module
  const modulesWithTasks = await Promise.all(
    projectModules.map(async (mod) => {
      const moduleTasks = await db
        .select()
        .from(tasks)
        .where(eq(tasks.moduleId, mod.id))
        .orderBy(asc(tasks.id));
      return { ...mod, tasks: moduleTasks };
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Modules & Tasks</h1>
        <p className="mt-2 text-gray-600">
          Planning view for &quot;{firstProject.name}&quot; — requirements, modules, and tasks.
        </p>
      </div>

      {/* Requirements Section */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">
          Requirements ({projectRequirements.length})
        </h3>
        {projectRequirements.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No requirements yet. Create one via API: `POST /api/requirements`
          </p>
        ) : (
          <div className="space-y-3">
            {projectRequirements.map((req) => (
              <div key={req.id} className="border border-gray-100 rounded-md p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{req.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    req.status === "active" ? "bg-green-100 text-green-700" :
                    req.status === "approved" ? "bg-blue-100 text-blue-700" :
                    req.status === "deprecated" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {req.status}
                  </span>
                </div>
                {req.description && (
                  <p className="text-sm text-gray-600">{req.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modules Section */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="font-semibold text-gray-900 mb-4">
          Modules ({modulesWithTasks.length})
        </h3>
        {modulesWithTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No modules configured yet.
          </p>
        ) : (
          <div className="space-y-4">
            {modulesWithTasks.map((mod) => (
              <div key={mod.id} className="border border-gray-100 rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{mod.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    mod.status === "done" ? "bg-green-100 text-green-700" :
                    mod.status === "in_development" ? "bg-blue-100 text-blue-700" :
                    mod.status === "blocked" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {mod.status}
                  </span>
                </div>
                {mod.description && (
                  <p className="text-sm text-gray-600 mb-3">{mod.description}</p>
                )}

                {/* Tasks for this module */}
                {mod.tasks.length > 0 && (
                  <div className="ml-4 space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Tasks ({mod.tasks.length})
                    </p>
                    {mod.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 text-sm">
                        <span className={`w-2 h-2 rounded-full ${
                          task.status === "approved" ? "bg-green-500" :
                          task.status === "in_progress" ? "bg-blue-500" :
                          task.status === "blocked" ? "bg-red-500" :
                          "bg-gray-300"
                        }`} />
                        <span className="text-gray-900">{task.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          task.status === "approved" ? "bg-green-50 text-green-700" :
                          task.status === "in_progress" ? "bg-blue-50 text-blue-700" :
                          task.status === "blocked" ? "bg-red-50 text-red-700" :
                          "bg-gray-50 text-gray-600"
                        }`}>
                          {task.status}
                        </span>
                        {task.assignedTool && (
                          <span className="text-xs text-gray-400 ml-auto">
                            → {task.assignedTool}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ModulesPage() {
  return <ModulesPageContent />;
}
