import { Navigation } from "./navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">TaskPilot</h1>
          <Navigation />
        </div>
      </header>
      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <footer className="border-t border-gray-200 px-6 py-4 text-center text-sm text-gray-500">
        TaskPilot — Local-first multi-AI orchestration
      </footer>
    </div>
  );
}
