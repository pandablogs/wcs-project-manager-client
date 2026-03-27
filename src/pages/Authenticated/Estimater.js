import React, { useState, useEffect, useMemo } from "react";
import materialService from "../../services/materialServices";
import userServices from "../../services/userServices";
import rehabGroupService from "../../services/rehabGroupServices";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { 
  FileDown, 
  Save, 
  Plus, 
  Trash2, 
  ChevronRight, 
  DollarSign, 
  Info, 
  Layers, 
  Layout, 
  Blocks,
  Package,
  ArrowRight,
  TrendingUp,
  Percent,
  Calculator,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Premium UI Components
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { PageHeader } from "../../components/ui/PageHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/Table";
import { cn } from "../../lib/utils";

const Estimater = () => {
    const [quantities, setQuantities] = useState({});
    const [materials, setMaterials] = useState([]);
    const [subMaterials, setSubMaterials] = useState([]);
    const [rooms, setRoomTypes] = useState([]);
    const [localLoading, setLocalLoading] = useState(false);
    const [projectName, setProjectName] = useState("New Project");
    const [createdBy, setCreatedBy] = useState({})
    const [projectId, setProjectId] = useState(null)
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedSubMaterials, setSelectedSubMaterials] = useState({});
    const [selectedMaterials, setSelectedMaterials] = useState({}); // Updated to object mapping: roomId -> [materialIds]
    const [rehabGroups, setRehabGroups] = useState([]);
    const [selectedRehabGroupId, setSelectedRehabGroupId] = useState("");
    const [markupPercent, setMarkupPercent] = useState(0);
    const [markupBySubMaterial, setMarkupBySubMaterial] = useState({});

    const { id } = useParams();
    const navigate = useNavigate();

    const getLineMarkupPercent = (subId) => markupBySubMaterial[subId] ?? markupPercent ?? 0;

    useEffect(() => {
        const loadAll = async () => {
            setLocalLoading(true);
            await Promise.all([
                fetchRooms(),
                fetchMaterials(),
                fetchSubMaterials(),
                fetchProfile(),
                fetchRehabGroups()
            ]);
            if (id) {
                setIsEditMode(true);
                setProjectId(id);
                fetchProjectData(id);
            }
            setLocalLoading(false);
        };
        loadAll();
    }, [id]);

    const fetchRehabGroups = async () => {
        try {
            const res = await rehabGroupService.getAll();
            setRehabGroups(res.data || []);
        } catch (err) {
            console.error("Error fetching rehab groups", err);
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await userServices.getProfile();
            setCreatedBy(response.user)
        } catch (error) {
            toast.error("Failed to fetch profile");
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await materialService.getMaterialRoomAll();
            const fixedRooms = (response.data || []).map(r => ({ 
                ...r, 
                name: (r.name || "").toUpperCase() === "LEAVING ROOM" ? "LIVING ROOM" : r.name 
            }));
            setRoomTypes(fixedRooms);
        } catch (err) {
            toast.error("Failed to synchronize room categories");
        }
    };

    const fetchMaterials = async () => {
        try {
            const response = await materialService.getMaterialAll({});
            setMaterials(response.data);
        } catch (err) {
            toast.error("Failed to sync material data");
        }
    };

    const fetchSubMaterials = async () => {
        try {
            const response = await materialService.getSubMaterialAll({});
            setSubMaterials(response.data);
        } catch (err) {
            toast.error("Failed to sync sub-material inventory");
        }
    };

    const fetchProjectData = async (projectId) => {
        try {
            const response = await materialService.getProjectById(projectId);
            if (response.status) {
                const project = response.data;
                setProjectName(project.name || '');
                setProjectId(project._id || '');

                const qtyMap = {};
                const selectedSubMap = {};
                const selectedMatMap = {};
                const markupMap = {};

                project.rooms.forEach((room) => {
                    const roomId = room.roomId?._id;
                    if (!selectedMatMap[roomId]) selectedMatMap[roomId] = [];

                    room.materials.forEach((material) => {
                        const matId = material.materialId?._id;
                        const subSelected = [];

                        material.subMaterials.forEach((sub) => {
                            const subId = sub.subMaterialId?._id;
                            const qty = sub.quantity || 0;
                            if (qty > 0) {
                                qtyMap[subId] = qty;
                                if (sub.markupPercent != null) markupMap[subId] = sub.markupPercent;
                                subSelected.push(subId);
                            }
                        });

                        if (subSelected.length > 0) {
                            selectedSubMap[matId] = subSelected;
                            if (!selectedMatMap[roomId].includes(matId)) {
                                selectedMatMap[roomId].push(matId);
                            }
                        }
                    });
                });

                setQuantities(qtyMap);
                setSelectedSubMaterials(selectedSubMap);
                setSelectedMaterials(selectedMatMap);
                setMarkupPercent(project.markupPercent ?? 0);
                setMarkupBySubMaterial(markupMap);
            }
        } catch (err) {
            toast.error("Critical error retrieving project data");
        }
    };

    const handleQuantityChange = (id, value) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: value >= 0 ? value : 0,
        }));
    };

    const calculateTotal = useMemo(() => {
        let actualTotal = 0;
        let totalWithMarkup = 0;
        let percentageMarkup = 0;
        let percentageItems = [];
        const markupPercentVal = markupPercent || 0;

        rooms.forEach((room) => {
            const roomMaterials = materials.filter((mat) => mat.roomId?._id === room._id);

            roomMaterials.forEach((mat) => {
                const subIds = selectedSubMaterials[mat._id] || [];

                subIds.forEach((subId) => {
                    const sub = subMaterials.find((s) => s._id === subId);
                    const qty = quantities[subId] || 0;

                    if (room.percentageType) {
                        percentageMarkup += sub?.price || 0;
                        if (sub) {
                            percentageItems.push(`${sub.name} (${sub.price}%)`);
                        }
                    } else {
                        const amount = qty * (sub?.price || 0);
                        actualTotal += amount;
                        
                        const m = markupBySubMaterial[subId] ?? markupPercentVal;
                        const amountWithMarkup = amount + amount * (m / 100);
                        totalWithMarkup += amountWithMarkup;
                    }
                });
            });
        });

        const markupAmount = totalWithMarkup - actualTotal;
        const subtotalBeforePct = totalWithMarkup;
        const percentageAddAmount = subtotalBeforePct * (percentageMarkup / 100);
        const finalTotal = subtotalBeforePct + percentageAddAmount;
        
        return {
            actualTotal,
            totalWithMarkup,
            percentageMarkup,
            percentageItems,
            percentageAddAmount,
            markupPercent: markupPercentVal,
            markupAmount,
            subtotalBeforeMarkup: subtotalBeforePct,
            finalTotal
        };
    }, [rooms, materials, subMaterials, selectedSubMaterials, quantities, markupPercent, markupBySubMaterial]);

    const getLineAmountWithMarkup = (amount, subId) => {
        const m = subId != null ? getLineMarkupPercent(subId) : (markupPercent || 0);
        return amount + amount * (m / 100);
    };

    const getRoomTotal = (roomId) => {
        const roomMaterials = materials.filter(mat => mat.roomId?._id === roomId);
        return roomMaterials.reduce((matTotal, mat) => {
            const subIds = selectedSubMaterials[mat._id] || [];
            return matTotal + subIds.reduce((acc, subId) => {
                const sub = subMaterials.find(s => s._id === subId);
                const qty = quantities[subId] || 0;
                const amount = qty * (sub?.price || 0);
                return acc + getLineAmountWithMarkup(amount, subId);
            }, 0);
        }, 0);
    };

    const saveProject = async () => {
        const totals = calculateTotal;
        const projectData = {
            name: projectName,
            rooms: rooms.map((room) => {
                const selectedMaterialIds = selectedMaterials[room._id] || [];
                const materialsData = selectedMaterialIds.map((matId) => {
                    const selectedSubIds = selectedSubMaterials[matId] || [];
                    const subMaterialsData = selectedSubIds.map((subId) => {
                        const sub = subMaterials.find((s) => s._id === subId);
                        const quantity = room.percentageType ? 1 : (quantities[subId] || 0);
                        if (quantity > 0) {
                            return {
                                subMaterialId: subId,
                                quantity,
                                price: sub?.price || 0,
                                markupPercent: getLineMarkupPercent(subId),
                            };
                        }
                        return null;
                    }).filter(Boolean);
                    
                    if (subMaterialsData.length > 0) {
                        return { materialId: matId, subMaterials: subMaterialsData };
                    }
                    return null;
                }).filter(Boolean);

                return { roomId: room._id, materials: materialsData };
            }),
            totalBudget: totals.finalTotal,
            markupPercent: markupPercent ?? 0,
            createdBy: createdBy || {},
        };

        try {
            setLocalLoading(true);
            let response;
            if (isEditMode) {
                response = await materialService.updateProject(projectId, projectData);
                if (response?.status) toast.success("Project architecture updated");
            } else {
                response = await materialService.addProject(projectData);
                if (response?.status) {
                    toast.success("New project archived successfully");
                    navigate("/project-list");
                }
            }
        } catch (error) {
            toast.error("Failed to commit project registry");
        } finally {
            setLocalLoading(false);
        }
    };

    const handleExportToExcel = () => {
        const sheetData = [];
        rooms.forEach((room) => {
            const selectedMaterialIds = selectedMaterials[room._id] || [];
            if (selectedMaterialIds.length === 0) return;

            let roomHasData = false;
            const roomRows = [["Material", "Sub-Material", "Price", "Quantity", "Amount", "Markup", "Total"]];

            selectedMaterialIds.forEach((matId) => {
                const mat = materials.find((m) => m._id === matId);
                const selectedSubIds = selectedSubMaterials[matId] || [];

                selectedSubIds.forEach((subId) => {
                    const sub = subMaterials.find((s) => s._id === subId);
                    const qty = quantities[subId] || 0;
                    if (qty > 0) {
                        roomHasData = true;
                        const price = sub?.price || 0;
                        const amount = qty * price;
                        const lineMarkupPct = getLineMarkupPercent(subId);
                        const lineMarkupAmt = amount * (lineMarkupPct / 100);
                        const lineTotalVal = amount + lineMarkupAmt;
                        roomRows.push([
                            mat?.name || "",
                            sub?.name || "",
                            `$${price.toFixed(2)}`,
                            qty,
                            `$${amount.toFixed(2)}`,
                            lineMarkupPct > 0 ? `+ $${lineMarkupAmt.toFixed(2)} (${lineMarkupPct}%)` : "",
                            `$${lineTotalVal.toFixed(2)}`
                        ]);
                    }
                });
            });

            if (roomHasData) {
                sheetData.push([room.name.toUpperCase()]);
                sheetData.push(...roomRows);
                sheetData.push([]);
            }
        });

        const totals = calculateTotal;
        sheetData.push(["ESTIMATE SUMMARY"]);
        sheetData.push(["Actual Total", "", "", "", "", "", `$${totals.actualTotal.toFixed(2)}`]);
        if (totals.percentageMarkup > 0) {
            sheetData.push([`Added Pct (${totals.percentageMarkup}%)`, "", "", "", "", "", `+ $${totals.percentageAddAmount.toFixed(2)}`]);
        }
        sheetData.push(["Final Valuation", "", "", "", "", "", `$${totals.finalTotal.toFixed(2)}`]);

        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Estimate");
        XLSX.writeFile(wb, `${projectName}_Estimate.xlsx`);
    };

    const applyRehabGroup = (group) => {
        if (!group?.items?.length) {
            toast.warning("Empty group topology");
            return;
        }
        setSelectedMaterials((prev) => {
            const next = { ...prev };
            group.items.forEach((item) => {
                const rId = item.roomId?._id || item.roomId;
                const mId = item.materialId?._id || item.materialId;
                if (!rId || !mId) return;
                if (!next[rId]) next[rId] = [];
                if (!next[rId].includes(mId)) next[rId].push(mId);
            });
            return next;
        });
        setSelectedSubMaterials((prev) => {
            const next = { ...prev };
            group.items.forEach((item) => {
                const mId = item.materialId?._id || item.materialId;
                const sId = item.subMaterialId?._id || item.subMaterialId;
                if (!mId || !sId) return;
                if (!next[mId]) next[mId] = [];
                if (!next[mId].includes(sId)) next[mId].push(sId);
            });
            return next;
        });
        setQuantities((prev) => {
            const next = { ...prev };
            group.items.forEach((item) => {
                const sId = item.subMaterialId?._id || item.subMaterialId;
                if (!sId) return;
                next[sId] = (next[sId] || 0) + (item.defaultQuantity ?? 1);
            });
            return next;
        });
        toast.success(`Injected group: ${group.name}`);
    };

    const handleAddRehabGroup = () => {
        const group = rehabGroups.find(g => g._id === selectedRehabGroupId);
        if (group) applyRehabGroup(group);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24 space-y-8">
            <AnimatePresence>
                {localLoading && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            <p className="text-sm font-bold tracking-widest uppercase text-muted-foreground animate-pulse">Syncing Estimate Metadata...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <PageHeader 
                title={isEditMode ? "Project Architecture" : "Project Estimator"}
                description="Engineering high-fidelity financial projections for architectural initiatives."
            >
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="rounded-xl border-border/40 bg-background/50 backdrop-blur-sm h-11 px-5 shadow-sm hover:bg-muted transition-all" onClick={handleExportToExcel}>
                        <FileDown className="w-4 h-4 mr-2" /> EXPORT XLSX
                    </Button>
                    <Button className="rounded-xl shadow-lg shadow-primary/20 h-11 px-8 bg-primary text-white hover:opacity-90 font-bold italic tracking-tight" onClick={saveProject}>
                        <Save className="w-4 h-4 mr-2" /> {isEditMode ? "SAVE CHANGES" : "CREATE PROJECT"}
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3 space-y-8">
                    {/* General Settings */}
                    <Card className="border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b border-border/40 py-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-primary/10 text-white border border-primary/20">
                                    <Layout className="w-6 h-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black italic tracking-tighter">Project Config</CardTitle>
                                    <CardDescription>Establish project identity and global financial parameters.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Project Registry Name</label>
                                    <Input 
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="h-12 text-lg font-bold bg-background/50 border-border/50 rounded-[1rem] focus-visible:ring-primary/20"
                                        placeholder="e.g. Oakwood Estate Phase I"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Global Markup Factor (%)</label>
                                    <div className="relative">
                                        <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                                        <Input 
                                            type="number"
                                            value={markupPercent}
                                            onChange={(e) => setMarkupPercent(parseFloat(e.target.value) || 0)}
                                            className="h-12 text-lg font-bold bg-background/50 border-border/50 rounded-[1rem] focus-visible:ring-primary/20"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rehab Groups Quick-Add */}
                    {rehabGroups.length > 0 && (
                        <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
                            <CardHeader className="py-4">
                                <div className="flex items-center gap-3">
                                    <Blocks className="w-5 h-5 text-primary" />
                                    <CardTitle className="text-base font-bold tracking-tight">Rapid Component Injection</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="px-8 pb-8 pt-0">
                                <div className="flex flex-wrap items-center gap-4">
                                    <Select value={selectedRehabGroupId} onValueChange={setSelectedRehabGroupId}>
                                        <SelectTrigger className="w-[300px] h-11 bg-background/40 border-border/40 rounded-xl">
                                            <SelectValue placeholder="Select component group..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/40 shadow-2xl">
                                            {rehabGroups.map((g) => (
                                                <SelectItem key={g._id} value={g._id} className="rounded-lg">
                                                    {g.name} ({g.items?.length || 0} units)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button 
                                        onClick={handleAddRehabGroup} 
                                        disabled={!selectedRehabGroupId}
                                        className="h-11 rounded-xl font-bold bg-primary text-white hover:opacity-90 transition-all shadow-lg shadow-primary/20 italic px-6"
                                    >
                                        ADD GROUP <Plus className="w-4 h-4 ml-2" />
                                    </Button>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider italic">
                                        Groups will be merged into current architectural stack.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Room Layouts */}
                    <div className="space-y-10">
                        {rooms.map((room, rIdx) => (
                            <motion.div 
                                key={room._id} 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: rIdx * 0.05 }}
                            >
                                <Card className="border-border/50 shadow-2xl overflow-hidden rounded-[2rem]">
                                    <CardHeader className="pb-6 border-b border-border/40 mx-8 px-0 flex flex-row items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-inner">
                                                <Package className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl font-black italic tracking-tight">{room.name}</CardTitle>
                                                <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Architectural Node</CardDescription>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="mb-2 uppercase text-[10px] font-black italic border-primary/20 text-primary bg-primary/5">
                                                {room.percentageType ? "Percentage Logic" : "Valuation Logic"}
                                            </Badge>
                                            <p className="text-2xl font-black text-foreground tracking-tighter">
                                                ${getRoomTotal(room._id).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-12">
                                            {/* Add Material Dropdown */}
                                            {materials.filter(m => m.roomId?._id === room._id).length > 
                                             (selectedMaterials[room._id]?.length || 0) && (
                                                <div className="flex justify-center -mt-4 mb-4">
                                                    <Select onValueChange={(val) => {
                                                        setSelectedMaterials(prev => ({
                                                            ...prev,
                                                            [room._id]: [...(prev[room._id] || []), val]
                                                        }));
                                                    }}>
                                                        <SelectTrigger 
                                                            className="w-auto h-10 px-8 rounded-full border-dashed border-primary/40 bg-primary/5 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-inner"
                                                        >
                                                            <SelectValue placeholder="Deploy Material Component" />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-border/40 shadow-2xl">
                                                            {materials
                                                                .filter(mat => mat.roomId?._id === room._id)
                                                                .filter(mat => !(selectedMaterials[room._id] || []).includes(mat._id))
                                                                .map(mat => (
                                                                    <SelectItem key={mat._id} value={mat._id} className="rounded-lg font-bold">
                                                                        {mat.name}
                                                                    </SelectItem>
                                                                ))
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}

                                            {(selectedMaterials[room._id] || []).map((matId, mIdx) => {
                                                const mat = materials.find(m => m._id === matId);
                                                const subs = subMaterials.filter(s => s.materialId?._id === matId);
                                                const selSubs = selectedSubMaterials[matId] || [];

                                                return (
                                                    <div key={matId} className="relative pl-8 border-l-2 border-primary/20 space-y-6 animate-in slide-in-from-left duration-500">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-4 w-4 rounded-full bg-primary/20 border border-primary/40 absolute -left-[9px] top-1" />
                                                                <h5 className="text-lg font-black tracking-tight underline decoration-primary/30 underline-offset-8">{mat?.name}</h5>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {subs.length > selSubs.length && (
                                                                    <Select onValueChange={(val) => {
                                                                        setSelectedSubMaterials(prev => ({
                                                                            ...prev,
                                                                            [matId]: [...(prev[matId] || []), val]
                                                                        }));
                                                                    }}>
                                                                        <SelectTrigger className="h-8 w-auto px-4 rounded-lg bg-muted text-[10px] font-black uppercase tracking-widest border-none">
                                                                            <SelectValue placeholder="Add Unit" />
                                                                        </SelectTrigger>
                                                                        <SelectContent className="rounded-xl border-border/40 shadow-2xl">
                                                                            {subs.filter(s => !selSubs.includes(s._id)).map(s => (
                                                                                <SelectItem key={s._id} value={s._id} className="rounded-md">
                                                                                    {s.name} — ${s.price}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon" 
                                                                    className="h-8 w-8 rounded-lg text-rose-500 hover:bg-rose-500/10"
                                                                    onClick={() => {
                                                                        setSelectedMaterials(prev => ({
                                                                            ...prev,
                                                                            [room._id]: prev[room._id].filter(id => id !== matId)
                                                                        }));
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {selSubs.length > 0 && (
                                                            <Table className="bg-background/20 rounded-2xl overflow-hidden border-border/20 shadow-inner">
                                                                <TableHeader className="bg-muted/10">
                                                                    <TableRow className="border-border/40">
                                                                        <TableHead className="pl-6">Inventory Unit</TableHead>
                                                                        {!room.percentageType ? (
                                                                            <>
                                                                                <TableHead className="text-center w-32">Price</TableHead>
                                                                                <TableHead className="text-center w-32">Qty</TableHead>
                                                                                <TableHead className="text-center w-32">Subtotal</TableHead>
                                                                                <TableHead className="text-center w-32">Markup%</TableHead>
                                                                                <TableHead className="text-right pr-6 w-32 text-primary font-black">Valuation</TableHead>
                                                                            </>
                                                                        ) : (
                                                                            <TableHead className="text-right pr-6 w-32">Pct %</TableHead>
                                                                        )}
                                                                        <TableHead className="w-12"></TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {subs.filter(s => selSubs.includes(s._id)).map(s => {
                                                                        const qty = quantities[s._id] || 0;
                                                                        const baseAmt = qty * s.price;
                                                                        const markup = getLineMarkupPercent(s._id);
                                                                        const lineFinal = getLineAmountWithMarkup(baseAmt, s._id);

                                                                        return (
                                                                            <TableRow key={s._id} className="border-border/30 hover:bg-primary/5 transition-colors">
                                                                                <TableCell className="pl-6 font-bold">{s.name}</TableCell>
                                                                                {!room.percentageType ? (
                                                                                    <>
                                                                                        <TableCell className="text-center font-medium">${s.price.toFixed(2)}</TableCell>
                                                                                        <TableCell className="text-center">
                                                                                            <Input 
                                                                                                type="number" 
                                                                                                value={qty || ""}
                                                                                                onChange={(e) => handleQuantityChange(s._id, parseInt(e.target.value) || 0)}
                                                                                                className="h-9 w-20 mx-auto text-center font-black rounded-lg bg-background/50 border-border/40 focus-visible:ring-primary/20"
                                                                                            />
                                                                                        </TableCell>
                                                                                        <TableCell className="text-center text-muted-foreground font-mono italic text-xs">${baseAmt.toFixed(2)}</TableCell>
                                                                                        <TableCell className="text-center">
                                                                                            <Input 
                                                                                                type="number"
                                                                                                value={markup}
                                                                                                onChange={(e) => setMarkupBySubMaterial(prev => ({ ...prev, [s._id]: parseFloat(e.target.value) || 0 }))}
                                                                                                className="h-9 w-20 mx-auto text-center font-black rounded-lg bg-background/50 border-border/40 focus-visible:ring-primary/20"
                                                                                            />
                                                                                        </TableCell>
                                                                                        <TableCell className="text-right pr-6 font-black text-emerald-600 dark:text-emerald-400">
                                                                                            ${lineFinal.toFixed(2)}
                                                                                        </TableCell>
                                                                                    </>
                                                                                ) : (
                                                                                    <TableCell className="text-right pr-6 font-black text-primary">{s.price}%</TableCell>
                                                                                )}
                                                                                <TableCell className="pr-2">
                                                                                    <Button 
                                                                                        variant="ghost" 
                                                                                        size="icon" 
                                                                                        className="h-7 w-7 rounded-md opacity-0 group-hover:opacity-100 hover:text-rose-500"
                                                                                        onClick={() => setSelectedSubMaterials(prev => ({
                                                                                            ...prev,
                                                                                            [matId]: prev[matId].filter(id => id !== s._id)
                                                                                        }))}
                                                                                    >
                                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                                    </Button>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )
                                                                    })}
                                                                </TableBody>
                                                            </Table>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Summary Column */}
                <div className="xl:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <Card className="border-primary/20 bg-background/50 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="bg-primary/5 border-b border-primary/10 py-8 px-10">
                                <CardTitle className="text-2xl font-black italic tracking-tighter text-primary">Estimate Ledger</CardTitle>
                                <CardDescription className="font-bold uppercase text-[10px] tracking-widest text-primary/60">Final Valuation Summary</CardDescription>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <Calculator className="w-3.5 h-3.5" /> Actual Total
                                        </span>
                                        <span className="font-mono font-bold text-foreground italic">${calculateTotal.actualTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                            <TrendingUp className="w-3.5 h-3.5" /> Markup Total
                                        </span>
                                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 italic">+ ${calculateTotal.markupAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    {calculateTotal.percentageMarkup > 0 && (
                                        <div className="space-y-2 pt-2 border-t border-border/40">
                                            <div className="flex justify-between items-center px-1">
                                                <span className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                    <Percent className="w-3.5 h-3.5" /> Added Pct ({calculateTotal.percentageMarkup}%)
                                                </span>
                                                <span className="font-mono font-bold text-primary italic">+ ${calculateTotal.percentageAddAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-primary opacity-70 mb-1">Impacted Elements</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {calculateTotal.percentageItems.map((item, i) => (
                                                        <Badge key={i} variant="outline" className="text-[8px] bg-background/50 border-primary/20 text-primary font-bold">{item}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-8 border-t-2 border-primary/20">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Final Capital Allocation</span>
                                        </div>
                                        <p className="text-5xl font-black text-foreground tracking-tighter tabular-nums drop-shadow-xl">
                                            ${calculateTotal.finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>

                                <Button 
                                    className="w-full h-16 rounded-[1.5rem] bg-primary text-white text-lg font-black italic shadow-xl shadow-primary/30 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border-none group"
                                    onClick={saveProject}
                                >
                                    {isEditMode ? "SAVE CHANGES" : "GENERATE PROJECT"}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent>
                            <CardFooter className="bg-muted/30 p-8 flex items-start gap-3">
                                <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                <p className="text-[10px] font-medium leading-relaxed text-muted-foreground">
                                    Valuations are synchronized in real-time with project metadata. Ensure all material units are assigned before committing to the registry.
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Estimater;
