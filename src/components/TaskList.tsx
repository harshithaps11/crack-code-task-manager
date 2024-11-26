import React from 'react';
import { useTaskStore, Task } from '../store/taskStore';
import { Pencil, Trash2, Check, X } from 'lucide-react';

export default function TaskList() {
  const { tasks, updateTask, deleteTask, searchQuery } = useTaskStore();
  const [editingTask, setEditingTask] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');
  const [editDescription, setEditDescription] = React.useState('');

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (task: Task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleSave = async (taskId: string) => {
    await updateTask(taskId, {
      title: editTitle,
      description: editDescription
    });
    setEditingTask(null);
  };

  const handleToggleComplete = async (task: Task) => {
    await updateTask(task.id, { completed: !task.completed });
  };

  return (
    <div className="space-y-4">
      {filteredTasks.map(task => (
        <div
          key={task.id}
          className={`bg-gray-900/50 backdrop-blur-lg p-4 rounded-lg shadow-xl ring-1 ring-white/10 ${
            task.completed ? 'bg-green-900/20 ring-green-500/30' : ''
          }`}
        >
          {editingTask === task.id ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 rounded-md border-gray-700 bg-gray-800/50 text-white"
                placeholder="Task title"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full p-2 rounded-md border-gray-700 bg-gray-800/50 text-white"
                placeholder="Task description"
                rows={2}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleSave(task.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600/80 hover:bg-green-600 transition-colors"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={() => setEditingTask(null)}
                  className="inline-flex items-center px-3 py-2 border border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                  {task.title}
                </h3>
                <p className={`mt-1 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                  {task.description}
                </p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleToggleComplete(task)}
                  className={`p-1 rounded-md transition-colors ${
                    task.completed
                      ? 'text-green-400 hover:bg-green-900/30'
                      : 'text-gray-400 hover:bg-gray-800/50'
                  }`}
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  className="p-1 text-blue-400 hover:bg-blue-900/30 rounded-md transition-colors"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 text-red-400 hover:bg-red-900/30 rounded-md transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No tasks found</p>
        </div>
      )}
    </div>
  );
}