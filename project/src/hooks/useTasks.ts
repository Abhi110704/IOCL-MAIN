import { useState, useEffect } from 'react';
import { taskAPI, Task } from '../utils/api';

export const useTasks = (internId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await taskAPI.getTasks(internId);
      
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        setError(response.error || 'Failed to fetch tasks');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [internId]);

  const createTask = async (taskData: Partial<Task>): Promise<boolean> => {
    try {
      const response = await taskAPI.createTask(taskData);
      
      if (response.success) {
        await fetchTasks(); // Refresh the list
        return true;
      } else {
        setError(response.error || 'Failed to create task');
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create task');
      return false;
    }
  };

  const updateTaskStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      const response = await taskAPI.updateTaskStatus(id, status);
      
      if (response.success) {
        await fetchTasks(); // Refresh the list
        return true;
      } else {
        setError(response.error || 'Failed to update task');
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update task');
      return false;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      const response = await taskAPI.deleteTask(id);
      
      if (response.success) {
        await fetchTasks(); // Refresh the list
        return true;
      } else {
        setError(response.error || 'Failed to delete task');
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete task');
      return false;
    }
  };

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTaskStatus,
    deleteTask,
    refetch: fetchTasks,
  };
};