import React from 'react';
import { useAuthStore } from '../store/authStore';
import { LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { signOut, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-violet-950 to-blue-950">
      <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Task Manager</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-300 mr-4">{user?.email}</span>
              <button
                onClick={signOut}
                className="inline-flex items-center px-3 py-2 border border-violet-500/30 text-sm leading-4 font-medium rounded-md text-white bg-violet-600/20 hover:bg-violet-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}