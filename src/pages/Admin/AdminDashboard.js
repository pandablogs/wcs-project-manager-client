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

const chartData = [
    { name: "Mon", current: 40, previous: 24 },
    { name: "Tue", current: 30, previous: 13 },
    { name: "Wed", current: 20, previous: 38 },
    { name: "Thu", current: 27, previous: 39 },
    { name: "Fri", current: 18, previous: 48 },
    { name: "Sat", current: 23, previous: 38 },
    { name: "Sun", current: 34, previous: 43 },
];

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
    const stats = useSelector((state) => state.user.stats || { totalProjects: 17, activeManagers: 13, materialCatalog: 9, amountInvested: 2390000 });

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

    const activeProjects = 7;

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
                    <Button variant="outline" className="rounded-xl px-6 h-10 border-border/40 bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-white transition-all shadow-sm" onClick={() => navigate("/project-manager-list")}>
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
                    value={stats.totalProjects ?? 0}
                    icon={Building2}
                    trend={12.5}
                    description={`${activeProjects} nodes currently operational`}
                    delay={0.1}
                />
                <StatCard
                    title="Executive Staff"
                    value={stats.activeManagers ?? 0}
                    icon={Users}
                    trend={0}
                    description="Verified project managers"
                    delay={0.2}
                />
                <StatCard
                    title="Asset Catalog"
                    value={stats.materialCatalog ?? 0}
                    icon={Hammer}
                    description="Standardized material units"
                    delay={0.3}
                />
                <StatCard
                    title="Capital Flow"
                    value={`$${((stats.totalBudget || stats.amountInvested || 0) / 1000).toFixed(0)}k`}
                    icon={DollarSign}
                    trend={-2.4}
                    description="Aggregated budget commitment"
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
                                <CardTitle className="text-2xl font-black tracking-tighter">Operational Flux</CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Completion metrics: current vs baseline</CardDescription>
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
                                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={8}>
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
                            <CardTitle className="text-2xl font-black tracking-tighter">Strategic Assets</CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Latest high-priority builds</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 px-10 pb-6">
                            <div className="space-y-6">
                                {[
                                    { id: 1, name: "Oakwood Estate", loc: "1245 Oakwood Dr, Austin", val: "$125k", status: "Active" },
                                    { id: 2, name: "Riverside Flip", loc: "88 Riverside Ave, Austin", val: "$85k", status: "Review" },
                                    { id: 3, name: "Sunset Hill Retreat", loc: "342 Sunset Blvd, Dallas", val: "$41k", status: "Idle" },
                                ].map((p, i) => (
                                    <div key={p.id} className="flex items-center justify-between group cursor-pointer transition-all hover:translate-x-1">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/20 shadow-md group-hover:scale-110 transition-transform">
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tight">{p.name}</p>
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 truncate max-w-[120px]">{p.loc}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-foreground tracking-tighter">{p.val}</p>
                                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-60">{p.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="ghost" className="w-full mt-10 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-white hover:bg-primary transition-all group italic" onClick={() => navigate("/project-list")}>
                                Portfolio Registry <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;