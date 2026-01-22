import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { Loader2, Shield, Search, UserCog, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.data);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (userId, field, value) => {
    const previousUsers = [...users];
    setUsers(users.map(user => 
      user._id === userId ? { ...user, [field]: value } : user
    ));

    try {
      await api.patch(`/admin/users/${userId}`, { [field]: value });
      showToast(`User ${field} updated successfully`, "success");
    } catch (err) {
      setUsers(previousUsers);
      showToast("Failed to update user", "error");
      console.error(err);
    }
  };

  // Helper to get color styles based on status/role
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'inactive': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      case 'banned': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="animate-spin text-brand" size={40} />
    </div>
  );

  return (
    <div className="h-full flex flex-col p-6 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <Shield className="text-brand" /> System Administration
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage user roles, permissions, and account status</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all dark:text-white text-sm"
          />
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    
                    {/* User Info Column */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm border border-brand/20">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">{user.username}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Dropdown */}
                    <td className="p-4">
                      <div className="relative inline-block">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdate(user._id, 'role', e.target.value)}
                          className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-bold border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand/50 ${getRoleColor(user.role)}`}
                        >
                          <option value="member">MEMBER</option>
                          <option value="manager">MANAGER</option>
                          <option value="admin">ADMIN</option>
                        </select>
                        <UserCog className="absolute right-2.5 top-2 pointer-events-none opacity-50" size={12} />
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4">
                      <div className="relative inline-block">
                        <select
                          value={user.status}
                          onChange={(e) => handleUpdate(user._id, 'status', e.target.value)}
                          className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-xs font-bold border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand/50 ${getStatusColor(user.status)}`}
                        >
                          <option value="active">ACTIVE</option>
                          <option value="inactive">INACTIVE</option>
                          <option value="banned">BANNED</option>
                        </select>
                        {/* Status Icons */}
                        <div className="absolute right-2.5 top-2 pointer-events-none opacity-50">
                          {user.status === 'active' && <CheckCircle2 size={12} />}
                          {user.status === 'banned' && <XCircle size={12} />}
                          {user.status === 'inactive' && <AlertCircle size={12} />}
                        </div>
                      </div>
                    </td>

                    {/* Date Column */}
                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400 font-mono">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;