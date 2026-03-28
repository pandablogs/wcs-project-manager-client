import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  LayoutGrid,
  ArrowUpDown,
  Briefcase,
  Layers,
  Boxes,
  DollarSign,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  ExternalLink,
  ClipboardList
} from "lucide-react";
import materialService from '../../services/materialServices';
import userServices from '../../services/userServices';
import { getUserRole } from "../../utils/helpers";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/AlertDialog";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/Popover";
import { Checkbox } from "../../components/ui/Checkbox";
import { ScrollArea } from "../../components/ui/ScrollArea";
import { Separator } from "../../components/ui/Separator";
import { Label } from "../../components/ui/Label";

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localLoading, setLocalLoading] = useState(false);
    const [totalDocs, setTotalDocs] = useState(0);
    const [deleteId, setDeleteId] = useState(null);
    const [availableManagers, setAvailableManagers] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Parse search query from URL
    const getSearchFromUrl = () => {
        const params = new URLSearchParams(location.search);
        return params.get('search') || "";
    };

    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 5,
        sortField: "createdAt",
        sortOrder: -1,
        search: getSearchFromUrl(),
        managerIds: [],
        filterType: "all"
    });

    const roleType = getUserRole();
    const isClient = roleType === "user";
    const isAdmin = roleType === "admin";

    // Update search when URL changes
    useEffect(() => {
        const urlSearch = getSearchFromUrl();
        if (urlSearch !== queryParams.search) {
            setQueryParams(prev => ({ ...prev, search: urlSearch, page: 1 }));
        }
    }, [location.search]);

    useEffect(() => {
        fetchProjects();
    }, [queryParams]);

    useEffect(() => {
        if (isAdmin) {
            fetchManagers();
        }
    }, [isAdmin]);

    const fetchManagers = async () => {
        try {
            const res = await userServices.getPublicManagers();
            if (res.status) {
                setAvailableManagers(res.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch managers", error);
        }
    };

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await materialService.getProjects(queryParams);
            if (res.data) {
                setProjects(res.data.projects || []);
                setTotalDocs(res.data.totalRecords || 0);
            }
        } catch (err) {
            toast.error("Failed to synchronize project portfolio");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setLocalLoading(true);
        try {
            await materialService.deleteProject(deleteId);
            toast.success("Project decommissioned successfully");
            fetchProjects();
        } catch (err) {
            toast.error("Failed to revoke project registration");
        } finally {
            setLocalLoading(false);
            setDeleteId(null);
        }
    };

    const countMaterials = (rooms) =>
        rooms.reduce((acc, room) => acc + (room.materials?.length || 0), 0);

    const countSubMaterials = (rooms) =>
        rooms.reduce((acc, room) =>
            acc + (room.materials?.reduce((mAcc, mat) => mAcc + (mat.subMaterials?.length || 0), 0) || 0), 0);

    const handleSort = (field) => {
        setQueryParams(prev => {
            const isSameField = prev.sortField === field;
            const nextSortOrder = isSameField
                ? (prev.sortOrder === -1 ? 1 : prev.sortOrder === 1 ? 0 : -1)
                : -1;

            return {
                ...prev,
                sortField: nextSortOrder === 0 ? "" : field,
                sortOrder: nextSortOrder
            };
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pb-8"
        >
            <PageHeader 
                title="Projects" 
                description="View and manage all projects."
            >
                <div className="flex gap-4">
                    <div className="relative w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                        <Input 
                            placeholder="Search projects..." 
                            value={queryParams.search}
                            onChange={(e) => setQueryParams(p => ({ ...p, search: e.target.value, page: 1 }))}
                            className="!pl-14 h-11 rounded-2xl bg-card/30 border-border/40 focus-visible:ring-primary/20 font-bold text-xs"
                        />
                    </div>
                    {!isClient && (
                        <Button onClick={() => navigate('/project-estimater')} className="rounded-xl shadow-lg shadow-primary/20 h-11 px-8 bg-primary text-white hover:opacity-90 font-bold italic tracking-tight">
                            <Plus className="w-4 h-4 mr-2" />
                            ADD PROJECT
                        </Button>
                    )}
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Active Projects" value={totalDocs} icon={Briefcase} description="Under management" delay={0.1} />
                <StatCard title="Portfolio Rooms" value={projects.reduce((a, b) => a + (b.rooms?.length || 0), 0)} icon={Boxes} description={`Aggregated across ${projects.length} records`} delay={0.2} />
                <StatCard title="Total Budget" value={`$${projects.reduce((a, b) => a + (Number(b.totalBudget) || 0), 0).toLocaleString()}`} icon={DollarSign} description="Capital allocation" delay={0.3} trend={null} />
            </div>

            <Card className="border-border/40 bg-card/30 backdrop-blur-md shadow-2xl overflow-hidden rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 px-8 pt-8">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-xl">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                            <CardTitle className="text-2xl font-black italic tracking-tighter">Project List</CardTitle>
                            <CardDescription className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Manage your active projects</CardDescription>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                            <PopoverTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className={cn(
                                        "h-12 w-12 rounded-2xl border-border/40 bg-background/50 backdrop-blur-sm transition-all relative",
                                        (queryParams.managerIds.length > 0 || queryParams.filterType !== 'all') && "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                    )}
                                >
                                    <Filter className="w-5 h-5" />
                                    {(queryParams.managerIds.length > 0 || queryParams.filterType !== 'all') && (
                                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                                            <div className="h-1 w-1 rounded-full bg-white animate-ping" />
                                        </div>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-0 rounded-[1.5rem] border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl" align="end" sideOffset={15}>
                                <div className="p-5 space-y-5">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <h4 className="text-sm font-black italic tracking-tight">Project Filters</h4>
                                            <p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-40 italic">Refine Portfolio</p>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => setQueryParams(p => ({ ...p, managerIds: [], filterType: "all", page: 1 }))}
                                            className="h-7 px-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
                                        >
                                            Reset
                                        </Button>
                                    </div>

                                    <Separator className="bg-border/20" />

                                    {/* Role Specific Content */}
                                    {isAdmin ? (
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Personnel Directory</Label>
                                            <ScrollArea className="h-44 pr-3">
                                                <div className="space-y-1.5">
                                                    {availableManagers.map((manager) => (
                                                        <div key={manager._id} className="flex items-center justify-between group p-1.5 hover:bg-primary/5 rounded-xl transition-colors cursor-pointer" onClick={() => {
                                                            const isChecked = queryParams.managerIds.includes(manager._id);
                                                            setQueryParams(p => ({
                                                                ...p,
                                                                page: 1,
                                                                managerIds: !isChecked 
                                                                    ? [...p.managerIds, manager._id]
                                                                    : p.managerIds.filter(id => id !== manager._id)
                                                            }));
                                                        }}>
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-[10px]">
                                                                    {manager.firstName[0]}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-xs font-bold text-foreground leading-tight">{manager.firstName} {manager.lastName}</span>
                                                                    <span className="text-[9px] font-black uppercase opacity-40 tracking-tighter">{manager.role_type}</span>
                                                                </div>
                                                            </div>
                                                            <Checkbox 
                                                                checked={queryParams.managerIds.includes(manager._id)}
                                                                onCheckedChange={() => {}} // Handled by parent div
                                                                className="h-4 w-4 rounded-md border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Visibility Mode</Label>
                                            <div className="grid grid-cols-1 gap-1.5">
                                                {[
                                                    { id: 'all', label: 'All Projects' },
                                                    { 
                                                        id: roleType === 'project_manager' ? 'own' : 'manager_created', 
                                                        label: roleType === 'project_manager' ? 'My Projects' : 'Manager Created'
                                                    },
                                                    { 
                                                        id: roleType === 'project_manager' ? 'assigned' : 'admin_assigned', 
                                                        label: roleType === 'project_manager' ? 'Assigned Records' : 'Admin Assigned'
                                                    }
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => setQueryParams(p => ({ ...p, filterType: opt.id, page: 1 }))}
                                                        className={cn(
                                                            "flex items-center h-10 px-4 rounded-xl border transition-all text-left relative overflow-hidden group",
                                                            queryParams.filterType === opt.id 
                                                                ? "bg-primary border-primary shadow-md shadow-primary/20" 
                                                                : "bg-background/20 border-border/40 hover:border-primary/40"
                                                        )}
                                                    >
                                                        <span className={cn(
                                                            "text-[11px] font-black uppercase tracking-tight relative z-10",
                                                            queryParams.filterType === opt.id ? "text-white" : "text-foreground"
                                                        )}>
                                                            {opt.label}
                                                        </span>
                                                        {queryParams.filterType === opt.id && (
                                                            <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <Separator className="bg-border/10" />
                                    
                                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest opacity-30 italic px-1">
                                        <span>Sync Active</span>
                                        <div className="h-1 w-1 rounded-full bg-emerald-500" />
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-primary/5">
                                <TableRow className="border-border/40 hover:bg-transparent">
                                    <TableHead className="pl-10 h-16">
                                        <button onClick={() => handleSort("name")} className="flex items-center gap-2 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                                            Project Name
                                            <ArrowUpDown className={cn("w-3 h-3 transition-colors", queryParams.sortField === 'name' ? 'text-primary' : 'text-primary/30')} />
                                        </button>
                                    </TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rooms & Materials</TableHead>
                                    <TableHead className="h-16">
                                        <button onClick={() => handleSort("totalBudget")} className="flex items-center gap-2 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            Project Budget
                                            <ArrowUpDown className={cn("w-3 h-3 transition-colors", queryParams.sortField === 'totalBudget' ? 'text-primary' : 'text-muted-foreground/30')} />
                                        </button>
                                    </TableHead>
                                    <TableHead className="h-16">
                                        <button onClick={() => handleSort("createdAt")} className="flex items-center gap-2 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            Creation Date
                                            <ArrowUpDown className={cn("w-3 h-3 transition-colors", queryParams.sortField === 'createdAt' ? 'text-primary' : 'text-muted-foreground/30')} />
                                        </button>
                                    </TableHead>
                                    <TableHead className="h-16 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        Created By
                                    </TableHead>
                                    {isAdmin && (
                                        <TableHead className="h-16 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            Assigned Management
                                        </TableHead>
                                    )}
                                    {!isClient && <TableHead className="text-right pr-10 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody className={cn("transition-opacity duration-200", loading && projects.length > 0 ? "opacity-50 pointer-events-none" : "opacity-100")}>
                                <AnimatePresence mode="wait">
                                    {loading && projects.length === 0 ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <TableRow key={i} className="animate-pulse border-border/20">
                                                <TableCell><div className="h-8 w-24 bg-muted/40 rounded-xl" /></TableCell>
                                                <TableCell><div className="h-8 w-24 bg-muted/40 rounded-xl" /></TableCell>
                                                <TableCell><div className="h-8 w-32 bg-muted/40 rounded-xl" /></TableCell>
                                                {isAdmin && <TableCell><div className="h-8 w-16 bg-muted/40 rounded-xl" /></TableCell>}
                                                {!isClient && <TableCell className="text-right pr-10"><div className="h-10 w-24 bg-muted/40 rounded-xl float-right" /></TableCell>}
                                            </TableRow>
                                        ))
                                    ) : projects.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={isClient ? 5 : (isAdmin ? 7 : 6)} className="py-32 text-center text-muted-foreground font-black italic uppercase tracking-[0.3em] text-xs opacity-50">
                                                No projects found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        projects.map((project, idx) => (
                                            <motion.tr 
                                                key={project._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group border-border/40 hover:bg-primary/[0.02] transition-all cursor-default"
                                            >
                                                <TableCell className="pl-10 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(var(--primary),0.5)] transition-all" />
                                                            <span 
                                                                className="text-lg font-black tracking-tighter text-foreground cursor-pointer hover:text-primary transition-all flex items-center gap-2 italic"
                                                                onClick={() => navigate(`/project-estimater/${project._id}`)}
                                                            >
                                                                {project.name}
                                                                <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 -translate-y-1" />
                                                            </span>
                                                        </div>

                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex flex-col">
                                                            <p className="text-sm font-black text-foreground italic tracking-tight">{project.rooms?.length || 0}</p>
                                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Dimensions</p>
                                                        </div>
                                                        <div className="h-8 w-px bg-border/40 rotate-12" />
                                                        <div className="flex flex-col">
                                                            <p className="text-sm font-black text-primary italic tracking-tight">{countMaterials(project.rooms)}</p>
                                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Linkages</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary shadow-lg">
                                                        <DollarSign className="w-3 h-3 opacity-60" />
                                                        <span className="text-sm font-black tracking-tighter italic">{Number(project.totalBudget).toLocaleString()}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-black text-foreground italic tracking-tight">
                                                            {project.createdAt ? moment(project.createdAt).format("MMM DD, YYYY") : "N/A"}
                                                        </p>
                                                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                                                            {project.createdAt ? moment(project.createdAt).format("HH:mm A") : ""}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-black text-foreground italic tracking-tight">
                                                            {project.createdBy?.firstName ? `${project.createdBy.firstName} ${project.createdBy.lastName || ""}` : "System Admin"}
                                                        </p>
                                                        <p className="text-[9px] font-black text-primary/60 uppercase tracking-widest">
                                                            {project.createdBy?.role_type?.replace('_', ' ') || "Administrator"}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                {isAdmin && (
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1 items-center max-w-[200px]">
                                                            {project.assignedTo && project.assignedTo.length > 0 ? (
                                                                project.assignedTo.map((man, idx) => {
                                                                    let name = "Unknown";
                                                                    let id = typeof man === "string" ? man : (man._id || idx);
                                                                    
                                                                    if (typeof man === "object" && man.firstName) {
                                                                        name = man.firstName;
                                                                    } else if (typeof man === "string" || typeof man === "object") {
                                                                        const lookupId = typeof man === "object" ? man._id : man;
                                                                        const found = availableManagers.find(m => m._id === lookupId);
                                                                        if (found) name = found.firstName;
                                                                    }
                                                                    
                                                                    return (
                                                                        <Badge 
                                                                            key={id} 
                                                                            variant="outline" 
                                                                            className="bg-primary/5 hover:bg-primary/10 transition-colors border-primary/20 text-primary text-[9px] font-black uppercase px-2 py-0"
                                                                        >
                                                                            {name}
                                                                        </Badge>
                                                                    );
                                                                })
                                                            ) : (
                                                                <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40 italic tracking-tighter">Direct Management</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                )}
                                                {!isClient && (
                                                    <TableCell className="text-right pr-10">
                                                        <div className="flex justify-end gap-2 transition-all">
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background border border-border/40 shadow-sm hover:border-primary/50 hover:text-primary transition-all" onClick={() => navigate(`/project-estimater/${project._id}`)}>
                                                                <Edit2 className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background border border-border/40 shadow-sm hover:border-destructive/50 hover:text-destructive transition-all" onClick={() => setDeleteId(project._id)}>
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                {totalDocs > queryParams.limit && (
                    <div className="px-8 py-6 border-t border-border/40 flex items-center justify-between bg-primary/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                {projects.length} of {totalDocs} Projects Online
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-10 px-5 text-[10px] font-black uppercase tracking-widest rounded-xl border-border/40 bg-background/50 hover:bg-primary hover:text-white transition-all shadow-sm" 
                                disabled={queryParams.page === 1} 
                                onClick={() => setQueryParams(p => ({ ...p, page: p.page - 1 }))}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" /> Prev
                            </Button>
                            <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-primary/20 italic">{queryParams.page}</div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-10 px-5 text-[10px] font-black uppercase tracking-widest rounded-xl border-border/40 bg-background/50 hover:bg-primary hover:text-white transition-all shadow-sm" 
                                disabled={projects.length < queryParams.limit} 
                                onClick={() => setQueryParams(p => ({ ...p, page: p.page + 1 }))}
                            >
                                Next <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="rounded-[2.5rem] border-border/40 shadow-2xl max-w-md p-10 bg-background/95 backdrop-blur-2xl">
                    <AlertDialogHeader className="items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                            <Trash2 className="w-10 h-10 text-destructive" />
                        </div>
                        <AlertDialogTitle className="text-3xl font-black tracking-tighter italic">Delete Project?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-black uppercase tracking-widest opacity-60 leading-relaxed">
                            This will permanently delete the project and all its data. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-10 gap-4 sm:flex-row sm:justify-center">
                        <AlertDialogCancel className="rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-[10px] border-border/40 hover:bg-muted/20">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-[10px] text-white shadow-2xl shadow-destructive/30 border-none transition-all active:scale-[0.98] italic">
                            {localLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Permanently"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
};

export default ProjectList;
