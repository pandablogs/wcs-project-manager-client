import React, { useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from 'react';
import materialService from '../../services/materialServices';
import { toast } from 'react-toastify';
import { 
  Plus, 
  LayoutGrid, 
  ListTodo, 
  Box, 
  Layers, 
  Briefcase,
  TrendingUp,
  Clock,
  LayoutDashboard,
  ChevronRight,
  ArrowUpRight,
  Activity,
  Zap,
  Star
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

// Premium UI Components
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { PageHeader } from "../../components/ui/PageHeader";

const ProjectManagerDashboard = () => {
    const navigate = useNavigate();
    const stats = useSelector((state) => state.user.stats || {});
    const [dashStats, setDashStats] = useState({
        projects: 0,
        materials: 0,
        activities: []
    });
    const [dynamicChartData, setDynamicChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchDashData = async () => {
            setLoading(true);
            try {
                const [pRes, mRes] = await Promise.all([
                    materialService.getProjects({ limit: 100 }), // Increased limit for chart
                    materialService.getMaterialAll({ limit: 5 })
                ]);
                
                const projects = pRes.data?.projects || [];
                
                setDashStats({
                    projects: pRes.data?.totalRecords || 0,
                    materials: mRes.data?.length || 0,
                    activities: [] // Activity Feed removed
                });

                // Generate dynamic chart data (Last 5 Months)
                const today = new Date();
                const last5Months = Array.from({ length: 5 }, (_, i) => {
                    const d = new Date(today.getFullYear(), today.getMonth() - (4 - i), 1);
                    return { 
                        name: d.toLocaleString('default', { month: 'short' }), 
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
                
                // If all budgets are 0 for test purposes, add some variation if desired, but here we stay true to data.
                // However, Recharts needs values > 0 to show a "trend".
                setDynamicChartData(last5Months);

            } catch (err) {
                toast.error("Cloud synchronization failed");
            } finally {
                setLoading(false);
            }
        };
        fetchDashData();
    }, []);

    const userName = useMemo(() => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return user.firstName || localStorage.getItem("user_name") || localStorage.getItem("name") || "Manager";
      } catch {
        return "Manager";
      }
    }, []);

    const firstName = userName.split(' ')[0];

    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        if (hour < 21) return "Good evening";
        return "Good night";
    }, []);

    return (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="space-y-8 pb-12"
        >
          {/* Header */}
          <PageHeader 
            title={`${greeting}, ${firstName}`} 
            description="Manage your projects and team."
          >
            <div className="flex gap-3">
               <Button 
                 className="rounded-xl shadow-lg shadow-primary/20 bg-primary h-10 px-6 font-black italic tracking-tight text-white hover:opacity-90"
                 onClick={() => navigate("/project-list")}
               >
                 <ListTodo size={16} className="mr-2" /> PORTFOLIOS
               </Button>
               <Button 
                 className="rounded-xl shadow-lg shadow-primary/20 bg-primary h-10 px-6 font-black italic tracking-tight text-white hover:opacity-90 transition-all active:scale-[0.98]"
                 onClick={() => navigate("/project-estimater")}
               >
                 <Plus size={16} className="mr-2" /> NEW INITIATIVE
               </Button>
            </div>
          </PageHeader>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Assigned Portfolios"
              value={dashStats.projects}
              icon={Briefcase}
              delay={0.1}
            />
            <StatCard 
              title="Active Nodes"
              value={dashStats.projects > 0 ? 1 : 0}
              icon={Activity}
              delay={0.2}
            />
            <StatCard 
              title="Catalog Assets"
              value={dashStats.materials}
              icon={Box}
              delay={0.3}
            />
            <StatCard 
              title="Workload"
              value="Optimized"
              icon={Zap}
              delay={0.4}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Area - 2/3 width */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <Card className="h-full border-border/40 bg-card/30 backdrop-blur-md shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-6 px-10 pt-10">
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
                <CardContent className="px-10 pb-10 flex-1 flex flex-col min-h-[400px]">
                  <div className="flex-1 w-full min-h-[350px]">
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
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background/95 backdrop-blur-md border border-border/40 p-4 rounded-2xl shadow-2xl">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{payload[0].payload.name}</p>
                                  <p className="text-xl font-black tracking-tighter text-primary">
                                    ${Number(payload[0].value).toLocaleString()}
                                  </p>
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
                          fill="url(#chartGradient)" 
                          animationDuration={2000}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Links Column - 1/3 width */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="space-y-6">
                <Card className="rounded-[2.5rem] border-border/40 shadow-2xl overflow-hidden bg-card/30 backdrop-blur-md">
                   <CardHeader className="p-10 pb-6">
                      <CardTitle className="text-2xl font-black italic tracking-tighter text-center">Quick Links</CardTitle>
                      <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 text-center">Easy access to all modules</CardDescription>
                   </CardHeader>
                   <CardContent className="px-10 pb-10 grid grid-cols-2 gap-4">
                      {[
                        { label: "Catalog", icon: Box, path: "/material-list" },
                        { label: "Templates", icon: Layers, path: "/rehab-groups" },
                        { label: "Overview", icon: LayoutDashboard, path: "/projectManager/dashboard" },
                        { label: "Projects", icon: ListTodo, path: "/project-list" },
                      ].map((item, i) => (
                        <button 
                          key={i}
                          onClick={() => navigate(item.path)}
                          className="flex flex-col items-center justify-center p-6 rounded-3xl bg-background/50 border border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all gap-3 group shadow-sm active:scale-[0.98]"
                         >
                           <div className="w-12 h-12 rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                              <item.icon size={20} className="text-primary/60 group-hover:text-primary transition-colors" />
                           </div>
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground">{item.label}</span>
                        </button>
                      ))}
                   </CardContent>
                </Card>

                {/* Status Indicator */}
                <Card className="rounded-[2.5rem] border-border/40 shadow-2xl overflow-hidden bg-card/30 backdrop-blur-md p-8 flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">System Mode</p>
                      <p className="text-lg font-black italic tracking-tighter">Production</p>
                   </div>
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   </div>
                </Card>
              </div>
            </motion.div>
          </div>
        </motion.div>
    );
};

export default ProjectManagerDashboard;
