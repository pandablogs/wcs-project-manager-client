import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import authServices from "../../services/authServices";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { Building2, Loader2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [role, setRole] = useState("user");
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
        };

        try {
            setIsLoading(true);
            const response = await authServices.login(payload);
            localStorage.setItem("_token", response?.token || "");
            dispatch(setUser(response.user));
            localStorage.setItem("user", JSON.stringify(response.user));
            localStorage.setItem("role_type", role);
            toast.success("Login successful!");
            setTimeout(() => {
                navigate("/user/dashboard");
                setIsLoading(false);
            }, 1500);
        } catch (error) {
            setIsLoading(false);
            toast.error("Login failed.");
            setError(error.response?.data?.message || "Login failed.");
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden p-4 md:p-8">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="z-10 w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30 mb-4">
                        <Building2 className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">WCS Manager</h1>
                    <p className="text-muted-foreground mt-2 text-center">Project Planning & Management</p>
                </div>

                <Card className="border-border/50 shadow-2xl bg-card/80 backdrop-blur-xl rounded-2xl overflow-hidden">
                    <CardHeader className="space-y-1 pb-6 text-center">
                        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                        <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 rounded-lg bg-background/50 border-muted focus-visible:ring-primary/30"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link to="/forget-password" data-sidebar="link" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
                                </div>
                                <div className="relative group/pass">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-11 rounded-lg bg-background/50 border-muted focus-visible:ring-primary/30 pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-all"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 rounded-lg text-base font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            <p>Don't have an account yet? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up now</Link></p>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-xs text-muted-foreground">
                    © WCS Project Manager 2026
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
