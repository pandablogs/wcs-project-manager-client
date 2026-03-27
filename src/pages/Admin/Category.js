import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Home,
  Percent,
  DollarSign,
  SearchIcon,
  Loader2,
  MoreVertical,
  ChevronRight,
  Calculator
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import materialService from "../../services/materialServices";
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

const Category = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localLoading, setLocalLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDocs, setTotalDocs] = useState(0);
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [formData, setFormData] = useState({ name: "", percentageType: false });

    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
        sortField: "name",
        sortOrder: -1,
        search: ""
    });

    useEffect(() => {
        fetchRooms();
    }, [queryParams]);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const res = await materialService.getMaterialRoom(queryParams);
            const data = res.data || {};
            setRoomTypes(data.rooms || []);
            setTotalPages(data.totalPages || 1);
            setTotalDocs(data.totalRecords || 0);
        } catch (err) {
            toast.error("Failed to fetch rooms");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setQueryParams(prev => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const handleEdit = (room) => {
        setSelectedRoom(room);
        setFormData({ name: room.name, percentageType: room.percentageType || false });
        setIsFormOpen(true);
    };

    const handleAddClick = () => {
        setSelectedRoom(null);
        setFormData({ name: "", percentageType: false });
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalLoading(true);
        try {
            if (selectedRoom) {
                await materialService.updateMaterialRoom(selectedRoom._id, formData);
                toast.success("Category updated successfully");
            } else {
                await materialService.addMaterialRoom(formData);
                toast.success("Category created successfully");
            }
            setIsFormOpen(false);
            fetchRooms();
        } catch (err) {
            toast.error("Failed to save category");
        } finally {
            setLocalLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setLocalLoading(true);
        try {
            await materialService.deleteMaterialRoom(deleteId);
            toast.success("Category removed successfully");
            setDeleteId(null);
            fetchRooms();
        } catch (err) {
            toast.error("Failed to delete category");
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 pb-12"
        >
            <PageHeader 
                title="Room Types" 
                description="Manage room types and how costs are calculated for each."
            >
                <Button onClick={handleAddClick} className="rounded-xl shadow-lg shadow-primary/20 h-11 px-8 bg-primary text-white hover:opacity-90 font-bold italic tracking-tight">
                    <Plus className="w-4 h-4 mr-2" />
                    NEW CATEGORY
                </Button>
            </PageHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Rooms" 
                    value={totalDocs} 
                    icon={Home} 
                    description="Stored room types"
                    delay={0.1}
                />
                <StatCard 
                    title="Calculations" 
                    value={roomTypes.filter(r => r.percentageType).length} 
                    icon={Calculator} 
                    description="Percentage-based rooms"
                    delay={0.2}
                />
            </div>

            <Card className="border-border/40 bg-card/30 backdrop-blur-md shadow-2xl overflow-hidden rounded-[2.5rem]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-10 px-10 pt-10">
                    <div className="space-y-1.5">
                        <CardTitle className="text-2xl font-black italic tracking-tighter">Room List</CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Manage room calculation types</CardDescription>
                    </div>
                    <div className="relative max-w-sm w-full">
                        <SearchIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                        <Input 
                            placeholder="Search rooms..." 
                            value={search}
                            onChange={handleSearchChange}
                            className="!pl-14 h-12 rounded-2xl bg-background/50 border-border/40 focus-visible:ring-primary/20 font-bold text-xs"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-primary/5">
                                <TableRow className="border-border/40 hover:bg-transparent">
                                    <TableHead className="pl-10 font-black text-[10px] uppercase tracking-[0.2em] text-primary/60">Room Name</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Calculation Type</TableHead>
                                    <TableHead className="text-right pr-10 font-black text-[10px] uppercase tracking-widest">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <TableRow key={i} className="animate-pulse border-border/20">
                                                <TableCell className="pl-10"><div className="h-4 w-32 bg-muted/40 rounded-full" /></TableCell>
                                                <TableCell><div className="h-4 w-24 bg-muted/40 rounded-full" /></TableCell>
                                                <TableCell className="text-right pr-10"><div className="h-8 w-24 bg-muted/40 rounded-lg float-right" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : roomTypes.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-32 text-muted-foreground font-black italic uppercase tracking-widest text-xs opacity-50">
                                                No rooms found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        roomTypes.map((room, idx) => (
                                            <motion.tr
                                                key={room._id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="group border-border/40 hover:bg-primary/[0.03] transition-all cursor-default"
                                            >
                                                <TableCell className="pl-10">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                            <Home className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-foreground tracking-tight">{room.name}</span>
                                                            <span className="text-[9px] text-primary font-black uppercase tracking-widest opacity-70 italic">Room Type</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {room.percentageType ? (
                                                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-black text-[9px] uppercase px-3 py-1 rounded-full tracking-wider italic">
                                                                <Percent className="w-3 h-3 mr-1.5 opacity-70" /> Percentage
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20 font-black text-[9px] uppercase px-3 py-1 rounded-full tracking-wider italic">
                                                                <DollarSign className="w-3 h-3 mr-1.5 opacity-70" /> Flat Price
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-10">
                                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background border border-border/40 shadow-sm hover:border-primary/50 hover:text-primary transition-all" onClick={() => navigate(`/material/${room._id}`)}>
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background border border-border/40 shadow-sm hover:border-primary/50 hover:text-primary transition-all" onClick={() => handleEdit(room)}>
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background border border-border/40 shadow-sm hover:border-destructive/50 hover:text-destructive transition-all" onClick={() => setDeleteId(room._id)}>
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
                            Page {queryParams.page} of {totalPages}
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
                            disabled={queryParams.page === totalPages} 
                            onClick={() => setQueryParams(p => ({ ...p, page: p.page + 1 }))}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-lg rounded-3xl p-0 overflow-hidden border-border/50 shadow-2xl">
                    <DialogHeader className="px-8 pt-8 pb-6 border-b border-border/50 bg-muted/20">
                        <DialogTitle className="text-2xl font-black tracking-tight">{selectedRoom ? "Edit Room Type" : "Add Room Type"}</DialogTitle>
                        <CardDescription>Edit the room name and how it calculates costs.</CardDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="p-8 pb-6 space-y-8">
                        <div className="space-y-2">
                            <Label htmlFor="name">Room Name</Label>
                            <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-xl h-12 bg-background/50 border-border/50 focus-visible:ring-primary/20" placeholder="e.g. Master Bedroom" />
                        </div>
                        
                        <div className="p-6 rounded-2xl border border-border/50 bg-muted/30 flex items-center justify-between group hover:border-primary/50 transition-all">
                            <div className="space-y-1">
                                <Label className="text-sm font-bold">Cost Type</Label>
                                <p className="text-xs text-muted-foreground font-medium">Calculate costs as a percentage instead of a flat price.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={formData.percentageType ? "text-[10px] font-bold text-primary uppercase" : "text-[10px] font-bold text-muted-foreground uppercase"}>
                                    {formData.percentageType ? "Percentage" : "Flat Price"}
                                </span>
                                <Switch 
                                    checked={formData.percentageType} 
                                    onCheckedChange={(c) => setFormData({...formData, percentageType: c})} 
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="rounded-xl font-bold h-11">Discard</Button>
                            <Button type="submit" disabled={localLoading} className="rounded-xl font-bold px-8 h-11 shadow-lg shadow-primary/20">
                                {localLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : (selectedRoom ? "Update Category" : "Save Category")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Alert */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="rounded-[2rem] border-border/50 shadow-2xl max-w-md p-8">
                    <AlertDialogHeader className="items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <Trash2 className="w-8 h-8 text-destructive" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight">Delete Room Type?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base font-medium">
                            This will permanently delete this room type. This may affect existing projects.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 gap-3 sm:flex-row sm:justify-center">
                        <AlertDialogCancel className="rounded-xl h-12 px-8 font-bold border-border/50">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 rounded-xl h-12 px-8 font-bold text-white shadow-lg shadow-destructive/20 border-none transition-all active:scale-[0.98]">
                            {localLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
};

export default Category;
