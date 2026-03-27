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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import materialService from "../../services/materialServices";
import projectManagerService from "../../services/projectManagerServices";


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'var(--color-background, #fff)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: '12px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
                <p style={{ fontWeight: 800, fontSize: 13, marginBottom: 8, borderBottom: '1px solid rgba(99,102,241,0.1)', paddingBottom: 6 }}>{label}</p>
                {payload.map((entry, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, marginTop: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.dataKey === 'current' ? 'hsl(238 83% 60%)' : 'rgba(99,102,241,0.3)' }} />
                            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280' }}>{entry.name}</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 900, color: entry.dataKey === 'current' ? 'hsl(238 83% 60%)' : '#374151' }}>{entry.value}</span>
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
        if (hrs < 12) setGreet("Good Morning");
        else if (hrs >= 12 && hrs < 18) setGreet("Good Afternoon");
        else setGreet("Good Evening");
    }, [hrs]);

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
                const [projectsRes, managersRes, materialsRes] = await Promise.all([
                    materialService.getProjects({ limit: 1000 }),
                    projectManagerService.getAllProjectManager({ limit: 1000 }),
                    materialService.getMaterialAll()
                ]);

                const projects = projectsRes?.data?.projects || [];
                const managers = managersRes?.data?.project_managerList || [];
                const materials = materialsRes?.data || [];

                const activeCount = projects.filter(p => p.status === 'Active' || p.status === 'In Progress').length;
                const totalBudget = projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
                
                setDashboardStats({
                    totalProjects: projects.length,
                    activeProjects: activeCount,
                    activeManagers: managers.length,
                    materialCatalog: materials.length,
                    totalBudget: totalBudget,
                    recentProjects: projects.slice(0, 3)
                });

                // Generate dynamic chart data based on project creation dates over the last 7 days
                const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const last7Days = Array.from({length: 7}, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    return { name: days[d.getDay()], current: 0, previous: 0, dateStr: d.toDateString() };
                });

                projects.forEach(p => {
                    if (p.createdAt) {
                        const createdDate = new Date(p.createdAt);
                        const dayMatch = last7Days.find(d => d.dateStr === createdDate.toDateString());
                        if (dayMatch) {
                            dayMatch.current += 1;
                        }
                    }
                });
                setDynamicChartData(last7Days);

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
                    value={`$${(dashboardStats.totalBudget / 1000).toFixed(0)}k`}
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
                                <CardTitle className="text-2xl font-black tracking-tighter">Activity</CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Project progress comparison</CardDescription>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary/10 border border-primary/20" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Baseline</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10">
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dynamicChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={8}>
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
                                        />
                                        <RechartsTooltip
                                            cursor={{ fill: 'hsl(var(--primary)/0.03)' }}
                                            content={<CustomTooltip />}
                                        />
                                        <Bar name="Baseline" dataKey="previous" fill="hsl(var(--primary)/0.15)" radius={[6, 6, 0, 0]} barSize={24} />
                                        <Bar name="Current" dataKey="current" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={24} />
                                    </BarChart>
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
                                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 truncate max-w-[120px]">{p.address || 'Global Location'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-foreground tracking-tighter">${(Number(p.budget) || 0).toLocaleString()}</p>
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