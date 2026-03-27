import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Menu,
  X,
  User,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button } from '../ui/Button';

export const Navbar = ({ theme, setTheme, setMobileMenuOpen, isMobileMenuOpen, handleLogout, navigate }) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/80">
      <div className="flex h-20 items-center justify-between px-6">
        {/* Left Side: Mobile Menu Toggle & Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="relative hidden sm:block w-full max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchValue.trim()) {
                  navigate(`/project-list?search=${encodeURIComponent(searchValue.trim())}`);
                }
              }}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 !pl-16 pr-4 text-sm font-medium outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:bg-slate-900"
              placeholder="Search projects, materials..."
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-40">
              <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-slate-200 bg-white px-1.5 font-sans text-[10px] font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-800">⌘</kbd>
              <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-slate-200 bg-white px-1.5 font-sans text-[10px] font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-800">K</kbd>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!isNotificationsOpen)}
              className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white transition-all hover:border-brand-500 hover:bg-brand-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/50 dark:hover:bg-brand-500/10"
            >
              <Bell size={20} className="text-slate-600 dark:text-slate-400 transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400" />
              <span className="absolute right-3 top-3 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500"></span>
              </span>
            </button>
            
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 origin-top-right animate-slide-in-top rounded-3xl border border-slate-200 bg-white p-2 shadow-premium dark:border-slate-800 dark:bg-slate-950">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-900 mb-2 flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Notifications</span>
                  <Badge variant="brand">3 New</Badge>
                </div>
                <div className="space-y-1 max-h-80 overflow-y-auto">
                   {["New project assigned", "Material list updated", "Report generated"].map((msg, i) => (
                      <button key={i} className="flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
                        <div className="h-2 w-2 mt-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{msg}</p>
                          <p className="text-xs font-medium text-slate-500">2 mins ago</p>
                        </div>
                      </button>
                   ))}
                </div>
                <div className="p-2 border-t border-slate-100 dark:border-slate-900 mt-2">
                  <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest">View All</Button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
          </button>

          {/* Profile Dropdown */}
          <div className="relative ml-2">
            <button
              onClick={() => setProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 rounded-2xl p-1 pr-3 transition-all hover:bg-slate-100 dark:hover:bg-slate-900 group border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
            >
              <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                <User size={20} />
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-black tracking-tight text-slate-900 dark:text-white">Admin User</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-500">Administrator</p>
              </div>
              <ChevronDown size={14} className={twMerge('text-slate-500 transition-transform duration-300', isProfileOpen && 'rotate-180')} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 origin-top-right animate-slide-in-top rounded-3xl border border-slate-200 bg-white p-2 shadow-premium dark:border-slate-800 dark:bg-slate-950">
                <div className="group flex items-center gap-3 rounded-2xl p-3 mb-2 bg-slate-50 dark:bg-slate-900">
                  <div className="h-10 w-10 rounded-xl bg-brand-500 flex items-center justify-center text-white">
                    <User size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="truncate text-sm font-black text-slate-900 dark:text-white">Admin</p>
                    <p className="truncate text-[10px] font-bold uppercase text-slate-500">admin@wcs.com</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <button onClick={() => navigate('/profile')} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900">
                    <Settings size={16} /> Account Settings
                  </button>
                </div>

                <div className="mt-2 border-t border-slate-100 p-2 pt-3 dark:border-slate-900">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-black text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const Badge = ({ variant = 'default', children, className }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    brand: 'bg-brand-500 text-white shadow-sm shadow-brand-500/20',
  };
  return (
    <span className={twMerge('inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-wider', variants[variant], className)}>
      {children}
    </span>
  );
};
