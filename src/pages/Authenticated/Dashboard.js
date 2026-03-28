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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';

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
import { PageHeader } from "../../components/ui/PageHeader";

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const [dashStats, setDashStats] = useState({
        projects: 0,
        budget: 0,
        activities: []
    });
    const [dynamicChartData, setDynamicChartData] = useState([]);
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
                
                // Generate dynamic chart data based on project budgets over the last 5 months
                const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const last5Months = Array.from({ length: 5 }, (_, i) => {
                    const d = new Date();
                    d.setMonth(d.getMonth() - (4 - i));
                    return { 
                        name: shortMonths[d.getMonth()], 
                        budget: 0, 
                        month: d.getMonth(), 
                        year: d.getFullYear() 
                    };
                });

                projects.forEach(p => {
                    if (p.createdAt) {
                        const date = new Date(p.createdAt);
                        const monthMatch = last5Months.find(m => m.month === date.getMonth() && m.year === date.getFullYear());
                        if (monthMatch) {
                            monthMatch.budget += (Number(p.totalBudget || p.budget) || 0);
                        }
                    }
                });
                setDynamicChartData(last5Months);
                
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
        sessionStorage.removeItem("wcs_session_logged");
        navigate("/");
    };

    const initials = useMemo(() => {
        if (!user) return "U";
        return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || "U";
    }, [user]);

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        if (hour < 21) return "Good evening";
        return "Good night";
    }, []);

    const displayName = useMemo(() => {
        const name = user?.firstName || user?.name || "";
        if (name) return name;
        
        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                const parsed = JSON.parse(stored);
                return (parsed.firstName || parsed.name || "").split(' ')[0] || "User";
            }
            return (localStorage.getItem("user_name") || localStorage.getItem("name") || "User").split(' ')[0];
        } catch {
            return "User";
        }
    }, [user]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-8 pb-12"
        >
            {/* Streamlined Header */}
            <PageHeader 
                title={`${greeting}, ${displayName}`} 
                description={`Verified ${user?.role_type || 'Account Holder'} session active.`}
            >
                <div className="flex items-center gap-3">
                    <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary h-10 px-6 font-black italic tracking-tight text-white uppercase hover:opacity-90" onClick={() => navigate("/profile")}>
                        <Settings className="w-4 h-4 mr-2" /> Settings
                    </Button>
                    <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary h-10 px-6 font-black italic tracking-tight text-white uppercase hover:opacity-90" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </Button>
                </div>
            </PageHeader>

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
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold tracking-tight">Budget Trend</CardTitle>
                                        <CardDescription>Project valuation over last 5 months</CardDescription>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-4">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dynamicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="chartGradientManager" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--primary)/0.05)" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }}
                                            dy={15}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 900 }}
                                            tickFormatter={(value) => `$${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                                        />
                                        <RechartsTooltip
                                            cursor={{ stroke: 'hsl(var(--primary)/0.2)', strokeWidth: 2 }}
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-background/90 backdrop-blur-sm border border-border/50 p-3 rounded-xl shadow-xl">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                                                            <p className="text-sm font-black text-primary">${payload[0].value.toLocaleString()}</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="budget"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#chartGradientManager)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Account Details Sidebar */}
                <div className="space-y-8">

                    <Card className="rounded-[2rem] border-border/40 shadow-xl bg-card/50">
                        <CardHeader className="p-8">
                            <CardTitle className="text-lg font-bold">Quick Navigation</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 grid grid-cols-2 gap-3">
                            {[
                                { name: "Dashboard", icon: LayoutDashboard, path: user?.role_type === "admin" ? "/admin/dashboard" : user?.role_type === "project_manager" ? "/projectManager/dashboard" : "/user/dashboard" },
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