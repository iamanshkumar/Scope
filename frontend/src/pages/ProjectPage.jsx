import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Plus, Folder, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProjectsPage = () => {
  const { projects, loading, error, createProject } = useProjects();
  const { user } = useAuth();
  const navigate = useNavigate()
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createProject(formData);
      setIsModalOpen(false);
      setFormData({ name: '', description: '' }); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold dark:text-white mb-2">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your team's workspaces</p>
        </div>
        
        {/* Only Managers/Admins can see this button */}
        {(user.role === 'manager' || user.role === 'admin') && (
          <Button onClick={() => setIsModalOpen(true)} className="w-auto gap-2 p-2 flex rounded-md border border-neutral-600/45">
            <Plus size={20} /> New Project
          </Button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-slate-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <Folder size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">No projects found. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} onClick={() => navigate(`/projects/${project._id}`)} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg transition-all hover:border-brand/50 cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand/5 rounded-lg text-brand dark:bg-brand/20 dark:text-brand-light">
                  <Folder size={24} />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                  project.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-slate-100 text-slate-600'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand transition-colors">
                {project.name}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 h-10">
                {project.description || "No description provided."}
              </p>

              <div className="flex items-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
                <Calendar size={14} className="mr-1" />
                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Project"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Project Name"
            placeholder="e.g., Q4 Marketing Campaign"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            autoFocus
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 border-slate-300 dark:border-slate-700 focus:border-brand focus:ring-brand-light/50 h-24 resize-none"
              placeholder="What is this project about?"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsPage;