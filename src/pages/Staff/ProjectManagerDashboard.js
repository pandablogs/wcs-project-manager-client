import React, { useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
    
    const userName = useMemo(() => {
      try {
        return localStorage.getItem("user_name") || localStorage.getItem("name") || "Manager";
      } catch {
        return "Manager";
      }
    }, []);

    const firstName = userName.split(' ')[0];

    return (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="space-y-8 pb-12"
        >
          {/* Enhanced Header */}
          <PageHeader 
            title={`Welcome back, ${firstName}`} 
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
              value={stats.assignedProjects ?? 4}
              trend={12}
              description="Active projects"
              icon={Briefcase}
              delay={0.1}
            />
            <StatCard 
              title="Tasks"
              value={12}
              description="Items to review"
              icon={Activity}
              delay={0.2}
              trend="stable"
            />
            <StatCard 
              title="Catalog Access"
              value={stats.materialCatalog ?? 452}
              description="Total materials"
              icon={Box}
              delay={0.3}
            />
            <StatCard 
              title="Progress"
              value="84%"
              trend={2.4}
              description="Project pace"
              icon={TrendingUp}
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
                      {[
                        { time: "18m ago", msg: "Architectural material added to Oakwood Estate catalog.", type: "Asset", icon: Box },
                        { time: "2h ago", msg: "Budget protocol approved for Riverside Unit 402.", type: "Protocol", icon: Zap },
                        { time: "5h ago", msg: "Project Manager assigned to New Heights Phase II.", type: "Identity", icon: Briefcase },
                      ].map((item, i) => (
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
                      ))}
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

                {/* Promotional/System Status Card */}
                <div className="group relative rounded-[2.5rem] bg-slate-900 text-white p-10 overflow-hidden shadow-2xl border border-white/5 shadow-slate-900/40 cursor-default">
                   <div className="absolute top-0 right-0 h-48 w-48 bg-primary/20 rounded-full blur-[72px] group-hover:bg-primary/30 transition-all duration-700 pointer-events-none" />
                   
                   <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                            <Star className="w-5 h-5 text-primary fill-primary" />
                         </div>
                         <h4 className="text-2xl font-black tracking-tighter italic">WCS <span className="text-primary">ELITE</span></h4>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest opacity-80">
                          Manage your projects and materials in one place.
                      </p>
                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Project Progress</span>
                             <span className="text-[10px] font-black text-primary italic">67% Complete</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden shadow-lg">
                            <motion.div 
                               initial={{ width: 0 }} 
                               animate={{ width: "67%" }} 
                               transition={{ duration: 1.5, ease: "easeOut" }}
                               className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.8)]" 
                            />
                         </div>
                      </div>
                       <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] italic">System ID: WCS-X-9982</p>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
    );
};

export default ProjectManagerDashboard;
