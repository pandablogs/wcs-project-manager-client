import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import authServices from "../../services/authServices";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { motion } from "framer-motion";

const AdminLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

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
            role_type: "admin",
        };

        try {
            setIsLoading(true);
            const response = await authServices.login(payload);
            localStorage.setItem("_token", response?.token || "");
            dispatch(setUser(response.user));
            localStorage.setItem("user", JSON.stringify(response.user));
            localStorage.setItem("role_type", "admin");
            toast.success("Welcome back, Administrator!");

            setTimeout(() => {
                navigate("/admin/dashboard");
                setIsLoading(false);
            }, 800);
        } catch (error) {
            setIsLoading(false);
            const msg = error.response?.data?.message || "Authentication failed.";
            setError(msg);
            toast.error(msg);
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden p-4 md:p-8">
            {/* Admin specific background */}
            <div className="absolute inset-0 z-0 text-primary/10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="z-10 w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-4 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl mb-3">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-primary/20">
                        Secure Admin Portal
                    </div>
                    <h1 className="text-4xl font-display font-black tracking-tight text-white mb-2">WCS Admin</h1>
                    <p className="text-slate-400 text-center font-medium">Enterprise Resource Control Center</p>
                </div>

                <Card className="border-white/10 shadow-2xl bg-slate-900/40 backdrop-blur-2xl rounded-3xl overflow-hidden">
                    <CardHeader className="space-y-1 pb-6 text-center border-b border-white/5">
                        <CardTitle className="text-xl font-bold text-white uppercase tracking-tight">Authentication</CardTitle>
                        <CardDescription className="text-slate-400">Enter secure credentials to proceed</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center font-medium">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300 text-[11px] uppercase tracking-wider font-bold">Admin Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@wcs-manager.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-primary/40 focus-visible:border-primary/40 focus-visible:bg-white/10 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-300 text-[11px] uppercase tracking-wider font-bold">Secure Password</Label>
                                <div className="relative group/pass">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-primary/40 focus-visible:border-primary/40 focus-visible:bg-white/10 transition-all pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-white/5 transition-all"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-14 rounded-xl text-base font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98] mt-4"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
                                {isLoading ? "Verifying..." : "Access Dashboard"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-12 flex flex-col items-center gap-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                        System Integrity Monitored
                    </p>
                    <div className="w-1 h-1 rounded-full bg-primary animate-ping"></div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
