import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Layers, 
  Settings2,
  ChevronRight,
  Package,
  Home,
  Tag,
  Loader2,
  Info,
  LayoutGrid,
  SearchIcon,
  ChevronDown
} from "lucide-react";
import materialService from "../../services/materialServices";
import rehabGroupService from "../../services/rehabGroupServices";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { Label } from "../../components/ui/Label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/Dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/AlertDialog";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

const RehabGroups = () => {
  const [groups, setGroups] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [subMaterials, setSubMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", items: [] });
  
  const [addRoomId, setAddRoomId] = useState("");
  const [addMaterialId, setAddMaterialId] = useState("");
  const [addSubId, setAddSubId] = useState("");
  const [addQty, setAddQty] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchGroups();
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      const [rRes, mRes, sRes] = await Promise.all([
        materialService.getMaterialRoomAll(),
        materialService.getMaterialAll({}),
        materialService.getSubMaterialAll({}),
      ]);
      setRooms(rRes.data || []);
      setMaterials(mRes.data || []);
      setSubMaterials(sRes.data || []);
    } catch (err) {
      toast.error("Failed to load catalog data");
    }
  };

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await rehabGroupService.getAll();
      setGroups(res.data || []);
    } catch (err) {
      toast.error("Failed to load rehab groups");
    } finally {
      setLoading(false);
    }
  };

  const materialsInRoom = (roomId) => materials.filter((m) => m.roomId?._id === roomId);
  const subMaterialsInMaterial = (materialId) =>
    subMaterials.filter((s) => s.materialId?._id === materialId);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", description: "", items: [] });
    setAddRoomId("");
    setAddMaterialId("");
    setAddSubId("");
    setAddQty(1);
    setIsDialogOpen(true);
  };

  const openEdit = (group) => {
    setEditingId(group._id);
    setForm({
      name: group.name || "",
      description: group.description || "",
      items: (group.items || []).map((i) => ({
        roomId: i.roomId?._id || i.roomId,
        materialId: i.materialId?._id || i.materialId,
        subMaterialId: i.subMaterialId?._id || i.subMaterialId,
        defaultQuantity: i.defaultQuantity ?? 1,
      })),
    });
    setAddRoomId("");
    setAddMaterialId("");
    setAddSubId("");
    setAddQty(1);
    setIsDialogOpen(true);
  };

  const addItem = () => {
    if (!addRoomId || !addMaterialId || !addSubId) {
      toast.warning("Incomplete item specification");
      return;
    }
    const exists = form.items.some(
      (i) => i.subMaterialId === addSubId
    );
    if (exists) {
      toast.info("Item already registered in group");
      return;
    }
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          roomId: addRoomId,
          materialId: addMaterialId,
          subMaterialId: addSubId,
          defaultQuantity: addQty >= 0 ? addQty : 1,
        },
      ],
    }));
    setAddSubId("");
    setAddQty(1);
  };

  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const getItemData = (item) => {
    const room = rooms.find((r) => r._id === item.roomId);
    const mat = materials.find((m) => m._id === item.materialId);
    const sub = subMaterials.find((s) => s._id === item.subMaterialId);
    return { room, mat, sub };
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.warning("Group nomenclature required");
      return;
    }
    setLocalLoading(true);
    try {
      if (editingId) {
        await rehabGroupService.update(editingId, form);
        toast.success("Preset group updated");
      } else {
        await rehabGroupService.create(form);
        toast.success("Preset group established");
      }
      setIsDialogOpen(false);
      fetchGroups();
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLocalLoading(true);
    try {
      await rehabGroupService.delete(deleteId);
      toast.success("Group decommissioned");
      setDeleteId(null);
      fetchGroups();
    } catch (err) {
      toast.error("Failed to delete group");
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
        title="Assembly Presets" 
        description="Standardized material collections for rapid project inventory population."
      >
        <Button onClick={openCreate} className="rounded-xl shadow-lg shadow-primary/20 h-11 px-8 bg-primary text-white hover:opacity-90 font-bold italic tracking-tight">
            <Plus className="w-4 h-4 mr-2" />
            NEW ASSEMBLY
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Preset Assemblies" value={groups.length} icon={LayoutGrid} description="Operational nodes" delay={0.1} />
        <StatCard title="Catalog Depth" value={subMaterials.length} icon={Package} description="Master registry" delay={0.2} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence>
            {loading ? (
                Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="animate-pulse border-border/40 bg-card/30 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-10 space-y-4">
                            <div className="h-7 w-1/2 bg-muted/40 rounded-full" />
                            <div className="h-4 w-3/4 bg-muted/30 rounded-full" />
                        </CardHeader>
                        <CardContent className="p-10 pt-0">
                            <div className="h-32 bg-muted/20 rounded-[2rem] border border-border/20" />
                        </CardContent>
                    </Card>
                ))
            ) : groups.length === 0 ? (
                <div className="col-span-full py-32 text-center bg-card/30 backdrop-blur-md rounded-[3rem] border-4 border-dashed border-border/20">
                    <p className="text-muted-foreground font-black italic uppercase tracking-[0.3em] text-xs opacity-50">Zero Assemblies Registered in Data Core</p>
                </div>
            ) : (
                groups.map((group, idx) => (
                    <motion.div
                        key={group._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <Card className="group h-full border-border/40 bg-card/20 backdrop-blur-md hover:bg-card/40 hover:shadow-[0_32px_96px_-32px_rgba(var(--primary),0.2)] transition-all duration-500 rounded-[2.5rem] overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 z-10">
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background border border-border/40 shadow-sm hover:border-primary/50 hover:text-primary transition-all" onClick={() => openEdit(group)}>
                                    <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-background border border-border/40 shadow-sm hover:border-destructive/50 hover:text-destructive transition-all" onClick={() => setDeleteId(group._id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            
                            <CardHeader className="p-10 pb-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                        <CardTitle className="text-2xl font-black tracking-tighter text-foreground italic">{group.name}</CardTitle>
                                    </div>
                                    <CardDescription className="line-clamp-2 text-[10px] font-black uppercase tracking-widest opacity-60 leading-relaxed">{group.description || "NO EXECUTIVE SUMMARY PROVIDED"}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 pt-0">
                                <div className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-primary/[0.03] border border-primary/10 group-hover:border-primary/30 transition-all duration-500 shadow-inner">
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/20 shadow-xl group-hover:scale-110 transition-transform">
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h4 className="text-sm font-black text-foreground uppercase tracking-tight italic">{group.items?.length || 0} Synced Nodes</h4>
                                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-80">Verified Master Preset</p>
                                    </div>
                                </div>
                                
                                <div className="mt-8 space-y-4">
                                    {(group.items || []).slice(0, 3).map((item, i) => {
                                        const { sub } = getItemData(item);
                                        return (
                                            <div key={i} className="flex items-center gap-4 text-[11px] font-black text-muted-foreground uppercase tracking-tight px-2 group-hover:translate-x-1 transition-transform">
                                                <div className="h-px flex-1 bg-border/20" />
                                                <span className="truncate max-w-[70%]">{sub?.name || "System Spec"}</span>
                                                <div className="h-px flex-1 bg-border/20" />
                                            </div>
                                        );
                                    })}
                                    {group.items?.length > 3 && (
                                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] pt-2 text-center opacity-70 italic">
                                            + {group.items.length - 3} Encrypted Elements
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))
            )}
        </AnimatePresence>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-6xl rounded-[2.5rem] p-0 overflow-hidden border-border/50 shadow-2xl">
          <DialogHeader className="px-10 pt-10 pb-6 border-b border-border/50 bg-muted/20">
            <DialogTitle className="text-3xl font-black tracking-tight">{editingId ? "Refine Assembly" : "Establish New Assembly"}</DialogTitle>
            <CardDescription className="text-sm font-medium">Configure resource collection and default quantifications.</CardDescription>
          </DialogHeader>
          <div className="p-10 bg-background grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="gName">Group Nomenclature</Label>
                        <Input id="gName" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="rounded-xl h-12 bg-muted/20 border-border/50 focus-visible:ring-primary/20" placeholder="e.g. Standard Master Suite" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gDesc">Executive Summary</Label>
                        <Input id="gDesc" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="rounded-xl h-12 bg-muted/20 border-border/50 focus-visible:ring-primary/20" placeholder="Primary room renovation package..." />
                    </div>
                </div>

                <div className="p-8 rounded-[2rem] bg-muted/10 border border-border/50 space-y-6">
                    <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-primary" />
                        <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Resource Injection</h4>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Target Dimension</Label>
                            <Select value={addRoomId} onValueChange={(v) => { setAddRoomId(v); setAddMaterialId(""); setAddSubId(""); }}>
                                <SelectTrigger className="rounded-xl h-11 bg-background border-border/50">
                                    <SelectValue placeholder="Select room..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {rooms.map(r => <SelectItem key={r._id} value={r._id} className="text-xs font-bold uppercase">{r.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Classification Type</Label>
                            <Select value={addMaterialId} onValueChange={(v) => { setAddMaterialId(v); setAddSubId(""); }} disabled={!addRoomId}>
                                <SelectTrigger className="rounded-xl h-11 bg-background border-border/50">
                                    <SelectValue placeholder="Select material type..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {materialsInRoom(addRoomId).map(m => <SelectItem key={m._id} value={m._id} className="text-xs font-bold uppercase">{m.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Structural Spec</Label>
                            <Select value={addSubId} onValueChange={setAddSubId} disabled={!addMaterialId}>
                                <SelectTrigger className="rounded-xl h-11 bg-background border-border/50">
                                    <SelectValue placeholder="Select specific spec..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {subMaterialsInMaterial(addMaterialId).map(s => (
                                        <SelectItem key={s._id} value={s._id} className="text-xs font-bold uppercase">{s.name} (${s.price?.toFixed(2)})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <div className="w-24 space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Def Qty</Label>
                                <Input type="number" value={addQty} onChange={e => setAddQty(parseInt(e.target.value) || 1)} className="rounded-xl h-11 bg-background" />
                            </div>
                            <Button variant="secondary" className="flex-1 mt-6 rounded-xl h-11 font-bold uppercase text-[10px] tracking-widest border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10" onClick={addItem}>
                                <Plus className="w-4 h-4 mr-2" /> Add Component
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-7">
                <div className="h-full flex flex-col rounded-[2.5rem] bg-muted/5 border border-border/50 overflow-hidden">
                    <div className="px-8 py-4 bg-muted/30 border-b border-border/50 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Assembly Components ({form.items.length})</span>
                        <Settings2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[600px] p-4 space-y-3">
                        {form.items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-20">
                                <Package className="w-16 h-16 mb-6" />
                                <p className="text-sm font-black uppercase tracking-[0.2em]">Empty Assembly</p>
                            </div>
                        ) : (
                            form.items.map((item, idx) => {
                                const { room, mat, sub } = getItemData(item);
                                return (
                                    <motion.div 
                                        key={idx} 
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="group/item flex items-center justify-between p-5 bg-background rounded-2xl border border-border/50 hover:border-primary/30 transition-all shadow-sm"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground border border-border/50 group-hover/item:text-primary group-hover/item:bg-primary/5 transition-colors">
                                                <Tag className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{sub?.name || "System Spec"}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] font-black text-muted-foreground uppercase">{room?.name || "?"}</span>
                                                    <ChevronRight className="w-2.5 h-2.5 text-muted-foreground/30" />
                                                    <span className="text-[9px] font-black text-muted-foreground uppercase">{mat?.name || "?"}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Base Qty</p>
                                                <p className="text-xs font-black text-foreground">{item.defaultQuantity}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeItem(idx)} className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
          </div>
          <DialogFooter className="px-10 py-6 border-t border-border/50 bg-muted/20">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={localLoading} className="rounded-xl font-bold h-11">Discard</Button>
            <Button onClick={handleSave} disabled={localLoading} className="rounded-xl font-bold px-10 h-11 shadow-lg shadow-primary/20">
              {localLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Finalize Assembly"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-[2.5rem] border-border/50 shadow-2xl max-w-md p-10">
          <AlertDialogHeader className="items-center text-center">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
              <Trash2 className="w-10 h-10 text-destructive" />
            </div>
            <AlertDialogTitle className="text-3xl font-black tracking-tight">Revoke Preset?</AlertDialogTitle>
            <AlertDialogDescription className="text-base font-medium leading-relaxed">
              This will permanently decommission this assembly from the master configuration registry. This action is terminal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-10 gap-4 sm:flex-row sm:justify-center">
            <AlertDialogCancel className="rounded-xl h-12 px-10 font-bold border-border/50">Keep Preset</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 rounded-xl h-12 px-10 font-bold text-white shadow-lg shadow-destructive/20 border-none transition-all active:scale-[0.98]">
              {localLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Revoke Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default RehabGroups;
