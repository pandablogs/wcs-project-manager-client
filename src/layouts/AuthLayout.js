import React, { useContext, useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset
} from "../components/ui/Sidebar";
import { Button } from "../components/ui/Button";
import {
  LayoutDashboard,
  Users,
  DoorOpen,
  Hammer,
  Upload,
  ListChecks,
  Building2,
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  ChevronDown,
  X,
  Plus,
  Info,
  Edit2
} from "lucide-react";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/DropdownMenu";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import { ThemeContext, LoadingContext } from "../App";
import { PremiumLoader } from "../components/ui/PremiumLoader";
import { useSelector } from "react-redux";
import userServices from "../services/userServices";
import { cn } from "../lib/utils";

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useContext(ThemeContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const [user, setUser] = useState({ name: "", email: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Project Updated",
      description: "Modern Villa kitchen specs were modified",
      time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      link: "/project-list?search=Modern Villa",
      type: "edit"
    },
    {
      id: 2,
      title: "New Material Added",
      description: "Premium Marble added to Bathroom category",
      time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      link: "/material-list?search=Premium Marble",
      type: "add"
    },
    {
      id: 3,
      title: "Template Modified",
      description: "Kitchen Standard template items updated",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      link: "/rehab-groups?search=Kitchen Standard",
      type: "edit"
    },
    {
      id: 4,
      title: "User Profile Updated",
      description: "Admin password was changed successfully",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      link: "/profile",
      type: "info"
    },
    {
      id: 5,
      title: "New Project Assigned",
      description: "Skyline Apartment assigned to PM John",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      link: "/project-list?search=Skyline",
      type: "assign"
    },
    {
      id: 6,
      title: "System Maintenance",
      description: "Database optimization completed",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      link: "/admin/dashboard",
      type: "info"
    }
  ]);

  const reduxLoading = useSelector(state => state.project_manager?.loading || state.user?.loading);

  // Sync search query with URL if search param exists
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    // Smart Navigation
    if (location.pathname === '/materials' || location.pathname === '/material-list') {
      navigate(`${location.pathname}?search=${encodeURIComponent(trimmed)}`);
    } else if (location.pathname === '/rehab-groups') {
      navigate(`/rehab-groups?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate(`/project-list?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    const params = new URLSearchParams(location.search);
    if (params.has('search')) {
      params.delete('search');
      const newSearch = params.toString();
      navigate(`${location.pathname}${newSearch ? '?' + newSearch : ''}`);
    }
  };

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userServices.getProfile();
        if (response?.user) {
          setUser({
            name: `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim() || "User",
            email: response.user.email || ""
          });
        }
      } catch (error) {
        // Fallback to hardcoded values if API fails
        const roleType = localStorage.getItem("role_type");
        const isAdmin = roleType === "admin";
        setUser({
          name: isAdmin ? "Admin User" : "Project Manager",
          email: isAdmin ? "admin@wcs.com" : "pm@wcs.com"
        });
      }
    };

    fetchUserProfile();
  }, []);

  // Auto-trigger loading on route change for premium transition feel
  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [location.pathname, setLoading]);

  const roleType = useMemo(() => {
    try {
      return localStorage.getItem("role_type");
    } catch {
      return null;
    }
  }, []);

  const isAdmin = roleType === "admin";

  const navItems = useMemo(() => {
    return isAdmin
      ? [
        { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
        { title: "Projects", url: "/project-list", icon: Building2 },
        { title: "Project Managers", url: "/admin/project-manager-list", icon: Users },
        { title: "Room Categories", url: "/category", icon: DoorOpen },
        { title: "Materials", url: "/materials", icon: Hammer },
        { title: "Material Catalogue", url: "/material-list", icon: ListChecks },
        { title: "Rehab Groups", url: "/rehab-groups", icon: ListChecks },
      ]
      : [
        { title: "Dashboard", url: "/projectManager/dashboard", icon: LayoutDashboard },
        { title: "Projects", url: "/project-list", icon: Building2 },
        { title: "Material Catalogue", url: "/material-list", icon: ListChecks },
        { title: "Rehab Groups", url: "/rehab-groups", icon: ListChecks },
      ];
  }, [isAdmin]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("_token");
      localStorage.removeItem("role_type");
    } catch {
      // ignore
    }
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    return `${Math.floor(diffInMonths / 12)}y ago`;
  };

  const displayNotifications = showAllNotifications ? notifications : notifications.slice(0, 5);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-slate-50 dark:bg-background overflow-hidden">
        <PremiumLoader loading={loading || reduxLoading} />
        <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
          <SidebarHeader className="p-6 flex flex-row items-center gap-4 border-b border-sidebar-border/50 bg-sidebar-accent/5 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-xl tracking-tight text-sidebar-foreground leading-none">
                WCS <span className="text-primary font-black">PM</span>
              </span>
              <span className="text-[10px] font-medium text-sidebar-foreground/50 uppercase tracking-[0.2em] leading-none">Manager</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 py-2">
            <SidebarGroup>
              <SidebarMenu className="gap-1.5">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`w-full transition-all duration-200 h-10 px-3 rounded-lg ${isActive
                          ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-sidebar-foreground/50"}`} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>

        <SidebarInset>
          <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
              <div className="hidden md:flex relative max-w-md w-full ml-4">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  placeholder="Search projects, materials..."
                  className="!pl-16 pr-10 bg-muted/30 border-border/20 focus-visible:ring-primary/20 focus-visible:bg-background rounded-2xl h-11 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu onOpenChange={(open) => !open && setShowAllNotifications(false)}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="group relative rounded-full h-11 w-11 transition-all hover:bg-muted/50 border border-transparent hover:border-border/50">
                    <Bell className="w-5 h-5 text-muted-foreground transition-colors group-hover:text-primary" />
                    <span className="absolute right-3 top-3 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[380px] mt-2 p-0 rounded-[2rem] overflow-hidden border-border/40 shadow-premium bg-background/95 backdrop-blur-xl">
                  <div className="px-6 py-5 border-b border-border/10 bg-primary/[0.03] flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black italic tracking-tighter text-foreground uppercase">Notifications</h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Recent system updates</p>
                    </div>
                    <Badge variant="brand" className="bg-primary/10 text-primary border-primary/20 rounde-full px-3">{notifications.length} Total</Badge>
                  </div>

                  <div className={cn(
                    "divide-y divide-border/5 overflow-y-auto no-scrollbar",
                    showAllNotifications ? "max-h-[450px]" : "max-h-[380px]"
                  )}>
                    {displayNotifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => navigate(notif.link)}
                        className="w-full flex items-start gap-4 p-5 hover:bg-primary/[0.04] transition-all text-left group"
                      >
                        <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-muted/30 border border-border/10 flex items-center justify-center text-muted-foreground transition-all group-hover:bg-primary/20 group-hover:text-primary group-hover:scale-110">
                          {notif.type === 'edit' && <Edit2 className="w-4 h-4" />}
                          {notif.type === 'add' && <Plus className="w-4 h-4" />}
                          {notif.type === 'info' && <Info className="w-4 h-4" />}
                          {notif.type === 'assign' && <Users className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-black text-foreground tracking-tight line-clamp-1">{notif.title}</p>
                          <p className="text-xs font-medium text-muted-foreground line-clamp-2 leading-relaxed opacity-80">{notif.description}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <div className="h-1 w-1 rounded-full bg-primary/40" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{formatRelativeTime(notif.time)}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {!showAllNotifications && notifications.length > 5 && (
                    <div className="p-3 border-t border-border/10 bg-muted/10">
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowAllNotifications(true);
                        }}
                        className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-all italic"
                      >
                        View All Notifications
                      </Button>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 pl-2 pr-2 h-9 rounded-full hover:bg-muted/50">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden sm:inline-block">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:inline-block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1 rounded-xl">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer rounded-md" onClick={() => navigate('/profile')}>Profile Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer rounded-md">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 relative">
            <div className="mx-auto max-w-7xl h-full animate-fade-in">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AuthLayout;
