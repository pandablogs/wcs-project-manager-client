import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchProjectManager, 
  deleteProjectManager, 
  updateProjectManager, 
  addProjectManager 
} from "../../redux/slices/projectManagerSlice";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  Users, 
  Shield, 
  SearchIcon,
  Loader2,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/Dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/AlertDialog";
import { Label } from "../../components/ui/Label";
import { Switch } from "../../components/ui/Switch";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { motion, AnimatePresence } from "framer-motion";

const ProjectManagerList = () => {
    const dispatch = useDispatch();
    const { project_managerList, loading } = useSelector((state) => state.project_manager);

    const [search, setSearch] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [selectedManager, setSelectedManager] = useState(null);
    const [localLoading, setLocalLoading] = useState(false);

    const [formData, setFormData] = useState({ 
      firstName: "", 
      lastName: "", 
      phone: "", 
      email: "", 
      password: "", 
      confirmPassword: "",
      status: "Active"
    });

    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
        sortField: "firstName",
        sortOrder: -1,
        search: ""
    });

    useEffect(() => {
        dispatch(fetchProjectManager(queryParams));
    }, [dispatch, queryParams]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setQueryParams(prev => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handleEdit = (manager) => {
        setSelectedManager(manager);
        setFormData({ 
          firstName: manager.firstName, 
          lastName: manager.lastName, 
          phone: manager.phone, 
          email: manager.email,
          password: "",
          confirmPassword: "",
          status: "Active" // Simplified for now
        });
        setIsAddOpen(true);
    };

    const handleAddClick = () => {
        setSelectedManager(null);
        setFormData({ firstName: "", lastName: "", phone: "", email: "", password: "", confirmPassword: "", status: "Active" });
        setIsAddOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedManager && (formData.password !== formData.confirmPassword)) {
            toast.error("Passwords do not match!");
            return;
        }

        setLocalLoading(true);
        try {
          if (!selectedManager) {
              const payload = {
                  role_type: "project_manager",
                  ...formData
              };
              await dispatch(addProjectManager(payload));
              toast.success("Manager added successfully!");
          } else {
              await dispatch(updateProjectManager({ 
                id: selectedManager._id, 
                projectManagerData: formData 
              }));
              toast.success("Manager details updated!");
          }
          setIsAddOpen(false);
        } catch (err) {
          toast.error("Operation failed.");
        } finally {
          setLocalLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setLocalLoading(true);
        try {
          await dispatch(deleteProjectManager(deleteId));
          toast.success("Manager removed successfully!");
          setDeleteId(null);
        } catch (err) {
          toast.error("Failed to delete manager.");
        } finally {
          setLocalLoading(false);
        }
    };

    const activeCount = project_managerList.length; // Placeholder for real active count if needed

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 pb-12"
        >
            <PageHeader 
                title="Managers" 
                description="Manage your team of project managers and staff."
            >
                <Button onClick={handleAddClick} className="rounded-xl shadow-lg shadow-primary/20 h-10 px-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Manager
                </Button>
            </PageHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Staff" 
                    value={project_managerList.length} 
                    icon={Users} 
                    description="Active authenticated users"
                    delay={0.1}
                />
                <StatCard 
                    title="Administrators" 
                    value={1} // Placeholder
                    icon={Shield} 
                    description="Level 1 access"
                    delay={0.2}
                />
            </div>

            <Card className="border-border/40 bg-card/30 backdrop-blur-md shadow-2xl overflow-hidden rounded-[2rem]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 px-10 pt-10">
                    <div className="space-y-1.5">
                        <CardTitle className="text-2xl font-black italic tracking-tighter">Managers</CardTitle>
                        <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Manage staff access</CardDescription>
                    </div>
                    <div className="relative max-w-sm w-full">
                        <SearchIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                        <Input 
                            placeholder="Search managers..." 
                            value={search}
                            onChange={handleSearchChange}
                            className="!pl-14 h-12 rounded-2xl bg-background/40 border-border/40 focus-visible:ring-primary/20 font-bold"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-primary/5">
                                <TableRow className="border-border/40 hover:bg-transparent">
                                    <TableHead className="w-[80px] text-[10px] font-black uppercase tracking-[0.2em] pl-10 text-primary/60">ID</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Name</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Contact</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                                    <TableHead className="text-right pr-10 font-black text-[10px] uppercase tracking-widest">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <TableRow key={i} className="animate-pulse border-border/20">
                                                <TableCell className="pl-10"><div className="h-4 w-8 bg-muted/40 rounded-full" /></TableCell>
                                                <TableCell><div className="h-4 w-32 bg-muted/40 rounded-full" /></TableCell>
                                                <TableCell><div className="h-4 w-48 bg-muted/40 rounded-full" /></TableCell>
                                                <TableCell><div className="h-4 w-16 bg-muted/40 rounded-full" /></TableCell>
                                                <TableCell className="text-right pr-10"><div className="h-8 w-8 bg-muted/40 rounded-lg float-right" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : project_managerList.length === 0 ? (
                                        <TableRow>
                                                <TableCell colSpan={5} className="text-center py-32 text-muted-foreground font-black italic uppercase tracking-widest text-xs opacity-50">
                                                    No managers found
                                                </TableCell>
                                        </TableRow>
                                    ) : (
                                        project_managerList.map((manager, idx) => (
                                            <motion.tr
                                                key={manager._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="group border-border/40 hover:bg-primary/[0.03] transition-all cursor-default"
                                            >
                                                <TableCell className="pl-10 text-[10px] font-black text-muted-foreground/40 tabular-nums">
                                                    {((queryParams.page - 1) * queryParams.limit + idx + 1).toString().padStart(2, '0')}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary font-black text-sm border border-primary/20 shadow-lg group-hover:scale-110 transition-all duration-500">
                                                            {manager.firstName[0].toUpperCase()}{manager.lastName[0].toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-foreground tracking-tight">{manager.firstName} {manager.lastName}</span>
                                                            <span className="text-[9px] text-primary font-black uppercase tracking-widest opacity-70 italic">Verified Staff</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1.5 font-bold tracking-tight">
                                                        <span className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground transition-colors"><Mail className="w-3.5 h-3.5 text-primary/60" /> {manager.email}</span>
                                                        <span className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground transition-colors"><Phone className="w-3.5 h-3.5 text-blue-500/60" /> {manager.phone}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-black text-[9px] uppercase px-3 py-1 rounded-full tracking-wider italic">
                                                        Authorized
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-10">
                                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background border border-border/40 shadow-sm hover:border-primary/50 hover:text-primary transition-all" onClick={() => handleEdit(manager)}>
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background border border-border/40 shadow-sm hover:border-destructive/50 hover:text-destructive transition-all" onClick={() => setDeleteId(manager._id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <div className="px-10 py-6 border-t border-border/40 flex items-center justify-between bg-primary/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                            Total: {project_managerList.length} managers
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-10 px-5 text-[10px] font-black uppercase tracking-widest rounded-xl border-border/40 bg-background/50 hover:bg-primary hover:text-white transition-all shadow-sm disabled:opacity-30" 
                            disabled={queryParams.page === 1} 
                            onClick={() => setQueryParams(p => ({ ...p, page: p.page - 1 }))}
                        >
                            Prev
                        </Button>
                        <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-primary/20 italic">{queryParams.page}</div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-10 px-5 text-[10px] font-black uppercase tracking-widest rounded-xl border-border/40 bg-background/50 hover:bg-primary hover:text-white transition-all shadow-sm disabled:opacity-30" 
                            disabled={project_managerList.length < queryParams.limit} 
                            onClick={() => setQueryParams(p => ({ ...p, page: p.page + 1 }))}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Add/Edit Modal */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden border-border/50 shadow-2xl">
                    <DialogHeader className="px-8 pt-8 pb-6 border-b border-border/50 bg-muted/20">
                        <DialogTitle className="text-2xl font-black tracking-tight">{selectedManager ? "Edit Manager" : "Add New Manager"}</DialogTitle>
                        <CardDescription>Manage project manager accounts.</CardDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="p-8 pb-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="rounded-xl h-11 bg-background/50 border-border/50 focus-visible:ring-primary/20" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="rounded-xl h-11 bg-background/50 border-border/50 focus-visible:ring-primary/20" placeholder="Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Work Email</Label>
                                <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="rounded-xl h-11 bg-background/50 border-border/50 focus-visible:ring-primary/20" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="rounded-xl h-11 bg-background/50 border-border/50 focus-visible:ring-primary/20" placeholder="(555) 000-0000" />
                            </div>
                            {!selectedManager && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Set Password</Label>
                                        <Input id="password" type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="rounded-xl h-11 bg-background/50 border-border/50 focus-visible:ring-primary/20" placeholder="••••••••" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input id="confirmPassword" type="password" required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="rounded-xl h-11 bg-background/50 border-border/50 focus-visible:ring-primary/20" placeholder="••••••••" />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <div className="space-y-0.5">
                                <Label>Account Status</Label>
                                <p className="text-xs text-muted-foreground font-medium">Toggle system access for this manager.</p>
                            </div>
                            <Switch 
                                checked={formData.status === "Active"} 
                                onCheckedChange={(c) => setFormData({...formData, status: c ? "Active" : "Inactive"})} 
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold h-11">Discard</Button>
                            <Button type="submit" disabled={localLoading} className="rounded-xl font-bold px-8 h-11 shadow-lg shadow-primary/20">
                                {localLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : (selectedManager ? "Save Changes" : "Register Manager")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="rounded-[2rem] border-border/50 shadow-2xl max-w-md p-8">
                    <AlertDialogHeader className="items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <Trash2 className="w-8 h-8 text-destructive" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight">Revoke Access?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base font-medium">
                            This will permanently remove the manager's system access. This action is irreversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-3 sm:flex-row sm:justify-center">
                        <AlertDialogCancel className="rounded-xl h-12 px-8 font-bold border-border/50">Keep Account</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 rounded-xl h-12 px-8 font-bold text-white shadow-lg shadow-destructive/20 border-none transition-all active:scale-[0.98]">
                            {localLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Revoke Permanently"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
};

export default ProjectManagerList;