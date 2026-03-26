import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Users, Loader2, Briefcase, LogIn } from "lucide-react";
import authServices from "../../services/authServices";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { motion } from "framer-motion";

const StaffLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [role, setRole] = useState("project_manager");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("All fields are required.");
            return;
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }
        
        let payload = {
            email: email,
            password: password,
            role_type: role,
        }

        try {
            setIsLoading(true);
            const response = await authServices.login(payload);
            localStorage.setItem("_token", response?.token || '');
            dispatch(setUser(response.user));
            localStorage.setItem("role_type", role);
            toast.success("Welcome back, Project Manager!");
            
            setTimeout(() => {
                navigate("/projectManager/dashboard");
                setIsLoading(false)
            }, 1000);

        } catch (error) {
            setIsLoading(false)
            const msg = error.response?.data?.message || "Authentication failed.";
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-[0.4]">
                <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-primary/10 to-transparent" />
                <div className="absolute bottom-0 right-0 w-full h-[50%] bg-gradient-to-t from-blue-500/5 to-transparent" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="z-10 w-full max-w-lg px-4"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-center mb-6">
                        <Briefcase className="w-8 h-8 text-primary" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider mb-4">
                        <Users className="w-3 h-3" />
                        Project Manager Portal
                    </div>
                    <h1 className="text-4xl font-display font-black tracking-tight text-foreground text-center">Staff Entrance</h1>
                </div>

                <Card className="border-border/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-card/80 backdrop-blur-xl rounded-[2rem] overflow-hidden p-2">
                    <CardHeader className="space-y-1 pb-8 pt-6 text-center">
                        <CardTitle className="text-2xl font-bold">Authorized Access</CardTitle>
                        <CardDescription>Enter your staff credentials to manage your assigned projects.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center font-medium">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2.5">
                                <Label htmlFor="email">Work Email</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="pm@wcs-manager.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 rounded-xl bg-background border-muted/50 focus-visible:ring-primary/20 focus-visible:border-primary transition-all px-4"
                                    required
                                />
                            </div>
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Staff Password</Label>
                                </div>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    placeholder="••••••••" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 rounded-xl bg-background border-muted/50 focus-visible:ring-primary/20 focus-visible:border-primary transition-all px-4"
                                    required
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] mt-6 bg-primary" 
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
                                {isLoading ? "Verifying Credentials..." : "Launch Workspace"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                
                <p className="mt-10 text-center text-[11px] font-bold text-muted-foreground uppercase tracking-[0.25em]">
                    Internal Networking &bull; Secure Protocol 7
                </p>
            </motion.div>
        </div>
    );
};

export default StaffLogin;
