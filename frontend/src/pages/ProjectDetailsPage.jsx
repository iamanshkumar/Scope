import React, { useEffect, useState } from 'react';
import { useParams, useNavigate , Link } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import api from '../api/axios';
import { API_ENDPOINTS } from '../api/endpoints';
import { Loader2, Plus, ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { Trash2 , UserPlus} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import AddMemberModal from '../components/projects/AddMemberModal';


// Column Configuration
const COLUMNS = [
  { id: 'todo', label: 'To Do', icon: Circle, color: 'text-slate-500' },
  { id: 'in-progress', label: 'In Progress', icon: Clock, color: 'text-blue-500' },
  { id: 'done', label: 'Done', icon: CheckCircle2, color: 'text-emerald-500' }
];


const getPriorityColor = (priority) => {
  switch(priority) {
    case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'low': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    default: return 'bg-slate-100 text-slate-700';
  }
};

const ProjectDetailsPage = () => {
  const socket = useSocket()
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { tasks, loading, updateTaskStatus , createTask , deleteTask , refreshTasks} = useTasks(id);
  const {showToast} = useToast()

  const [project, setProject] = useState(null);
  const [isTaskModalOpen , setIsTaskModalOpen] = useState(false)
  const [isCreating , setIsCreating] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);


  const handleCreateTask = async(taskData)=>{
    setIsCreating(true)
    try{
      await createTask(taskData)
      setIsTaskModalOpen(false)
    }catch(err){
      alert("Failed to create task" , err);
    }finally{
      setIsCreating(false);
    }
  }

  const handleInviteUser = async (email) => {
    setIsInviting(true);
    try {
      await api.post(`/projects/${id}/invite`, { email });
      showToast('User added to project!', 'success');
      setIsInviteOpen(false);
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to add user', 'error');
    } finally {
      setIsInviting(false);
    }
  };
  
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const { data } = await api.get(API_ENDPOINTS.PROJECTS.GET(id));
        setProject(data.data);
      } catch (err) {
        console.error("Failed to load project", err);
        navigate('/projects'); 
      }
    };
    fetchProjectDetails();
  }, [id, navigate]);

  useEffect(()=>{
    if(!socket){
      return
    }
    socket.emit("join_project" , id)

    socket.on("task_updated" , (updatedTask)=>{
      console.log("Live update received!", updatedTask);
      refreshTasks()
      showToast('Board updated by team member', 'info');
    })

    return ()=>{
      socket.off("task_updated")
    }
  },[socket,id , refreshTasks])

  if (!project || loading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand" /></div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/projects')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">{project.name}</h1>
            <p className="text-slate-500 text-sm">{project.description}</p>
          </div>
        </div>
        {/* Header Buttons */}
<div className="flex gap-3">
    {/* Invite Button (Only show if current user is owner, optional check) */}
    <button 
        onClick={() => setIsInviteOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium border border-slate-200 dark:border-slate-700"
    >
        <UserPlus size={18} />
        <span className="hidden sm:inline">Invite</span>
    </button>

    {/* Your Existing New Task Button */}
    <Button onClick={() => setIsTaskModalOpen(true)} className="w-auto gap-2 p-2 flex rounded-md border border-neutral-600/45">
        <Plus size={18} /> New Task
    </Button>
</div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden min-h-[500px]">
        {COLUMNS.map(col => (
          <div key={col.id} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 flex flex-col border border-slate-200 dark:border-slate-800">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <col.icon size={18} className={col.color} />
                <span className="font-semibold text-slate-700 dark:text-slate-200">{col.label}</span>
                <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-0.5 rounded-full">
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </div>
            </div>

            {/* Task Cards */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task._id} className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:border-brand/50 cursor-pointer group transition-all">
                  {/* Priority Badge */}
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>

                    {/* Delete Button (Hidden until hover) */}
                    <button 
                      onClick={(e) => {
                              e.stopPropagation(); // Prevent clicking the card itself
                              if(window.confirm('Delete this task?')) deleteTask(task._id);
                      }}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">{task.title}</h4>
                  
                  <div className="flex justify-between items-center text-xs text-slate-400 mt-3">
                  <div className="flex justify-between items-center text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
  
  <div className="flex items-center gap-2">
  {task.assignee && task.assignee.username ? (
  <>
    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold border border-blue-200 dark:border-blue-800">
      {task.assignee.username?.charAt(0).toUpperCase()}
    </div>
    <span className="truncate max-w-[80px] font-medium">
      {task.assignee.username}
    </span>
  </>
) : (
  <span className="italic text-slate-400 text-[10px]">Unassigned</span>
)}
  </div>

  {/* Quick Move Actions (Keep this part exactly as it is) */}
  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {/* ... buttons ... */}
  </div>
</div>
                    
                    {/* Quick Move Actions (Hover to see) */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {col.id !== 'todo' && (
                        <button onClick={async() => {
                          await updateTaskStatus(task._id , 'todo')
                          socket.emit("task_updated", { projectId: id });
                        }
                       } className="p-1 hover:bg-slate-100 rounded" title="Move to Todo">
                          <Circle size={14} />
                        </button>
                      )}
                      {col.id !== 'in-progress' && (
                        <button onClick={async() =>{
                          await updateTaskStatus(task._id, 'in-progress')
                          socket.emit("task_updated", { projectId: id });
                        }} className="p-1 hover:bg-slate-100 rounded" title="Move to In Progress">
                          <Clock size={14} />
                        </button>
                      )}
                      {col.id !== 'done' && (
                        <button onClick={async() => {
                          await updateTaskStatus(task._id, 'done')
                          socket.emit("task_updated", { projectId: id })
                        }} className="p-1 hover:bg-slate-100 rounded" title="Move to Done">
                          <CheckCircle2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

<CreateTaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onCreate={handleCreateTask}
        isLoading={isCreating}
        members={project?.members || []}
      />

<AddMemberModal
    isOpen={isInviteOpen}
    onClose={() => setIsInviteOpen(false)}
    onInvite={handleInviteUser}
    isLoading={isInviting}
/>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;