import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Building2,
    Users,
    Hammer,
    DollarSign,
    ArrowRight
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { StatCard } from "../../components/ui/StatCard";
import { PageHeader } from "../../components/ui/PageHeader";
import { motion } from "framer-motion";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import materialService from "../../services/materialServices";
import projectManagerService from "../../services/projectManagerServices";


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: '16px 20px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
                <p style={{ fontWeight: 900, fontSize: 14, marginBottom: 12, color: '#1e293b', borderBottom: '1px solid rgba(99,102,241,0.1)', paddingBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label} 2026</p>
                {payload.map((entry, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, marginTop: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'hsl(238 83% 60%)', boxShadow: '0 0 10px rgba(99,102,241,0.4)' }} />
                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b' }}>Projected Budget</span>
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', fontFamily: 'monospace' }}>
                            ${Number(entry.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const hrs = new Date().getHours();
    const [greet, setGreet] = useState("Hello");
    const [dashboardStats, setDashboardStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        activeManagers: 0,
        materialCatalog: 0,
        totalBudget: 0,
        recentProjects: []
    });
    const [loading, setLoading] = useState(true);
    const [dynamicChartData, setDynamicChartData] = useState([]);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreet("Good morning");
        else if (hour < 17) setGreet("Good afternoon");
        else if (hour < 21) setGreet("Good evening");
        else setGreet("Good night");
    }, []);

    const userName = useMemo(() => {
        try {
            return localStorage.getItem("user_name") || localStorage.getItem("name") || "Admin";
        } catch {
            return "Admin";
        }
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch independently so one failure doesn't block the whole dashboard
                const safeFetch = async (promise, fallback = []) => {
                    try {
                        const res = await promise;
                        if (!res) return fallback;

                        // Deep-Search data seeker: finds the first meaningful array in any structure
                        const findArray = (obj, depth = 0) => {
                            if (depth > 5) return null; // Prevent infinite recursion
                            if (Array.isArray(obj)) return obj;
                            if (!obj || typeof obj !== 'object') return null;

                            // 1. Check priority known keys first at this level
                            const priorityKeys = ['projects', 'staff', 'managers', 'users', 'project_managerList', 'project_manager_list'];
                            for (const key of priorityKeys) {
                                if (Array.isArray(obj[key])) return obj[key];
                            }

                            // 2. Check for any array property at this level
                            for (const key in obj) {
                                if (Array.isArray(obj[key]) && obj[key].length > 0) return obj[key];
                            }

                            // 3. Recurse into objects
                            for (const key in obj) {
                                if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                                    const found = findArray(obj[key], depth + 1);
                                    if (found) return found;
                                }
                            }

                            return null;
                        };

                        const result = findArray(res);
                        return result || fallback;
                    } catch (e) {
                        console.error("Fetch failed", e);
                        return fallback;
                    }
                };

                const [projects, managers, materials] = await Promise.all([
                    safeFetch(materialService.getProjects({ limit: 100 })),
                    safeFetch(projectManagerService.getAllProjectManager({ 
                        page: 1, 
                        limit: 100,
                        sortField: "firstName",
                        sortOrder: -1
                    })),
                    safeFetch(materialService.getMaterialAll())
                ]);

                const activeCount = projects.filter(p => p.status === 'Active' || p.status === 'In Progress' || !p.status).length;
                const totalBudget = projects.reduce((sum, p) => sum + (Number(p.totalBudget || p.budget) || 0), 0);

                // Sort projects by date newest to oldest
                const sortedProjects = [...projects].sort((a, b) =>
                    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                );

                setDashboardStats({
                    totalProjects: projects.length,
                    activeProjects: activeCount,
                    activeManagers: managers.length,
                    materialCatalog: materials.length,
                    totalBudget: totalBudget,
                    recentProjects: sortedProjects.slice(0, 5)
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

            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pb-12"
        >
            <PageHeader
                title={<span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent font-display tracking-tight leading-tight">{greet}, {userName.split(' ')[0]}</span>}
            >
                <div className="flex gap-3">
                    <Button className="rounded-xl px-6 h-10 shadow-lg shadow-primary/20 bg-primary text-white hover:opacity-90 transition-all font-bold tracking-tight" onClick={() => navigate("/admin/project-manager-list")}>
                        Manage Team
                    </Button>
                    <Button className="rounded-xl px-6 h-10 shadow-lg shadow-primary/20 bg-primary text-white hover:opacity-90 transition-all font-bold tracking-tight" onClick={() => navigate("/project-list")}>
                        Project Portfolio
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    title="Active Projects"
                    value={dashboardStats.totalProjects}
                    icon={Building2}
                    description={`${dashboardStats.activeProjects} active projects`}
                    delay={0.1}
                />
                <StatCard
                    title="Executive Staff"
                    value={dashboardStats.activeManagers}
                    icon={Users}
                    description="Verified managers"
                    delay={0.2}
                />
                <StatCard
                    title="Asset Catalog"
                    value={dashboardStats.materialCatalog}
                    icon={Hammer}
                    description="Total materials"
                    delay={0.3}
                />
                <StatCard
                    title="Capital Flow"
                    value={`$${dashboardStats.totalBudget}`}
                    icon={DollarSign}
                    description="Total budget"
                    delay={0.4}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2"
                >
                    <Card className="h-full border-border/40 bg-card/30 backdrop-blur-md shadow-2xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-10 px-10 pt-10">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black tracking-tighter">Budget Trend</CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Project valuation over last 5 months</CardDescription>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Budget</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10">
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dynamicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
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
                                            content={<CustomTooltip />}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="budget"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#chartGradient)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="h-full border-border/40 bg-card/30 backdrop-blur-md shadow-2xl rounded-[2.5rem] flex flex-col overflow-hidden">
                        <CardHeader className="px-10 pt-10 pb-6">
                            <CardTitle className="text-2xl font-black tracking-tighter">Recent Projects</CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Recently added projects</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 px-10 pb-6">
                            <div className="space-y-6">
                                {loading ? (
                                    Array(3).fill(0).map((_, i) => (
                                        <div key={i} className="h-16 bg-primary/5 animate-pulse rounded-2xl" />
                                    ))
                                ) : dashboardStats.recentProjects.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-40 italic">
                                        No projects found
                                    </div>
                                ) : (
                                    dashboardStats.recentProjects.map((p, i) => (
                                        <div key={p._id} className="flex items-center justify-between group cursor-pointer transition-all hover:translate-x-1" onClick={() => navigate("/project-list")}>
                                            <div className="flex gap-4 items-center">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg group-hover:scale-110 transition-transform">
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1">{p.name || 'Untitled Project'}</p>
                                                    <div className="flex items-center gap-1.5 opacity-40">
                                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest truncate max-w-[120px]">{p.address || 'Global Location'}</p>
                                                        <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground" />
                                                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.1em]">
                                                            {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Unknown'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-foreground tracking-tighter">${(Number(p.totalBudget || p.budget) || 0).toLocaleString()}</p>
                                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-60">{p.status || 'Active'}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <Button variant="default" className="w-full mt-10 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] bg-primary text-white hover:opacity-90 transition-all group italic" onClick={() => navigate("/project-list")}>
                                All Projects <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;