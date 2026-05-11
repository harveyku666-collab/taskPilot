import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to TaskPilot
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Local-first web system for multi-AI software delivery orchestration.
          Manage projects, decompose requirements, track tasks, and coordinate
          AI agents with structured handoffs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link
          href="/overview"
          className="block border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            📊 Overview
          </h2>
          <p className="text-gray-600">
            Project summary, module progress, and recent activity dashboard.
          </p>
        </Link>

        <Link
          href="/modules"
          className="block border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            📋 Modules & Tasks
          </h2>
          <p className="text-gray-600">
            View and manage project modules and their associated tasks.
          </p>
        </Link>
      </div>

      <div className="text-center text-sm text-gray-500 mt-12">
        <p>TaskPilot v0.1.0 — Foundation Bootstrap</p>
        <p className="mt-1">Next.js + React + Tailwind CSS + SQLite + Drizzle ORM</p>
      </div>
    </div>
  );
}
