import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Folder, LogOut, Layers ,  Moon, Sun  , Shield} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const { user , logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // 1. Make sure this array exists and has data!
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Folder, label: 'Projects', path: '/projects' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0">
      
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
        <Layers className="text-brand w-6 h-6 mr-2" />
        <span className="font-bold text-xl text-slate-900 dark:text-white">Scope.</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (  
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
              ${isActive 
                ? 'bg-brand/5 text-brand dark:bg-brand/20 dark:text-brand-light' 
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              }
            `}
          >
            <item.icon size={20} className="mr-3" />
            {item.label}
          </NavLink>
        ))} 

{user?.role === 'admin' && (
        <>
          <div className="my-4 border-t border-slate-800/50 mx-4"></div>
          <Link 
            to="/admin" 
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mx-2 rounded-lg"
          >
            <Shield size={20} className="text-purple-400" />
            <span className="font-medium">System Admin</span>
          </Link>
        </>
      )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
      {/* Theme Toggle Button */}

        <button 
          onClick={toggleTheme}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {theme === 'dark' ? <Sun size={20} className="mr-3" /> : <Moon size={20} className="mr-3" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;