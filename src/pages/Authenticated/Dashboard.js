import React, { useMemo } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from '../../redux/slices/userSlice';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  LogOut, 
  LayoutDashboard, 
  Settings,
  Bell,
  Clock,
  Briefcase,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Package,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from 'react';
import materialService from '../../services/materialServices';
import { toast } from 'react-toastify';

// Premium UI Components
import { Button } from "../../components/ui/Button";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/Avatar";
import { StatCard } from "../../components/ui/StatCard";

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [dashStats, setDashStats] = useState({
        projects: 0,
        budget: 0,
        activities: []
    });
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchDashData = async () => {
            setLoading(true);
            try {
                const [pRes, mRes] = await Promise.all([
                    materialService.getProjects({ limit: 5 }),
                    materialService.getMaterialAll({ limit: 5 })
                ]);
                
                const projects = pRes.data?.projects || [];
                const totalBudget = projects.reduce((acc, p) => acc + (Number(p.totalBudget) || 0), 0);
                
                setDashStats({
                    projects: pRes.data?.totalRecords || 0,
                    budget: totalBudget,
                    activities: [
                        ...projects.map(p => ({ 
                            title: "Project Discovery", 
                            desc: `Project "${p.name}" is active.`, 
                            time: "Recently", 
                            icon: Briefcase 
                        })),
                        ...(mRes.data || []).slice(0, 2).map(m => ({ 
                            title: "Resource Audit", 
                            desc: `Material "${m.name}" verified.`, 
                            time: "Recently", 
                            icon: Package 
                        }))
                    ].slice(0, 5)
                });
            } catch (err) {
                toast.error("Cloud synchronization failed");
            } finally {
                setLoading(false);
            }
        };
        fetchDashData();
    }, []);

    const handleLogout = () => {
        dispatch(clearUser());
        localStorage.clear();
        navigate("/logout");
    };

    const initials = useMemo(() => {
        if (!user) return "U";
        return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || "U";
    }, [user]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-8 pb-12"
        >
            {/* Hero Section / Profile Header */}
            <div className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden p-8 md:p-12 border border-white/10 shadow-2xl shadow-slate-900/50">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-slate-900 relative">
                            <AvatarFallback className="bg-slate-800 text-3xl font-black text-white italic">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-emerald-500 border-4 border-slate-900" />
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic">
                                Hello, {user?.firstName || 'User'}
                            </h1>
                            <Badge variant="outline" className="h-7 px-3 rounded-full border-primary/40 text-primary bg-primary/10 text-[10px] uppercase font-black italic tracking-widest">
                                {user?.role_type || 'Account Holder'}
                            </Badge>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-400 font-medium font-inter">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary/60" />
                                <span className="text-sm">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-primary">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-sm font-bold uppercase tracking-tighter">Verified Identity</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 h-12" onClick={() => navigate("/profile")}>
                            <Settings className="w-4 h-4 mr-2" /> Settings
                        </Button>
                        <Button className="rounded-2xl bg-primary text-white h-12 px-8 font-black italic" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats Summary */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StatCard 
                            title="Active Projects" 
                            value={dashStats.projects} 
                            icon={Briefcase} 
                            description="Project pipeline status" 
                            delay={0.1}
                            trend={null}
                        />
                        <StatCard 
                            title="Financial Allocation" 
                            value={`$${dashStats.budget.toLocaleString()}`} 
                            icon={CreditCard} 
                            description="Estimated total budget" 
                            delay={0.2}
                            trend={null}
                        />
                    </div>

                    <Card className="rounded-[2rem] border-border/40 shadow-xl overflow-hidden bg-card/30 backdrop-blur-sm">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                        <Bell className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold tracking-tight">Recent Activity</CardTitle>
                                        <CardDescription>Stay updated on your project ecosystem.</CardDescription>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-primary font-bold">See all</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 space-y-4">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <div key={i} className="h-16 bg-muted/20 animate-pulse rounded-2xl" />
                                ))
                            ) : dashStats.activities.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-40 italic">
                                    No recent activity logged
                                 </div>
                            ) : (
                                dashStats.activities.map((item, i) => (
                                    <div key={i} className="group flex items-center gap-4 p-4 rounded-2xl bg-muted/20 hover:bg-primary/5 border border-border/40 transition-all cursor-pointer">
                                        <div className="h-10 w-10 rounded-xl bg-background border border-border/40 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{item.time}</span>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Account Details Sidebar */}
                <div className="space-y-8">
                    <Card className="rounded-[2.5rem] border-primary/20 shadow-premium bg-slate-900 text-white overflow-hidden relative">
                        <CardHeader className="p-10 pb-6 relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-2 w-8 bg-primary rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Premium Status</span>
                            </div>
                            <CardTitle className="text-2xl font-black italic tracking-tighter">WCS Enterprise</CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 relative z-10 space-y-8">
                            <p className="text-sm font-medium leading-relaxed text-slate-400">
                                You are currently subscribed to the Enterprise tier with unlimited architectural modeling and financial reporting tools.
                            </p>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span>System Utilization</span>
                                        <span className="text-primary">82%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full w-[82%] bg-gradient-to-r from-primary to-blue-500 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full h-14 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black italic tracking-tight group">
                                PROJECT MANAGER PANEL <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </CardContent>
                        <div className="absolute -bottom-8 -right-8 h-32 w-32 bg-primary/20 blur-[64px] rounded-full pointer-events-none" />
                    </Card>

                    <Card className="rounded-[2rem] border-border/40 shadow-xl bg-card/50">
                        <CardHeader className="p-8">
                            <CardTitle className="text-lg font-bold">Quick Navigation</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 grid grid-cols-2 gap-3">
                            {[
                                { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
                                { name: "Projects", icon: Briefcase, path: "/project-list" },
                                { name: "Estimator", icon: Calculator, path: "/project-estimater" },
                                { name: "Materials", icon: Package, path: "/material-list" },
                            ].map((nav, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => navigate(nav.path)}
                                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-background border border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                >
                                    <nav.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground">{nav.name}</span>
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};

// Simple Calculator icon replacement if not in lucide
const Calculator = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
        <line x1="8" x2="16" y1="6" y2="6"/>
        <line x1="16" x2="16" y1="14" y2="18"/>
        <path d="M16 10h.01"/>
        <path d="M12 10h.01"/>
        <path d="M8 10h.01"/>
        <path d="M12 14h.01"/>
        <path d="M8 14h.01"/>
        <path d="M12 18h.01"/>
        <path d="M8 18h.01"/>
    </svg>
);

export default Dashboard;