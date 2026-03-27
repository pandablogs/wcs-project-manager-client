import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  PlusCircle,
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
  const routerLocation = useLocation();

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

  const filteredGroups = groups.filter(group => {
    const search = new URLSearchParams(routerLocation.search).get("search")?.toLowerCase();
    if (!search) return true;

    const nameMatch = group.name?.toLowerCase().includes(search);
    const descMatch = group.description?.toLowerCase().includes(search);
    const itemsMatch = (group.items || []).some(item => {
      const { sub } = getItemData(item);
      return sub?.name?.toLowerCase().includes(search);
    });

    return nameMatch || descMatch || itemsMatch;
  });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.warning("Group name required");
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
        title="Room Templates"
        description="Create sets of materials to quickly add them to your projects."
      >
        <Button onClick={openCreate} className="rounded-xl shadow-lg shadow-primary/20 h-11 px-8 bg-primary text-white hover:opacity-90 font-bold italic tracking-tight">
          <Plus className="w-4 h-4 mr-2" />
          ADD TEMPLATE
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Templates" value={groups.length} icon={LayoutGrid} description="Active templates" delay={0.1} />
        <StatCard title="Material Catalog" value={subMaterials.length} icon={Package} description="Available materials" delay={0.2} />
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
          ) : filteredGroups.length === 0 ? (
            <div className="col-span-full py-32 text-center bg-card/30 backdrop-blur-md rounded-[3rem] border-4 border-dashed border-border/20">
              <p className="text-muted-foreground font-black italic uppercase tracking-[0.3em] text-xs opacity-50">No Templates Found</p>
            </div>
          ) : (
            filteredGroups.map((group, idx) => (
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
                      <CardDescription className="line-clamp-2 text-[10px] font-black uppercase tracking-widest opacity-60 leading-relaxed">{group.description || "NO DESCRIPTION PROVIDED"}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 pt-0">
                    <div className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-primary/[0.03] border border-primary/10 group-hover:border-primary/30 transition-all duration-500 shadow-lg">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-xl group-hover:scale-110 transition-transform">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-sm font-black text-foreground uppercase tracking-tight italic">{group.items?.length || 0} Materials</h4>
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-80">Room Template</p>
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
                          + {group.items.length - 3} More Items
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
        <DialogContent className="sm:max-w-6xl rounded-[2.5rem] p-0 overflow-hidden border-border/50 shadow-2xl flex flex-col max-h-[92vh]">
          <DialogHeader className="px-10 pt-6 pb-4 border-b border-border/50 bg-primary/[0.03] relative">
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-2xl font-black italic tracking-tighter text-foreground uppercase">
                {editingId ? "Refine Template" : "Establish Template"}
              </DialogTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                Configure material sets for streamlined project injection
              </CardDescription>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-8 bg-background/50 backdrop-blur-xl custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Configuration Column */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4">
                  <div className="p-6 rounded-[2rem] bg-muted/20 border border-border/50 shadow-sm space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="gName" className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Template Identity</Label>
                      <Input
                        id="gName"
                        required
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        className="rounded-2xl h-12 bg-background border-border/50 focus-visible:ring-primary/20 font-bold text-sm shadow-inner"
                        placeholder="e.g. Premium Kitchen Finish"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="gDesc" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Strategic Description</Label>
                      <Input
                        id="gDesc"
                        value={form.description}
                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                        className="rounded-2xl h-12 bg-background border-border/50 focus-visible:ring-primary/20 font-medium text-sm shadow-inner"
                        placeholder="Detailed scope of the template..."
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-[2.5rem] bg-primary/[0.02] border border-primary/10 shadow-lg space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <PlusCircle className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground italic">Add Materials</h4>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Target Room Type</Label>
                      <Select value={addRoomId} onValueChange={(v) => { setAddRoomId(v); setAddMaterialId(""); setAddSubId(""); }}>
                        <SelectTrigger className="rounded-2xl h-11 bg-background border-border/50 shadow-sm focus:ring-primary/20">
                          <SelectValue placeholder="Select room category..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl">
                          {rooms.map(r => <SelectItem key={r._id} value={r._id} className="font-bold uppercase text-[10px] tracking-tight">{r.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Material Group</Label>
                      <Select value={addMaterialId} onValueChange={(v) => { setAddMaterialId(v); setAddSubId(""); }} disabled={!addRoomId}>
                        <SelectTrigger className="rounded-2xl h-11 bg-background border-border/50 shadow-sm focus:ring-primary/20">
                          <SelectValue placeholder="Choose material type..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl">
                          {materialsInRoom(addRoomId).map(m => <SelectItem key={m._id} value={m._id} className="font-bold uppercase text-[10px] tracking-tight">{m.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Specific Specification</Label>
                      <Select value={addSubId} onValueChange={setAddSubId} disabled={!addMaterialId}>
                        <SelectTrigger className="rounded-2xl h-11 bg-background border-border/50 shadow-sm focus:ring-primary/20">
                          <SelectValue placeholder="Identify specific item..." />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border/50 shadow-2xl">
                          {subMaterialsInMaterial(addMaterialId).map(s => (
                            <SelectItem key={s._id} value={s._id} className="font-bold uppercase text-[10px] tracking-tight">{s.name} (${s.price?.toFixed(2)})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <div className="w-24 space-y-1">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Qty</Label>
                        <Input type="number" value={addQty} onChange={e => setAddQty(parseInt(e.target.value) || 1)} className="rounded-2xl h-11 bg-background border-border/50 text-center font-black" />
                      </div>
                      <Button
                        variant="secondary"
                        className="flex-1 mt-5 rounded-2xl h-11 font-black uppercase text-xs tracking-widest border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-all active:scale-[0.98] shadow-sm shadow-primary/5"
                        onClick={addItem}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Inject to Set
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List Column */}
              <div className="lg:col-span-7 h-full">
                <div className="h-full flex flex-col rounded-[3rem] bg-muted/10 border border-border/50 overflow-hidden shadow-inner min-h-[450px]">
                  <div className="px-8 py-4 bg-muted/40 border-b border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Layers className="w-5 h-5 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground italic">Template Registry ({form.items.length})</span>
                    </div>
                    <Settings2 className="w-4 h-4 text-muted-foreground opacity-40 hover:opacity-100 transition-opacity cursor-pointer" />
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                    {form.items.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-40">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 animate-pulse">
                          <Package className="w-8 h-8" />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground italic">No materials assigned</h4>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1 tracking-widest max-w-[180px] leading-relaxed">Build your template specification using the controls on the left.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {form.items.map((item, idx) => {
                          const { room, mat, sub } = getItemData(item);
                          return (
                            <motion.div
                              key={idx}
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              className="group/item flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-border/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                            >
                              <div className="flex items-center gap-4">
                                <div className="h-11 w-11 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground border border-border/50 group-hover/item:text-primary group-hover/item:bg-primary/5 group-hover/item:border-primary/20 transition-all duration-300">
                                  <Home className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-foreground uppercase tracking-tight italic">{sub?.name || "System Spec"}</p>
                                  <div className="flex items-center gap-2 mt-1 overflow-hidden">
                                    <span className="text-[8px] font-black text-primary uppercase tracking-widest bg-primary/5 px-1.5 py-0.5 rounded-md border border-primary/10">{room?.name || "?"}</span>
                                    <ChevronRight className="w-2.5 h-2.5 text-muted-foreground/30 flex-shrink-0" />
                                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest truncate">{mat?.name || "?"}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-8">
                                <div className="text-right">
                                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60">Qty</p>
                                  <p className="text-base font-black text-foreground italic">{item.defaultQuantity}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItem(idx)}
                                  className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground/40 hover:opacity-100 transition-all shadow-none"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="px-10 py-4 border-t border-border/50 bg-muted/10">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={localLoading} className="rounded-2xl font-black uppercase tracking-widest text-xs h-12 px-6 hover:bg-muted/30">Discard Changes</Button>
            <Button onClick={handleSave} disabled={localLoading} className="rounded-2xl font-black uppercase tracking-widest text-xs h-12 px-10 shadow-2xl shadow-primary/20 bg-primary text-white hover:opacity-90 active:scale-[0.98] transition-all">
              {localLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : (editingId ? "Update Registry" : "Commit Template")}
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
            <AlertDialogTitle className="text-3xl font-black tracking-tight">Delete Template?</AlertDialogTitle>
            <AlertDialogDescription className="text-base font-medium leading-relaxed">
              This will permanently delete this template. This action cannot be undone.
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

export default RehabGroups;
