import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoveLeft,
  Package,
  Layers,
  ArrowUpDown,
  DollarSign,
  Percent,
  Truck,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ClipboardList
} from "lucide-react";
import materialService from "../../services/materialServices";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/Dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/AlertDialog";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { Label } from "../../components/ui/Label";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

const SubMaterialDetails = () => {
    const { matId, id } = useParams();
    const navigate = useNavigate();
    const [subMaterialTypes, setsubMaterialTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localLoading, setLocalLoading] = useState(false);
    const [totalDocs, setTotalDocs] = useState(0);
    const [deleteId, setDeleteId] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: "", price: "", supplier: "" });
    
    const [selectedRoom, setSelectedRoom] = useState({});
    const [selectedMaterial, setSelectedMaterial] = useState({});

    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
        sortField: "",
        sortOrder: 0,
        search: "",
        roomId: id,
        materialId: matId,
    });

    useEffect(() => {
        fetchSubMaterial();
        fetchRoomById(id);
        fetchMaterialById(matId);
    }, [queryParams, id, matId]);

    const fetchSubMaterial = async () => {
        setLoading(true);
        try {
            const res = await materialService.getSubMaterial(queryParams);
            const data = res.data || {};
            setsubMaterialTypes(data?.subMaterials || []);
            setTotalDocs(data.totalRecords || 0);
        } catch (err) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const fetchRoomById = async (roomId) => {
        try {
            const res = await materialService.getMaterialRoomById(roomId);
            setSelectedRoom(res.data || {});
        } catch (err) {
            console.error("Failed to fetch Room Data");
        }
    };

    const fetchMaterialById = async (materialId) => {
        try {
            const res = await materialService.getMaterialById(materialId);
            setSelectedMaterial(res.data || {});
        } catch (err) {
            console.error("Failed to fetch Material Data");
        }
    };

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

    const handleDelete = async () => {
        if (!deleteId) return;
        setLocalLoading(true);
        try {
            await materialService.deleteSubMaterial(deleteId);
            toast.success("Item decommissioned successfully");
            fetchSubMaterial();
        } catch (err) {
            toast.error("Failed to delete item");
        } finally {
            setLocalLoading(false);
            setDeleteId(null);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLocalLoading(true);
        try {
            const payload = { ...form, roomId: id, materialId: matId };
            if (editingId) {
                await materialService.updateSubMaterial(editingId, form);
                toast.success("Item configuration updated");
            } else {
                await materialService.addSubMaterial(payload);
                toast.success("New item registered");
            }
            fetchSubMaterial();
            setIsDialogOpen(false);
        } catch (err) {
            toast.error("Data commitment failed");
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
            <div className="flex flex-wrap items-center gap-3">
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => navigate(`/material/${id}`)}
                    className="h-10 w-10 rounded-xl border-border/40 bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                    <MoveLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-3 px-4 h-10 rounded-xl border border-border/40 bg-background/30 backdrop-blur-md">
                    <Badge variant="secondary" className="px-2 py-0.5 font-black text-[9px] uppercase tracking-widest bg-primary/10 text-primary border-primary/20 italic">
                        {selectedRoom?.name || '...'}
                    </Badge>
                    <span className="text-muted-foreground/20 font-black">/</span>
                    <Badge variant="secondary" className="px-2 py-0.5 font-black text-[9px] uppercase tracking-widest border-primary/40 bg-primary text-white italic">
                        {selectedMaterial?.name || '...'}
                    </Badge>
                </div>
            </div>

            <PageHeader 
                title="Items" 
                description="Manage specific items, pricing, and suppliers for this material."
            >
                <div className="flex gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-4 h-4" />
                        <Input 
                            placeholder="Search items..." 
                            value={queryParams.search}
                            onChange={(e) => setQueryParams(p => ({ ...p, search: e.target.value, page: 1 }))}
                            className="!pl-14 h-11 rounded-2xl bg-card/30 border-border/40 focus-visible:ring-primary/20 font-bold text-xs"
                        />
                    </div>
                    <Button onClick={() => { setEditingId(null); setForm({ name: "", price: "", supplier: "" }); setIsDialogOpen(true); }} className="rounded-xl shadow-lg shadow-primary/20 h-11 px-8 bg-primary text-white hover:opacity-90 font-bold italic tracking-tight">
                        <Plus className="w-4 h-4 mr-2" />
                        ADD ITEM
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Items" value={totalDocs} icon={ClipboardList} description="Total specifications" delay={0.1} trend={null} />
                <StatCard title="Pricing Type" value={selectedRoom?.percentageType ? "Percentage %" : "Fixed Price $"} icon={DollarSign} description="How costs are calculated" delay={0.2} trend={null} />
            </div>

            <Card className="border-border/40 bg-card/30 backdrop-blur-md shadow-2xl overflow-hidden rounded-[2.5rem]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-10 px-10 pt-10">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg">
                            <Layers className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black italic tracking-tighter">Item List</CardTitle>
                            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Detailed pricing and supplier information</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto px-2">
                        <Table>
                            <TableHeader className="bg-primary/5">
                                <TableRow className="border-border/40 hover:bg-transparent">
                                    <TableHead className="px-10 h-14">
                                        <button onClick={() => handleSort("name")} className="flex items-center gap-3 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic">
                                            Item Name
                                            <ArrowUpDown className={cn("w-3 h-3 transition-colors", queryParams.sortField === 'name' ? 'text-primary' : 'text-muted-foreground/20')} />
                                        </button>
                                    </TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic">Supplier</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic">Price/Rate</TableHead>
                                    <TableHead className="text-right pr-10 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <TableRow key={i} className="animate-pulse border-border/50">
                                                <TableCell className="px-8 py-4"><div className="h-4 w-64 bg-muted rounded" /></TableCell>
                                                <TableCell className="py-4"><div className="h-4 w-32 bg-muted rounded" /></TableCell>
                                                <TableCell className="py-4"><div className="h-4 w-16 bg-muted rounded" /></TableCell>
                                                <TableCell className="text-right pr-8 py-4"><div className="h-8 w-24 bg-muted rounded float-right" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : subMaterialTypes.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-20 text-center text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">
                                                No items found for this material.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        subMaterialTypes.map((data, idx) => (
                                            <TableRow key={data._id} className="group border-border/50 hover:bg-muted/10 transition-colors">
                                                <TableCell className="px-8 py-4 text-sm">
                                                    <span className="font-bold text-foreground transition-colors group-hover:text-primary">{data.name || '-'}</span>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-2 text-muted-foreground font-bold text-[10px] uppercase tracking-wide">
                                                        <Truck className="w-3.5 h-3.5 opacity-40" />
                                                        {data.supplier || 'N/A'}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary">
                                                        {selectedRoom?.percentageType ? <Percent className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                                                        <span className="text-xs font-black tracking-tight">{data.price || '0.00'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-8 py-4">
                                                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background" onClick={() => { setEditingId(data._id); setForm({ name: data.name, price: data.price, supplier: data.supplier || "" }); setIsDialogOpen(true); }}>
                                                            <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive" onClick={() => setDeleteId(data._id)}>
                                                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <div className="px-8 py-5 border-t border-border/50 flex items-center justify-between bg-muted/20">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {totalDocs} Items
                    </span>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 rounded-lg border-border/50 text-[10px] font-black uppercase tracking-widest" disabled={queryParams.page === 1} onClick={() => setQueryParams(p => ({ ...p, page: p.page - 1 }))}>
                            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                        </Button>
                        <div className="h-8 px-4 rounded-lg bg-background border border-border/50 flex items-center justify-center text-[10px] font-black text-primary">{queryParams.page}</div>
                        <Button variant="outline" size="sm" className="h-8 rounded-lg border-border/50 text-[10px] font-black uppercase tracking-widest" disabled={subMaterialTypes.length < queryParams.limit} onClick={() => setQueryParams(p => ({ ...p, page: p.page + 1 }))}>
                            Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-xl rounded-[2rem] p-0 overflow-hidden border-border/50 shadow-2xl">
                    <DialogHeader className="px-10 pt-10 pb-6 border-b border-border/50 bg-muted/20">
                        <DialogTitle className="text-3xl font-black tracking-tight">{editingId ? "Edit Item" : "Add New Item"}</DialogTitle>
                        <CardDescription className="text-sm">Edit name, price, and supplier.</CardDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="p-10 pb-6 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="iName">Item Name</Label>
                                <Input id="iName" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="rounded-xl h-12 bg-muted/20 border-border/50 focus-visible:ring-primary/20" placeholder="e.g. Premium White Oak" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="iPrice">{selectedRoom?.percentageType ? "Percentage %" : "Price $"}</Label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">
                                            {selectedRoom?.percentageType ? "%" : "$"}
                                        </div>
                                        <Input id="iPrice" type="number" step="0.01" required value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className="!pl-10 rounded-xl h-12 bg-muted/20 border-border/50 focus-visible:ring-primary/20" placeholder="0.00" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="iSupplier">Primary Supplier</Label>
                                    <Input id="iSupplier" value={form.supplier} onChange={e => setForm(p => ({ ...p, supplier: e.target.value }))} className="rounded-xl h-12 bg-muted/20 border-border/50 focus-visible:ring-primary/20" placeholder="e.g. Global Resources" />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="pt-6 border-t border-border/50">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl font-bold h-11">Discard</Button>
                            <Button type="submit" disabled={localLoading} className="rounded-xl font-bold px-10 h-11 shadow-lg shadow-primary/20">
                                {localLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Item"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="rounded-[2.5rem] border-border/50 shadow-2xl max-w-md p-10">
                    <AlertDialogHeader className="items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                            <Trash2 className="w-10 h-10 text-destructive" />
                        </div>
                        <AlertDialogTitle className="text-3xl font-black tracking-tight">Delete Item?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base font-medium leading-relaxed">
                            This will permanently delete this item. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-10 gap-4 sm:flex-row sm:justify-center">
                        <AlertDialogCancel className="rounded-xl h-12 px-10 font-bold border-border/50">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 rounded-xl h-12 px-10 font-bold text-white shadow-lg shadow-destructive/20 border-none transition-all active:scale-[0.98]">
                            {localLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Permanently"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </motion.div>
    );
};

export default SubMaterialDetails;