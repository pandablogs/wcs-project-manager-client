import React, { useEffect, useState } from "react";
import { 
  Users, 
  Mail, 
  Phone, 
  User as UserIcon,
  SearchIcon,
  Loader2,
  Calendar,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "react-toastify";
import authServices from "../../services/authServices";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/Table";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { motion, AnimatePresence } from "framer-motion";

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalDocs, setTotalDocs] = useState(0);
    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
        search: ""
    });

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await authServices.getAllClients(queryParams);
            if (response.status && response.data) {
                setClients(response.data.clients || []);
                setTotalDocs(response.data.totalRecords || 0);
            }
        } catch (error) {
            toast.error("Failed to fetch clients");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, [queryParams]);

    const handleSearchChange = (e) => {
        setQueryParams(prev => ({ ...prev, search: e.target.value, page: 1 }));
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pb-8"
        >
            <PageHeader 
                title="Registered Clients" 
                description="View and manage clients registered in the system."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Total Clients" 
                    value={totalDocs} 
                    icon={Users} 
                    description="Successfully registered"
                    delay={0.1}
                />
            </div>

            <Card className="border-border/40 bg-card/30 backdrop-blur-md shadow-2xl overflow-hidden rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-8 pt-8">
                    <div className="space-y-1.5">
                        <CardTitle className="text-2xl font-black italic tracking-tighter">Clients</CardTitle>
                        <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Verified client accounts</CardDescription>
                    </div>
                    <div className="relative max-w-sm w-full">
                        <SearchIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                        <Input 
                            placeholder="Search clients..." 
                            value={queryParams.search}
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
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Client Name</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Assigned Manager</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Contact Information</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Joined Date</TableHead>
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
                                                <TableCell><div className="h-4 w-24 bg-muted/40 rounded-full" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : clients.length === 0 ? (
                                        <TableRow>
                                                <TableCell colSpan={5} className="text-center py-32 text-muted-foreground font-black italic uppercase tracking-widest text-xs opacity-50">
                                                    No clients found
                                                </TableCell>
                                        </TableRow>
                                    ) : (
                                        clients.map((client, idx) => (
                                            <motion.tr
                                                key={client._id}
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
                                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-primary font-black text-xs border border-primary/20 shadow-lg group-hover:scale-110 transition-all">
                                                            <UserIcon className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-foreground tracking-tight">{client.firstName} {client.lastName}</span>
                                                            <Badge variant="outline" className="text-[7px] h-4 uppercase tracking-tighter w-fit">Client</Badge>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {client.assigned_manager ? (
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-sm flex items-center gap-1.5"><UserCheck className="w-3 h-3 text-emerald-500" /> {client.assigned_manager.firstName} {client.assigned_manager.lastName}</span>
                                                            <span className="text-[10px] text-muted-foreground">{client.assigned_manager.email}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">Unassigned</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1 font-bold">
                                                        <span className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="w-3 h-3 text-primary/60" /> {client.email}</span>
                                                        <span className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="w-3 h-3 text-blue-500/60" /> {client.phone}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                                        <Calendar className="w-3.5 h-3.5 opacity-40" />
                                                        {new Date(client.createdAt).toLocaleDateString()}
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
                {totalDocs > queryParams.limit && (
                    <div className="px-8 py-6 border-t border-border/40 flex items-center justify-between bg-primary/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                Page {queryParams.page} of {Math.ceil(totalDocs / queryParams.limit)}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setQueryParams(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={queryParams.page === 1}
                                className="h-10 rounded-xl border-border/40 bg-background/50 font-bold text-xs gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setQueryParams(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={queryParams.page >= Math.ceil(totalDocs / queryParams.limit)}
                                className="h-10 rounded-xl border-border/40 bg-background/50 font-bold text-xs gap-2"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </motion.div>
    );
};

export default ClientList;
