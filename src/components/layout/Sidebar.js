import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard, 
  Calculator, 
  ListTodo, 
  Tags, 
  Box, 
  Layers, 
  Users,
  LogOut,
  UserCircle
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import logo from '../../assets/images/logo/wcs-pm.png';

const SidebarItem = ({ icon: Icon, label, href, isActive, isCollapsed, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={twMerge(
      'group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-all duration-300',
      isActive 
        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 dark:shadow-brand-500/10' 
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200'
    )}
  >
    <span className={twMerge(
      'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-colors',
      isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-800'
    )}>
      <Icon size={18} strokeWidth={isCollapsed && isActive ? 2.5 : 2} />
    </span>
    
    {!isCollapsed && (
      <span className="truncate transition-opacity duration-300">{label}</span>
    )}

    {isCollapsed && (
      <div className="absolute left-full ml-4 hidden rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white group-hover:block z-50 shadow-premium">
        {label}
      </div>
    )}
  </button>
);

export const Sidebar = ({ isCollapsed, setCollapsed, navItems, handleLogout }) => {
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

  return (
    <aside
      className={twMerge(
        'hidden lg:flex flex-col border-r border-slate-200/60 bg-white dark:border-slate-800/60 dark:bg-slate-950 transition-all duration-300 ease-in-out z-30 fill-available',
        isCollapsed ? 'w-24' : 'w-72'
      )}
    >
      {/* Header */}
      <div className="flex h-20 items-center justify-between px-6">
        <div className={twMerge('flex items-center gap-3 transition-opacity duration-300', isCollapsed && 'opacity-0 lg:opacity-100')}>
          <img src={logo} alt="WCS" className="h-9 w-auto" />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tighter text-slate-900 dark:text-white uppercase">WCS PM</span>
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mt-[-2px]">Manager</span>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setCollapsed(!isCollapsed)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-brand-500/10 dark:hover:text-brand-400 transition-all shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>
        )}
        {isCollapsed && (
           <button
             onClick={() => setCollapsed(!isCollapsed)}
             className="flex h-8 w-8 mx-auto items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-brand-500/10 dark:hover:text-brand-400 transition-all shadow-sm"
           >
             <ChevronRight size={16} />
           </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4 custom-scrollbar">
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={getIcon(item.icon)}
            label={item.label}
            href={item.href}
            isActive={isActive(item.href)}
            isCollapsed={isCollapsed}
            onClick={() => navigate(item.href)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 dark:border-slate-900 p-4 space-y-2">
        <SidebarItem
          icon={UserCircle}
          label="My Profile"
          isActive={isActive('/profile')}
          isCollapsed={isCollapsed}
          onClick={() => navigate('/profile')}
        />
        <button
          onClick={handleLogout}
          className={twMerge(
            'group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-rose-600 transition-all duration-300 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10',
            isCollapsed && 'justify-center'
          )}
        >
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-500/10 group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20 transition-colors">
            <LogOut size={18} />
          </span>
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
