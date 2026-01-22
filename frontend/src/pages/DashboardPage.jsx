import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Folder, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats'); // Make sure this matches your backend route
        setStats(data.data.stats);
        setRecentProjects(data.data.recentProjects);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500">Welcome back, {user?.username}</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Active Projects" 
            value={stats.totalProjects} 
            icon={Folder} 
            color="bg-brand text-brand" 
          />
          <StatCard 
            label="Tasks To Do" 
            value={stats.tasksByStatus.todo} 
            icon={Clock} 
            color="bg-blue-500 text-blue-500" 
          />
          <StatCard 
            label="High Priority" 
            value={stats.highPriorityTasks} 
            icon={AlertCircle} 
            color="bg-red-500 text-red-500" 
          />
          <StatCard 
            label="Completed Tasks" 
            value={stats.tasksByStatus.done} 
            icon={CheckCircle2} 
            color="bg-emerald-500 text-emerald-500" 
          />
        </div>
      )}

      {/* Recent Projects Section */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentProjects.map(project => (
            <div 
              key={project._id}
              onClick={() => navigate(`/projects/${project._id}`)}
              className="group bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand/50 cursor-pointer transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <Folder className="text-slate-400 group-hover:text-brand transition-colors" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{project.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{project.description}</p>
            </div>
          ))}
          
          {/* Create New Quick Link */}
          <button 
            onClick={() => navigate('/projects')}
            className="flex flex-col items-center justify-center p-5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:border-brand hover:text-brand hover:bg-brand/5 transition-all"
          >
            <span className="font-medium">+ Create New Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;