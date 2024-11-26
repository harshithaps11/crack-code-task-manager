import { create } from 'zustand';
import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: number;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  searchQuery: string;
  addTask: (title: string, description: string, userId: string) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  fetchTasks: (userId: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  searchQuery: '',
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  addTask: async (title, description, userId) => {
    try {
      const taskRef = await addDoc(collection(db, 'tasks'), {
        title,
        description,
        completed: false,
        userId,
        createdAt: Date.now()
      });
      
      const newTask = {
        id: taskRef.id,
        title,
        description,
        completed: false,
        userId,
        createdAt: Date.now()
      };
      
      set({ tasks: [...get().tasks, newTask] });
      toast.success('Task added successfully!');
    } catch (error) {
      toast.error('Failed to add task');
      throw error;
    }
  },
  
  updateTask: async (taskId, updates) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), updates);
      set({
        tasks: get().tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      });
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task');
      throw error;
    }
  },
  
  deleteTask: async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      set({ tasks: get().tasks.filter(task => task.id !== taskId) });
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task');
      throw error;
    }
  },
  
  fetchTasks: async (userId) => {
    set({ loading: true });
    try {
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      
      set({ tasks, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to fetch tasks');
      throw error;
    }
  }
}));