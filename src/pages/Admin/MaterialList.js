import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { 
  Plus, 
  Upload, 
  ChevronDown, 
  ChevronRight, 
  FileSpreadsheet, 
  Search,
  Box,
  Layers,
  Home,
  Tag,
  SearchIcon,
  Loader2,
  FileDown,
  Info,
  Database
} from "lucide-react";
import materialService from "../../services/materialServices";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/Dialog";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

const FIELD_LABELS = {
  roomName: "Room Name",
  materialName: "Material Name",
  subMaterialName: "Sub-Material Name",
  price: "Standard Price",
  supplier: "Primary Supplier",
};

const MaterialList = () => {
  const [rooms, setRooms] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [subMaterials, setSubMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [parsedData, setParsedData] = useState({ headers: [], rows: [] });
  const [columnMapping, setColumnMapping] = useState({
    roomName: "",
    materialName: "",
    subMaterialName: "",
    price: "",
    supplier: "",
  });

  const [importing, setImporting] = useState(false);
  const location = useLocation();

  // Parse search query from URL
  const getSearchFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || "";
  };

  const [expandedRooms, setExpandedRooms] = useState({});
  const [expandedMaterials, setExpandedMaterials] = useState({});
  const [searchQuery, setSearchQuery] = useState(getSearchFromUrl());

  // Update search when URL changes
  useEffect(() => {
    const urlSearch = getSearchFromUrl();
    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
  }, [location.search]);

  const toggleRoom = (roomId) => {
    setExpandedRooms((prev) => ({ ...prev, [roomId]: !prev[roomId] }));
  };

  const toggleMaterial = (matId) => {
    setExpandedMaterials((prev) => ({ ...prev, [matId]: !prev[matId] }));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [roomsRes, materialsRes, subRes] = await Promise.all([
        materialService.getMaterialRoomAll(),
        materialService.getMaterialAll({}),
        materialService.getSubMaterialAll({}),
      ]);

      setRooms(roomsRes.data || []);
      setMaterials(materialsRes.data || []);
      setSubMaterials(subRes.data || []);
    } catch {
      toast.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  const getMaterialsByRoom = (roomId) =>
    materials.filter((m) => m.roomId?._id === roomId);

  const getSubMaterialsByRoomAndMaterial = (roomId, materialId) =>
    subMaterials.filter(
      (s) => s.roomId?._id === roomId && s.materialId?._id === materialId
    );

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    const reader = new FileReader();

    reader.onload = (ev) => {
      const data = new Uint8Array(ev.target.result);
      const wb = XLSX.read(data, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      if (json.length > 0) {
          const headers = json[0].map((h) => String(h || "").trim());
          const rows = json.slice(1).filter((r) =>
            r.some((c) => c != null && String(c).trim() !== "")
          );
          setParsedData({ headers, rows });
          
          // Auto-mapping logic
          const newMapping = { ...columnMapping };
          headers.forEach((header, idx) => {
              const h = header.toLowerCase();
              if (h.includes('room')) newMapping.roomName = idx;
              if (h.includes('material') && !h.includes('sub')) newMapping.materialName = idx;
              if (h.includes('sub')) newMapping.subMaterialName = idx;
              if (h.includes('price')) newMapping.price = idx;
              if (h.includes('supplier')) newMapping.supplier = idx;
          });
          setColumnMapping(newMapping);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleImportSubmit = async () => {
    const { rows } = parsedData;
    const map = columnMapping;

    const importRows = rows
      .map((row) => {
        const get = (key) => {
          const idx = map[key];
          if (idx === "" || idx == null) return "";
          const val = row[idx];
          return val != null ? String(val).trim() : "";
        };

        return {
          roomName: get("roomName"),
          materialName: get("materialName"),
          subMaterialName: get("subMaterialName"),
          price: parseFloat(get("price")) || 0,
          supplier: get("supplier"),
        };
      })
      .filter((r) => r.roomName || r.materialName || r.subMaterialName);

    if (!importRows.length) {
      toast.warning("No valid data found in file");
      return;
    }

    setImporting(true);
    try {
      const res = await materialService.importMaterialList(importRows);
      if (res.status) {
        toast.success("Materials imported successfully");
        setImportDialogOpen(false);
        fetchAll();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to import materials");
    } finally {
      setImporting(false);
    }
  };

  const filteredRooms = rooms.filter(r => {
    const search = searchQuery.toLowerCase();
    const roomMatch = r.name.toLowerCase().includes(search);
    const materialMatch = getMaterialsByRoom(r._id).some(m => 
      m.name.toLowerCase().includes(search) || 
      getSubMaterialsByRoomAndMaterial(r._id, m._id).some(s => s.name.toLowerCase().includes(search))
    );
    return roomMatch || materialMatch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-12"
    >
      <PageHeader 
        title="Materials" 
        description="Manage all materials, items, and room categories."
      >
        <Button onClick={() => setImportDialogOpen(true)} className="rounded-xl shadow-lg shadow-primary/20 h-10 px-6">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Rooms" value={rooms.length} icon={Home} description="Room categories" delay={0.1} />
        <StatCard title="Total Materials" value={materials.length} icon={Layers} description="Material categories" delay={0.2} />
        <StatCard title="Total Items" value={subMaterials.length} icon={Box} description="Available items" delay={0.3} />
      </div>

      <Card className="border-border/40 bg-card/30 backdrop-blur-md shadow-2xl overflow-hidden rounded-[2.5rem]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 px-10 pt-10">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-black italic tracking-tighter">Material List</CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-widest opacity-60">Manage materials and categories</CardDescription>
          </div>
          <div className="relative max-w-sm w-full">
            <SearchIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
            <Input 
              placeholder="Search materials..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="!pl-14 h-12 rounded-2xl bg-background/40 border-border/40 focus-visible:ring-primary/20 font-bold"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/20">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-10 space-y-4 animate-pulse">
                  <div className="h-12 bg-muted/40 rounded-2xl w-1/3" />
                  <div className="h-4 bg-muted/30 rounded-full w-1/4 ml-16" />
                </div>
              ))
            ) : filteredRooms.length === 0 ? (
              <div className="py-32 text-center text-muted-foreground font-black italic uppercase tracking-widest text-xs opacity-50">
                No materials found
              </div>
            ) : (
              filteredRooms.map((room) => {
                const roomMats = getMaterialsByRoom(room._id);
                const roomOpen = expandedRooms[room._id];

                return (
                  <div key={room._id} className="group/room">
                    <div 
                      onClick={() => toggleRoom(room._id)}
                      className={cn(
                        "flex items-center gap-6 px-10 py-6 cursor-pointer transition-all border-l-4 border-transparent",
                        roomOpen ? "bg-primary/[0.04] border-primary" : "hover:bg-muted/10"
                      )}
                    >
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-all border shadow-sm",
                        roomOpen ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-110" : "bg-background border-border/40 text-muted-foreground"
                      )}>
                        {roomOpen ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-black tracking-tighter text-foreground uppercase italic">{room.name}</span>
                            <Badge variant="premium" className="px-3 py-1 rounded-full shadow-lg shadow-primary/10">Room</Badge>
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1 opacity-60">{roomMats.length} Material Categories</p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {roomOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-primary/[0.01] divide-y divide-border/10"
                        >
                          {roomMats.map((mat) => {
                            const matSubs = getSubMaterialsByRoomAndMaterial(room._id, mat._id);
                            const matOpen = expandedMaterials[mat._id];

                            return (
                              <div key={mat._id} className="group/mat">
                                <div 
                                  onClick={(e) => { e.stopPropagation(); toggleMaterial(mat._id); }}
                                  className={cn(
                                    "flex items-center gap-6 px-16 py-5 cursor-pointer transition-all border-l-2 border-transparent",
                                    matOpen ? "bg-background/60 border-primary/30 shadow-inner" : "hover:bg-background/30"
                                  )}
                                >
                                  <div className={cn(
                                    "h-8 w-8 rounded-xl flex items-center justify-center transition-all border shadow-sm",
                                    matOpen ? "bg-primary/20 text-primary border-primary/30" : "bg-background border-border/40 text-muted-foreground"
                                  )}>
                                    {matOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-black text-foreground tracking-tight">{mat.name}</span>
                                        <Badge variant="premium" className="px-3 py-1 scale-90 border-primary/10">Material</Badge>
                                    </div>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-0.5 opacity-60">{matSubs.length} Items</p>
                                  </div>
                                </div>

                                <AnimatePresence>
                                  {matOpen && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-background/40 divide-y divide-border/5"
                                    >
                                      {matSubs.map((sub, sIdx) => (
                                        <motion.div 
                                            key={sub._id} 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: sIdx * 0.03 }}
                                            className="flex items-center justify-between px-32 py-4 hover:bg-primary/[0.03] transition-colors"
                                        >
                                          <div className="flex items-center gap-4 pl-4">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary/60 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-foreground/80 tracking-tight">{sub.name}</span>
                                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{sub._id.slice(-8).toUpperCase()}</span>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-12">
                                            <div className="text-right min-w-[100px]">
                                              <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] opacity-50">Price/Rate</p>
                                              <p className="text-sm font-black text-primary italic tracking-tight">${Number(sub.price).toLocaleString()}</p>
                                            </div>
                                            <div className="text-left min-w-[140px] border-l border-border/30 pl-8">
                                              <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] opacity-50">Supplier</p>
                                              <p className="text-xs font-black text-foreground/70 truncate max-w-[140px] italic">{sub.supplier || 'NOT ASSIGNED'}</p>
                                            </div>
                                          </div>
                                        </motion.div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
        <div className="px-10 py-8 border-t border-border/40 bg-primary/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Registry Online</span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{filteredRooms.length} rooms</span>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="h-10 px-6 rounded-2xl bg-background border border-border/40 flex items-center justify-center gap-3 shadow-sm">
                    <Box className="w-4 h-4 text-primary opacity-60" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{materials.length} Categories</span>
                </div>
                <div className="h-10 px-6 rounded-2xl bg-primary text-white flex items-center justify-center gap-3 shadow-lg shadow-primary/20">
                    <Layers className="w-4 h-4 opacity-60" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">{subMaterials.length} Items</span>
                </div>
            </div>
        </div>
      </Card>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-border/40 shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] bg-background/95 backdrop-blur-2xl">
          <DialogHeader className="px-10 pt-10 pb-8 border-b border-border/10 bg-primary/[0.03]">
            <div className="flex items-center gap-4 mb-2">
                <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                    <FileDown className="w-6 h-6" />
                </div>
                <div>
                    <DialogTitle className="text-3xl font-black italic tracking-tighter">Import Materials</DialogTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Upload a file to add multiple materials at once.</CardDescription>
                </div>
            </div>
          </DialogHeader>
          <div className="p-10 space-y-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className={cn(
                "group relative border-4 border-dashed rounded-[3rem] p-16 transition-all flex flex-col items-center justify-center gap-6 text-center cursor-pointer overflow-hidden",
                importFile ? "border-primary/40 bg-primary/5 shadow-2xl" : "border-border/20 hover:border-primary/20 bg-muted/10 hover:bg-muted/20"
            )}>
              {importFile && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent animate-pulse" />
              )}
              <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="h-24 w-24 rounded-[2.5rem] bg-background border-2 border-border/20 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-500 shadow-2xl z-0">
                 {importFile ? <FileSpreadsheet className="w-12 h-12" /> : <Upload className="w-12 h-12 opacity-40" />}
              </div>
              <div className="relative z-0">
                <p className="text-2xl font-black tracking-tighter text-foreground">{importFile ? importFile.name : "Select Spreadsheet"}</p>
                <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase mt-2 opacity-60">XLSX, XLS, OR CSV FILES ONLY</p>
              </div>
            </div>

            <AnimatePresence>
                {parsedData.headers.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    className="space-y-8"
                >
                    <div className="flex items-center gap-4 justify-center">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/40" />
                        <div className="flex items-center gap-3 px-6 py-2 rounded-full border border-border/40 bg-muted/40 backdrop-blur-sm">
                            <Database className="w-4 h-4 text-primary" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Map Columns</h4>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/40" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-4 pr-4">
                        {Object.keys(FIELD_LABELS).map((key) => (
                        <div key={key} className="space-y-3">
                            <div className="flex items-center justify-between pl-1">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 italic">{FIELD_LABELS[key]}</Label>
                                {columnMapping[key] !== "" && <Badge variant="secondary" className="h-5 px-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase italic">Mapped</Badge>}
                            </div>
                            <Select 
                                value={String(columnMapping[key])} 
                                onValueChange={(v) => setColumnMapping(prev => ({ ...prev, [key]: Number(v) }))}
                            >
                                <SelectTrigger className="h-14 rounded-2xl bg-background/50 border-border/40 shadow-inner group hover:border-primary/40 transition-all">
                                    <SelectValue placeholder="Select Column..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-border/40 bg-background/95 backdrop-blur-xl">
                                    {parsedData.headers.map((h, i) => (
                                        <SelectItem key={i} value={String(i)} className="rounded-xl text-xs font-black uppercase tracking-tight py-3 focus:bg-primary focus:text-white group">
                                            <span className="opacity-40 font-mono mr-2">[{i.toString().padStart(2, '0')}]</span> {h}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        ))}
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
          </div>
          <DialogFooter className="px-10 py-10 border-t border-border/10 bg-primary/[0.03]">
            <Button variant="ghost" className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 px-10 hover:bg-background/50" onClick={() => setImportDialogOpen(false)} disabled={importing}>Cancel</Button>
            <Button 
              className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-14 px-10 shadow-2xl shadow-primary/30 border-none italic group relative overflow-hidden" 
              onClick={handleImportSubmit} 
              disabled={importing || !parsedData.rows.length}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {importing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5 group-hover:scale-125 transition-transform" />}
                {importing ? "Importing Data..." : "Import Materials"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-600 to-primary group-hover:scale-x-110 transition-transform origin-left" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MaterialList;