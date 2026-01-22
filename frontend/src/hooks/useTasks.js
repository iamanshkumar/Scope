import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { API_ENDPOINTS } from '../api/endpoints';

export const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Tasks for this Project
  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const { data } = await api.get(API_ENDPOINTS.TASKS.LIST(projectId));
      setTasks(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Create a new Task
  const createTask = async (taskData) => {
    const { data } = await api.post(API_ENDPOINTS.TASKS.CREATE, { ...taskData, projectId });
    setTasks(prev => [...prev, data.data]);
    return data;
  };

  // Move Task (Update Status)
  const updateTaskStatus = async (taskId, newStatus) => {
    // 1. Optimistic Update (Update UI immediately)
    setTasks(prev => prev.map(task => 
      task._id === taskId ? { ...task, status: newStatus } : task
    ));

    try {
      // 2. Send to Backend
      await api.patch(API_ENDPOINTS.TASKS.UPDATE_STATUS(taskId), { status: newStatus });
    } catch (err) {
      // 3. Revert if failed (Silent error handling for now)
      console.error("Failed to update status", err);
      fetchTasks(); 
    }
  };

  const deleteTask = async(taskId)=>{
    setTasks(prev=>prev.filter(task=>task._id !== taskId))

    try{
      await api.delete(API_ENDPOINTS.TASKS.DELETE(taskId))
    }catch(err){
      console.log("Failed to delete the task" , err)
      fetchTasks();
      throw err;
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, createTask, updateTaskStatus,deleteTask, refreshTasks: fetchTasks };
};