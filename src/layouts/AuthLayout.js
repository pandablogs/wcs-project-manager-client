import React, { useContext, useMemo } from "react";
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
  ChevronDown
} from "lucide-react";
import { Input } from "../components/ui/Input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/DropdownMenu";
import { Avatar, AvatarFallback } from "../components/ui/Avatar";
import { ThemeContext, LoadingContext } from "../App";
import { PremiumLoader } from "../components/ui/PremiumLoader";
import { useSelector } from "react-redux";

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useContext(ThemeContext);
  const { loading, setLoading } = useContext(LoadingContext);

  const reduxLoading = useSelector(state => state.project_manager?.loading || state.user?.loading);

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

  const user = {
    name: isAdmin ? "Admin User" : "Project Manager",
    email: isAdmin ? "admin@wcs.com" : "pm@wcs.com"
  };

  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

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
                  className="!pl-16 bg-muted/30 border-border/20 focus-visible:ring-primary/20 focus-visible:bg-background rounded-2xl h-11 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground">
                <Bell className="w-4 h-4" />
              </Button>

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
                  <DropdownMenuItem className="cursor-pointer rounded-md">Profile Settings</DropdownMenuItem>
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
