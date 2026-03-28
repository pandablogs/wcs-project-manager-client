import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { UserPlus, Loader2, Mail, Lock, Phone, User, ArrowLeft, Users } from "lucide-react";
import authServices from '../../services/authServices';
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { motion } from "framer-motion";
import { useEffect } from "react";

const SignUp = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [assignedManager, setAssignedManager] = useState("");
    const [managers, setManagers] = useState([]);
    const [error, setError] = useState("");
    const [role, setRole] = useState("user");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await authServices.getPublicManagers();
                if (response.status) {
                    setManagers(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch managers", error);
            }
        };
        fetchManagers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!firstName || !lastName || !phone || !email || !password || !confirmPassword || !assignedManager) {
            setError("All fields are required.");
            return;
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        let payload = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            password: password,
            role_type: role,
            assigned_manager: assignedManager
        }

        try {
            setIsLoading(true)
            const response = await authServices.signup(payload);
            toast.success("Registration successful!");
            setTimeout(() => {
                navigate("/login");
            }, 1000);
            setIsLoading(false)

        } catch (error) {
            setIsLoading(false)
            setError(error.response?.data?.message || "Registration failed.");
            toast.error(error.response?.data?.message || "Registration failed.");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden py-12 px-4">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-background to-blue-500/5" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 w-full max-w-2xl"
            >
                <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to login
                </Link>

                <Card className="border-border/50 shadow-2xl bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden p-2">
                    <CardHeader className="text-center pb-8 border-b border-border/50 mx-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-lg mx-auto mb-4 border border-primary/20">
                            <UserPlus className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tight">Create Account</CardTitle>
                        <CardDescription>Join WCS as a new user to start managing your projects.</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-8 px-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center font-medium">
                                    {error}
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <div className="relative">
                                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input 
                                            id="firstName" 
                                            placeholder="John" 
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="!pl-14 h-11 rounded-xl bg-background/50"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <div className="relative">
                                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input 
                                            id="lastName" 
                                            placeholder="Doe" 
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="!pl-14 h-11 rounded-xl bg-background/50"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input 
                                            id="email" 
                                            type="email"
                                            placeholder="john@example.com" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="!pl-14 h-11 rounded-xl bg-background/50"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input 
                                            id="phone" 
                                            placeholder="+1 (555) 000-0000" 
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="!pl-14 h-11 rounded-xl bg-background/50"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input 
                                            id="password" 
                                            type="password"
                                            placeholder="••••••••" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="!pl-14 h-11 rounded-xl bg-background/50"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input 
                                            id="confirmPassword" 
                                            type="password"
                                            placeholder="••••••••" 
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="!pl-14 h-11 rounded-xl bg-background/50"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="assignedManager">Assigned Project Manager</Label>
                                    <div className="relative">
                                        <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                                        <Select value={assignedManager} onValueChange={setAssignedManager} required>
                                            <SelectTrigger className="!pl-14 h-11 rounded-xl bg-background/50 border-border/50 w-full">
                                                <SelectValue placeholder="Select a manager" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-border/50 shadow-xl overflow-hidden">
                                                {managers.length > 0 ? (
                                                    managers.map((m) => (
                                                        <SelectItem key={m._id} value={m._id} className="focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                                                            {m.firstName} {m.lastName}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="no-managers" disabled className="text-muted-foreground italic">
                                                        No managers available
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-medium pl-1">Selecting a manager is mandatory for account activation.</p>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] mt-4" 
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Create Account"}
                            </Button>
                        </form>
                        
                        <div className="mt-8 text-center text-sm text-muted-foreground">
                            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
                        </div>
                    </CardContent>
                </Card>
                
                <p className="mt-12 text-center text-xs text-muted-foreground font-medium">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
            </motion.div>
        </div>
    );
};

export default SignUp;
