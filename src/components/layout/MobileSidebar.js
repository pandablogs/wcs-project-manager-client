import React from 'react';
import { X, LayoutDashboard, Calculator, ListTodo, Tags, Box, Layers, Users, LogOut, UserCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo/wcs-pm.png';

export const MobileSidebar = ({ isOpen, setOpen, navItems, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const getIcon = (iconName) => {
    const icons = {
      grid: LayoutDashboard,
      estimate: Calculator,
      projects: ListTodo,
      tag: Tags,
      box: Box,
      layers: Layers,
      users: Users,
    };
    return icons[iconName] || LayoutDashboard;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in" 
        onClick={() => setOpen(false)} 
      />
      
      {/* Sidebar Content */}
      <div className="absolute left-0 top-0 h-full w-[280px] bg-white dark:bg-slate-950 shadow-2xl animate-slide-in-right border-r border-slate-200 dark:border-slate-800">
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-900">
          <div className="flex items-center gap-3">
            <img src={logo} alt="WCS" className="h-8 w-auto" />
            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">WCS PM</span>
          </div>
          <button 
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
          {navItems.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <button
                key={item.href}
                onClick={() => {
                  navigate(item.href);
                  setOpen(false);
                }}
                className={twMerge(
                  'flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold transition-all',
                  isActive(item.href)
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 dark:border-slate-900 space-y-2">
           <button
             onClick={() => {
               navigate('/profile');
               setOpen(false);
             }}
             className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
           >
             <UserCircle size={20} />
             <span>My Profile</span>
           </button>
           <button
             onClick={handleLogout}
             className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
           >
             <LogOut size={20} />
             <span>Sign Out</span>
           </button>
        </div>
      </div>
    </div>
  );
};
