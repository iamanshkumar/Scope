import React, { useState } from 'react';
import { X, Loader2, Mail, UserPlus } from 'lucide-react';

const AddMemberModal = ({ isOpen, onClose, onInvite, isLoading }) => {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onInvite(email);
    setEmail('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
             <UserPlus size={20} className="text-brand"/> Invite Member
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">User Email</label>
            <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                type="email"
                placeholder="colleague@example.com"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>
            <p className="text-xs text-slate-500 mt-2">The user must already be registered on Scope.</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand/90 transition-colors flex items-center gap-2"
            >
              {isLoading && <Loader2 className="animate-spin" size={18} />}
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;