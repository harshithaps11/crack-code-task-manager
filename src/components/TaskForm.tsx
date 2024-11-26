import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import { PlusCircle, Loader2 } from 'lucide-react';

export default function TaskForm() {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { addTask } = useTaskStore();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await addTask(title, description, user.uid);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur-lg shadow-xl ring-1 ring-white/10 rounded-lg p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-200">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
            placeholder="Enter task title"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-200">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800/50 text-white shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
            placeholder="Enter task description"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            <>
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Task
            </>
          )}
        </button>
      </div>
    </form>
  );
}