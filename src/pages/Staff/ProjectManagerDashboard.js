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
import { motion } from "framer-motion";

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
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchDashData = async () => {
            setLoading(true);
            try {
                const [pRes, mRes] = await Promise.all([
                    materialService.getProjects({ limit: 5 }),
                    materialService.getMaterialAll({ limit: 5 })
                ]);
                
                setDashStats({
                    projects: pRes.data?.totalRecords || 0,
                    materials: mRes.data?.length || 0,
                    activities: [
                        ...(pRes.data?.projects || []).map(p => ({ 
                            time: "Recently", 
                            msg: `Project "${p.name}" registered in portfolio.`, 
                            type: "Portfolio", 
                            icon: Briefcase 
                        })),
                        ...(mRes.data || []).slice(0, 2).map(m => ({ 
                            time: "Recently", 
                            msg: `New material category "${m.name}" added to registry.`, 
                            type: "Catalog", 
                            icon: Box 
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

    const userName = useMemo(() => {
      try {
        return localStorage.getItem("user_name") || localStorage.getItem("name") || "Manager";
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
          {/* Enhanced Header */}
          <PageHeader 
            title={`${greeting}, ${firstName}`} 
            description="Manage your projects and team."
          >
            <div className="flex gap-3">
               <Button 
                 variant="outline"
                 className="rounded-xl border-border/40 bg-background/50 backdrop-blur-sm h-10 px-6 hover:bg-primary hover:text-white transition-all shadow-sm"
                 onClick={() => navigate("/project-list")}
               >
                 <ListTodo size={16} className="mr-2" /> Portfolios
               </Button>
               <Button 
                 className="rounded-xl shadow-lg shadow-primary/20 bg-primary h-10 px-6 font-black italic tracking-tight text-white hover:opacity-90"
                 onClick={() => navigate("/project-estimater")}
               >
                 <Plus size={16} className="mr-2" /> NEW INITIATIVE
               </Button>
            </div>
          </PageHeader>

          {/* Optimized KPI Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Assigned Portfolios"
              value={dashStats.projects}
              trend={null}
              description="Active projects"
              icon={Briefcase}
              delay={0.1}
            />
            <StatCard 
              title="Active Nodes"
              value={dashStats.projects > 0 ? 1 : 0}
              description="Operational instances"
              icon={Activity}
              delay={0.2}
              trend={null}
            />
            <StatCard 
              title="Catalog Assets"
              value={dashStats.materials}
              description="Total materials"
              icon={Box}
              delay={0.3}
            />
            <StatCard 
              title="System Load"
              value="Optimized"
              trend={null}
              description="Cloud overhead"
              icon={Zap}
              delay={0.4}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
             <div className="lg:col-span-2">
                {/* Active Feed with refined styling */}
                <Card className="rounded-[2.5rem] border-border/40 shadow-2xl overflow-hidden bg-card/30 backdrop-blur-md h-full">
                   <CardHeader className="p-10 pb-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <CardTitle className="text-2xl font-black italic tracking-tighter">Activity</CardTitle>
                           <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Recent updates</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-black italic border-primary/30 text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-widest">WCS NODE: {stats.nodeId || "LIVE"}</Badge>
                      </div>
                   </CardHeader>
                   <CardContent className="px-10 pb-10 space-y-4">
                      {loading ? (
                        Array(3).fill(0).map((_, i) => (
                           <div key={i} className="h-20 bg-primary/5 animate-pulse rounded-2xl" />
                        ))
                      ) : dashStats.activities.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground font-bold uppercase tracking-widest text-[10px] opacity-40 italic">
                           No recent activity logged
                        </div>
                      ) : (
                        dashStats.activities.map((item, i) => (
                           <div key={i} className="group relative flex items-center gap-6 p-5 rounded-2xl bg-primary/[0.02] hover:bg-primary/[0.05] border border-border/20 transition-all cursor-pointer">
                              <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm group-hover:scale-110 transition-transform">
                                 <item.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                 <p className="text-sm font-black text-foreground italic leading-none tracking-tight">{item.msg}</p>
                                 <div className="flex items-center gap-3 mt-2">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{item.time}</span>
                                    <div className="w-1 h-1 rounded-full bg-primary/30" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary italic">{item.type}</span>
                                 </div>
                              </div>
                              <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-40 transition-all -translate-y-1" />
                           </div>
                         ))
                      )}
                      <Button variant="ghost" className="w-full h-14 mt-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-white hover:bg-primary transition-all group italic">
                        ALL ACTIVITY <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                   </CardContent>
                </Card>
             </div>

             <div className="space-y-8">
                {/* Control Matrix */}
                <Card className="rounded-[2.5rem] border-border/40 shadow-2xl overflow-hidden bg-card/30 backdrop-blur-md">
                   <CardHeader className="p-10 pb-6">
                      <CardTitle className="text-2xl font-black italic tracking-tighter text-center">Quick Links</CardTitle>
                      <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 text-center">Easy access to all modules</CardDescription>
                   </CardHeader>
                   <CardContent className="px-10 pb-10 grid grid-cols-2 gap-4">
                      {[
                        { label: "Catalog", icon: Box, path: "/material-list" },
                        { label: "Presets", icon: Layers, path: "/rehab-groups" },
                        { label: "Overview", icon: LayoutDashboard, path: "/projectManager/dashboard" },
                        { label: "Registry", icon: ListTodo, path: "/project-list" },
                      ].map((link, i) => (
                        <button 
                          key={i}
                          onClick={() => navigate(link.path)}
                          className="flex flex-col items-center justify-center p-6 rounded-3xl bg-background/50 border border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all gap-3 group shadow-sm active:scale-[0.98]"
                         >
                           <div className="w-12 h-12 rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                              <link.icon size={20} className="text-primary/60 group-hover:text-primary transition-colors" />
                           </div>
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground">{link.label === "Registry" ? "Projects" : link.label === "Presets" ? "Templates" : link.label}</span>
                        </button>
                      ))}
                   </CardContent>
                </Card>

             </div>
          </div>
        </motion.div>
    );
};

export default ProjectManagerDashboard;
