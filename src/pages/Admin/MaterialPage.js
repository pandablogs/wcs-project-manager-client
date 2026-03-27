import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import materialService from "../../services/materialServices";
import {
  Plus,
  Settings,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Home,
  Layers,
  Package,
  PlusCircle,
  Search,
  Percent,
  DollarSign,
  Loader2,
  Filter,
  MoreVertical,
  ChevronRight,
  Database,
  ArrowRight
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
import { cn } from "../../lib/utils";

const MaterialPage = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [subMaterials, setSubMaterials] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  const [materialForm, setMaterialForm] = useState({ name: "" });
  const [subMaterialForm, setSubMaterialForm] = useState({
    name: "",
    price: "",
    supplier: "",
    materialId: null,
  });

  const [editMode, setEditMode] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
  const [isSubMaterialDialogOpen, setIsSubMaterialDialogOpen] = useState(false);
  const [isRoomConfigOpen, setIsRoomConfigOpen] = useState(false);
  const [isRoomFormOpen, setIsRoomFormOpen] = useState(false);

  const [roomFormData, setRoomFormData] = useState({ name: "", percentageType: false });
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const location = useLocation();

  // Parse search query from URL
  const getSearchFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || "";
  };

  const [materialSearch, setMaterialSearch] = useState(getSearchFromUrl());
  const [materialPage, setMaterialPage] = useState(1);
  const [materialLimit, setMaterialLimit] = useState(10);

  const [deleteTarget, setDeleteTarget] = useState(null);

  // Update search when URL changes
  useEffect(() => {
    const urlSearch = getSearchFromUrl();
    if (urlSearch !== materialSearch) {
      setMaterialSearch(urlSearch);
      setMaterialPage(1);
    }
  }, [location.search]);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMaterials();
      fetchSubMaterials();
      setMaterialPage(1);
    }
  }, [selectedRoom]);

  const toggleExpand = (materialId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [materialId]: !prev[materialId],
    }));
  };

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await materialService.getMaterialRoomAll();
      const rooms = response.data || [];
      const fixedRooms = rooms.map(r => ({
        ...r,
        name: (r.name || "").toUpperCase() === "LEAVING ROOM" ? "LIVING ROOM" : r.name
      }));
      setRoomTypes(fixedRooms);
      // Removed default selection as requested by user
      // if (fixedRooms.length > 0 && !selectedRoom) {
      //   setSelectedRoom(fixedRooms[0]);
      // }
    } catch (err) {
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    if (!selectedRoom?._id) return;
    setLoading(true);
    try {
      const response = await materialService.getMaterialAll({ roomId: selectedRoom._id });
      setMaterials(response.data || []);
    } catch (err) {
      toast.error("Failed to fetch materials");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubMaterials = async () => {
    if (!selectedRoom?._id) return;
    try {
      const response = await materialService.getSubMaterialAll({ roomId: selectedRoom._id });
      setSubMaterials(response.data || []);
    } catch (err) {
      toast.error("Failed to fetch sub-materials");
    }
  };

  const filteredMaterials = useMemo(() => {
    return materials.filter(m =>
      (m.name || "").toLowerCase().includes(materialSearch.toLowerCase())
    ).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [materials, materialSearch]);

  const paginatedMaterials = useMemo(() => {
    const start = (materialPage - 1) * materialLimit;
    return filteredMaterials.slice(start, start + materialLimit);
  }, [filteredMaterials, materialPage, materialLimit]);

  const getSubMaterialsForMaterial = (materialId) => {
    return subMaterials.filter(s => s.materialId?._id === materialId);
  };

  const handleOpenMaterialForm = (item = null) => {
    setEditMode(!!item);
    setMaterialForm(item ? { ...item } : { name: "" });
    setIsMaterialDialogOpen(true);
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      if (editMode) {
        await materialService.updateMaterial(materialForm._id, materialForm);
        toast.success("Material updated");
      } else {
        await materialService.addMaterial({ ...materialForm, roomId: selectedRoom._id });
        toast.success("Material added");
      }
      fetchMaterials();
      setIsMaterialDialogOpen(false);
    } catch (err) {
      toast.error("Failed to save material");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleOpenSubMaterialForm = (materialId, item = null) => {
    setEditMode(!!item);
    setSubMaterialForm(item ? { ...item } : { name: "", price: "", supplier: "", materialId });
    setIsSubMaterialDialogOpen(true);
  };

  const handleSaveSubMaterial = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      const payload = { ...subMaterialForm, roomId: selectedRoom._id };
      if (editMode) {
        await materialService.updateSubMaterial(subMaterialForm._id, payload);
        toast.success("Sub-material updated");
      } else {
        await materialService.addSubMaterial(payload);
        toast.success("Sub-material added");
      }
      fetchSubMaterials();
      setIsSubMaterialDialogOpen(false);
    } catch (err) {
      toast.error("Failed to save sub-material");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleRoomAction = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      if (editingRoomId) {
        const res = await materialService.updateMaterialRoom(editingRoomId, roomFormData);
        toast.success("Room updated");
        if (res.data) setSelectedRoom(res.data);
      } else {
        const res = await materialService.addMaterialRoom(roomFormData);
        toast.success("Room added");
        if (res.data) setSelectedRoom(res.data);
      }
      fetchRooms();
      setIsRoomFormOpen(false);
    } catch (err) {
      toast.error("Room operation failed");
    } finally {
      setLocalLoading(false);
    }
  };

  const performDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    setLocalLoading(true);
    try {
      if (type === "material") await materialService.deleteMaterial(id);
      else if (type === "subMaterial") await materialService.deleteSubMaterial(id);
      else if (type === "room") await materialService.deleteMaterialRoom(id);

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} removed`);
      if (type === "room") fetchRooms();
      else if (type === "material") fetchMaterials();
      else fetchSubMaterials();
      setDeleteTarget(null);
    } catch (err) {
      toast.error("Deletion failed");
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
        title="Materials"
        description="Manage all materials and items used in your projects."
      >
        <div className="flex gap-3">
          <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-border/40 bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-white transition-all shadow-sm" onClick={() => setIsRoomConfigOpen(true)}>
            <Settings className="w-4 h-4" />
          </Button>
          <Button onClick={() => handleOpenMaterialForm()} className="rounded-xl shadow-lg shadow-primary/20 h-10 px-6 bg-primary text-white hover:opacity-90 font-bold italic tracking-tight">
            <PlusCircle className="w-4 h-4 mr-2" />
            ADD MATERIAL
          </Button>
        </div>
      </PageHeader>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 px-6 no-scrollbar">
        {roomTypes.map(room => (
          <button
            key={room._id}
            onClick={() => setSelectedRoom(room)}
            className={cn(
              "whitespace-nowrap px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border shadow-sm italic",
              selectedRoom?._id === room._id
                ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105 active:scale-95"
                : "bg-card/30 backdrop-blur-md border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary"
            )}
          >
            {room.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <StatCard
          title="Categories"
          value={materials.length}
          icon={Layers}
          description={`${selectedRoom?.name || 'Active Room'}`}
          delay={0.1}
        />
        <StatCard
          title="Total Items"
          value={subMaterials.length}
          icon={Package}
          description="Available items and finishes"
          delay={0.2}
        />
        <StatCard
          title="Pricing Type"
          value={selectedRoom?.percentageType ? "Percentage" : "Fixed Price"}
          icon={Database}
          description="How costs are calculated"
          delay={0.3}
          trend={null}
        />
      </div>

      <Card className="border-border/40 bg-card/30 backdrop-blur-md shadow-2xl overflow-hidden rounded-[2.5rem]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-10 px-10 pt-10">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black italic tracking-tighter">Materials</CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Manage material categories and specific items</CardDescription>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
            <Input
              placeholder="Search materials..."
              value={materialSearch}
              onChange={(e) => setMaterialSearch(e.target.value)}
              className="!pl-14 h-12 rounded-2xl bg-background/50 border-border/40 focus-visible:ring-primary/20 font-bold text-xs"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-border/50">
                  <TableHead className="w-[60px]"></TableHead>
                  <TableHead className="font-bold text-sm">Material Category</TableHead>
                  <TableHead className="font-bold text-sm">Items</TableHead>
                  <TableHead className="text-right pr-6 font-bold text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="wait">
                  {loading && materials.length === 0 ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i} className="animate-pulse">
                        <TableCell className="w-[60px]"><div className="h-6 w-6 bg-muted rounded mx-auto" /></TableCell>
                        <TableCell><div className="h-4 w-48 bg-muted rounded" /></TableCell>
                        <TableCell><div className="h-4 w-24 bg-muted rounded-full" /></TableCell>
                        <TableCell className="text-right pr-6"><div className="h-8 w-8 bg-muted rounded-lg float-right" /></TableCell>
                      </TableRow>
                    ))
                  ) : paginatedMaterials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20 text-muted-foreground font-medium">
                        No materials found in this room.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedMaterials.map((mat) => (
                      <React.Fragment key={mat._id}>
                        <TableRow className={cn(
                          "group border-border/50 transition-colors",
                          expandedRows[mat._id] ? "bg-muted/40" : "hover:bg-muted/10"
                        )}>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleExpand(mat._id)}
                              className={cn(
                                "h-8 w-8 rounded-lg border border-transparent transition-all",
                                expandedRows[mat._id] ? "bg-primary text-white" : "text-muted-foreground hover:bg-background"
                              )}
                            >
                              {expandedRows[mat._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <span className="font-bold text-foreground uppercase tracking-tight text-sm">{mat.name}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-bold text-[10px] uppercase px-2 py-0.5">
                              {getSubMaterialsForMaterial(mat._id).length} Items
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 rounded-lg text-primary hover:bg-primary/10 font-bold text-[10px] uppercase"
                                onClick={() => handleOpenSubMaterialForm(mat._id)}
                              >
                                <Plus className="w-3 h-3 mr-1.5" /> Add Item
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background" onClick={() => handleOpenMaterialForm(mat)}>
                                <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive" onClick={() => setDeleteTarget({ type: 'material', id: mat._id })}>
                                <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>

                        {expandedRows[mat._id] && (
                          <TableRow className="bg-muted/20 border-border/50">
                            <TableCell colSpan={4} className="p-0">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                className="px-14 py-4"
                              >
                                <div className="bg-background/50 rounded-2xl border border-border/50 overflow-hidden shadow-inner">
                                  <Table size="sm">
                                    <TableHeader className="bg-muted/50">
                                      <TableRow className="border-border/30">
                                        <TableHead className="text-[10px] font-black uppercase text-muted-foreground">Item Specification</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase text-muted-foreground">Supplier Reference</TableHead>
                                        <TableHead className="text-right text-[10px] font-black uppercase text-muted-foreground">Valuation</TableHead>
                                        <TableHead className="text-right text-[10px] font-black uppercase text-muted-foreground pr-4">Control</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {getSubMaterialsForMaterial(mat._id).length === 0 ? (
                                        <TableRow>
                                          <TableCell colSpan={4} className="py-8 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            No Specifications Available
                                          </TableCell>
                                        </TableRow>
                                      ) : (
                                        getSubMaterialsForMaterial(mat._id).map(sub => (
                                          <TableRow key={sub._id} className="group/item border-border/30 hover:bg-muted/30 transition-colors">
                                            <TableCell className="text-xs font-bold text-foreground py-3">{sub.name}</TableCell>
                                            <TableCell className="text-[10px] font-bold text-muted-foreground uppercase">{sub.supplier || 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                              <span className="font-black text-xs">
                                                {selectedRoom?.percentageType ? `${sub.price}%` : `$${Number(sub.price).toLocaleString()}`}
                                              </span>
                                            </TableCell>
                                            <TableCell className="text-right pr-4">
                                              <div className="flex justify-end gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                <button onClick={() => handleOpenSubMaterialForm(mat._id, sub)} className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-background text-muted-foreground">
                                                  <Edit2 size={12} />
                                                </button>
                                                <button onClick={() => setDeleteTarget({ type: 'subMaterial', id: sub._id })} className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-destructive/10 text-destructive">
                                                  <Trash2 size={12} />
                                                </button>
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        ))
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </motion.div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between bg-muted/20">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {filteredMaterials.length} categories
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase rounded-lg border-border/50" disabled={materialPage === 1} onClick={() => setMaterialPage(p => p - 1)}>Prev</Button>
            <div className="h-8 px-3 rounded-lg bg-background border border-border/50 flex items-center justify-center text-[10px] font-black text-primary">{materialPage}</div>
            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase rounded-lg border-border/50" disabled={filteredMaterials.length <= materialPage * materialLimit} onClick={() => setMaterialPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>

      {/* Material Dialog */}
      <Dialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-0 overflow-hidden border-border/50 shadow-2xl">
          <DialogHeader className="px-8 pt-8 pb-6 border-b border-border/50 bg-muted/20">
            <DialogTitle className="text-2xl font-black tracking-tight">{editMode ? "Edit Material" : "Add Material"}</DialogTitle>
            <CardDescription>Main category for materials in {selectedRoom?.name}.</CardDescription>
          </DialogHeader>
          <form onSubmit={handleSaveMaterial} className="p-8 pb-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="matName">Material Name</Label>
              <Input
                id="matName"
                required
                value={materialForm.name}
                onChange={e => setMaterialForm({ ...materialForm, name: e.target.value })}
                onFocus={(e) => {
                  const val = e.target.value;
                  setTimeout(() => {
                    e.target.setSelectionRange(val.length, val.length);
                  }, 0);
                }}
                className="rounded-xl h-12 bg-background/50 border-border/50 focus-visible:ring-primary/20"
                placeholder="e.g. Premium Porcelain"
              />
            </div>
            <DialogFooter className="pt-4 border-t border-border/50">
              <Button type="button" variant="ghost" onClick={() => setIsMaterialDialogOpen(false)} className="rounded-xl font-bold h-11">Discard</Button>
              <Button type="submit" disabled={localLoading} className="rounded-xl font-bold px-8 h-11 shadow-lg shadow-primary/20">
                {localLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Material"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sub-Material Dialog */}
      <Dialog open={isSubMaterialDialogOpen} onOpenChange={setIsSubMaterialDialogOpen}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden border-border/50 shadow-2xl">
          <DialogHeader className="px-8 pt-8 pb-6 border-b border-border/50 bg-muted/20">
            <DialogTitle className="text-2xl font-black tracking-tight">{editMode ? "Edit Item" : "Add Item"}</DialogTitle>
            <CardDescription>Edit the name, price, and supplier for this item.</CardDescription>
          </DialogHeader>
          <form onSubmit={handleSaveSubMaterial} className="p-8 pb-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="subName">Item Name</Label>
                <Input
                  id="subName"
                  required
                  value={subMaterialForm.name}
                  onChange={e => setSubMaterialForm({ ...subMaterialForm, name: e.target.value })}
                  onFocus={(e) => {
                    const val = e.target.value;
                    setTimeout(() => {
                      e.target.setSelectionRange(val.length, val.length);
                    }, 0);
                  }}
                  className="rounded-xl h-12 bg-background/50 border-border/50 focus-visible:ring-primary/20"
                  placeholder="e.g. Matte Gray 12x24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">{selectedRoom?.percentageType ? "Percentage" : "Price"}</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs uppercase">
                    {selectedRoom?.percentageType ? "%" : "$"}
                  </div>
                  <Input id="price" type="number" step="0.01" required value={subMaterialForm.price} onChange={e => setSubMaterialForm({ ...subMaterialForm, price: e.target.value })} className="!pl-10 rounded-xl h-11 bg-background/50 border-border/50 focus-visible:ring-primary/20" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input id="supplier" value={subMaterialForm.supplier} onChange={e => setSubMaterialForm({ ...subMaterialForm, supplier: e.target.value })} className="rounded-xl h-11 bg-background/50 border-border/50 focus-visible:ring-primary/20" placeholder="e.g. Global Logistics" />
              </div>
            </div>
            <DialogFooter className="pt-4 border-t border-border/50">
              <Button type="button" variant="ghost" onClick={() => setIsSubMaterialDialogOpen(false)} className="rounded-xl font-bold h-11">Cancel</Button>
              <Button type="submit" disabled={localLoading} className="rounded-xl font-bold px-8 h-11 shadow-lg shadow-primary/20">
                {localLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Save Item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Room Config Dialog */}
      <Dialog open={isRoomConfigOpen} onOpenChange={setIsRoomConfigOpen}>
        <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-border/50 shadow-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="px-10 pt-8 pb-6 border-b border-border/50 bg-primary/[0.03]">
            <DialogTitle className="text-2xl font-black italic tracking-tighter">Manage Rooms</DialogTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-60">Add, edit, or remove room categories.</CardDescription>
          </DialogHeader>
          <div className="p-6 bg-background overflow-y-auto flex-1 custom-scrollbar">
            <div className="divide-y divide-border/50">
              {roomTypes.map(room => (
                <div
                  key={room._id}
                  onClick={() => setSelectedRoom(room)}
                  className={cn(
                    "py-3 flex items-center justify-between group cursor-pointer px-3 rounded-2xl transition-all",
                    selectedRoom?._id === room._id ? "bg-primary/10" : "hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center transition-all border shadow-sm",
                      selectedRoom?._id === room._id ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-muted/30 border-border/50 text-muted-foreground"
                    )}>
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-foreground uppercase tracking-tight">{room.name}</p>
                      <Badge className="text-[7px] font-black uppercase tracking-widest bg-primary/10 text-primary px-1.5 py-0 mt-1 border-none shadow-none">
                        {room.percentageType ? "Percentage" : "Fixed Rate"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all shadow-none" onClick={(e) => { e.stopPropagation(); setEditingRoomId(room._id); setRoomFormData({ name: room.name, percentageType: !!room.percentageType }); setIsRoomFormOpen(true); }}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all shadow-none" onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: 'room', id: room._id }); }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all shadow-none" onClick={(e) => { e.stopPropagation(); setSelectedRoom(room); }}>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border/50">
              <Button onClick={() => { setEditingRoomId(null); setRoomFormData({ name: "", percentageType: false }); setIsRoomFormOpen(true); }} className="w-full rounded-2xl h-11 font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" /> Add New Room
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Room Detail Dialog */}
      <Dialog open={isRoomFormOpen} onOpenChange={setIsRoomFormOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-border/50 shadow-2xl">
          <DialogHeader className="px-8 pt-8 pb-6 border-b border-border/50 bg-muted/20">
            <DialogTitle className="text-2xl font-black tracking-tight">{editingRoomId ? "Edit Room" : "Add Room"}</DialogTitle>
            <CardDescription>Edit room name and calculation type.</CardDescription>
          </DialogHeader>
          <form onSubmit={handleRoomAction} className="p-8 pb-6 space-y-8">
            <div className="space-y-2">
              <Label htmlFor="roomName">Room Name</Label>
              <Input
                id="roomName"
                required
                value={roomFormData.name}
                onChange={e => setRoomFormData({ ...roomFormData, name: e.target.value })}
                onFocus={(e) => {
                  const val = e.target.value;
                  setTimeout(() => {
                    e.target.setSelectionRange(val.length, val.length);
                  }, 0);
                }}
                className="rounded-xl h-12 bg-background/50 border-border/50 focus-visible:ring-primary/20"
                placeholder="e.g. Master Suite"
              />
            </div>
            <div className="p-6 rounded-2xl border border-border/50 bg-muted/30 flex items-center justify-between group hover:border-primary/50 transition-all">
              <div className="space-y-1">
                <Label className="text-sm font-bold">Cost Type</Label>
                <p className="text-xs text-muted-foreground font-medium">Calculate costs as a percentage.</p>
              </div>
              <Switch
                checked={roomFormData.percentageType}
                onCheckedChange={(c) => setRoomFormData({ ...roomFormData, percentageType: c })}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsRoomFormOpen(false)} className="rounded-xl font-bold h-11">Discard</Button>
              <Button type="submit" disabled={localLoading} className="rounded-xl font-bold px-8 h-11 shadow-lg shadow-primary/20">
                {localLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Room"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Global Deletion Alert */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-[2rem] border-border/50 shadow-2xl max-w-md p-8">
          <AlertDialogHeader className="items-center text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8 text-destructive" />
            </div>
            <AlertDialogTitle className="text-2xl font-black tracking-tight">Delete Item?</AlertDialogTitle>
            <AlertDialogDescription className="text-base font-medium">
              This will permanently delete this {deleteTarget?.type}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3 sm:flex-row sm:justify-center">
            <AlertDialogCancel className="rounded-xl h-12 px-8 font-bold border-border/50">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={performDelete} className="bg-destructive hover:bg-destructive/90 rounded-xl h-12 px-8 font-bold text-white shadow-lg shadow-destructive/20 border-none transition-all active:scale-[0.98]">
              {localLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default MaterialPage;
