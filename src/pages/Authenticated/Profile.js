import React, { useEffect, useState } from "react";
import userServices from "../../services/userServices";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Camera,
  ChevronRight,
  Save,
  RefreshCcw,
  Loader2,
  KeyRound,
  Layout,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Premium UI Components
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { PageHeader } from "../../components/ui/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/Avatar";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await userServices.getProfile();
      if (response?.user) {
        setFormData({
          firstName: response.user.firstName || "",
          lastName: response.user.lastName || "",
          email: response.user.email || "",
          phone: response.user.phone || "",
        });
      }
    } catch (error) {
      toast.error("Failed to synchronize profile metadata.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      setLocalLoading(true);
      const response = await userServices.updateProfile(formData);
      toast.success(response.message || "Profile architecture updated.");
    } catch (error) {
      toast.error("Failed to commit profile revisions.");
    } finally {
      setLocalLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning("All password fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      toast.warning("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    try {
      setSecurityLoading(true);
      const response = await userServices.changePassword({ currentPassword, newPassword });
      toast.success(response?.message || "Credentials rotated successfully.");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to rotate credentials.");
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleRevert = async (e) => {
    e.preventDefault();
    await fetchProfile();
    toast.info("Profile fields reverted to saved state.");
  };

  const initials = `${formData.firstName?.charAt(0) || ''}${formData.lastName?.charAt(0) || ''}`.toUpperCase() || "U";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-20"
    >
      <PageHeader
        title="Account Architecture"
        description="Manage your identity settings, security protocols, and communication preferences."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Sidebar - Profile Summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-[2.5rem] border-border/40 shadow-xl overflow-hidden bg-card/30 backdrop-blur-sm">
            <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
              <div className="relative group/avatar">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/40 to-blue-500/40 rounded-full blur opacity-0 group-hover/avatar:opacity-100 transition duration-500" />
                <Avatar className="h-32 w-32 rounded-full border-4 border-background shadow-2xl relative">
                  <AvatarFallback className="bg-slate-900 text-3xl font-black text-white italic">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tighter italic">{formData.firstName} {formData.lastName}</h2>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{formData.email}</p>
              </div>

              <div className="w-full pt-6 border-t border-border/40 space-y-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Security</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Standard</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-border/40 bg-muted/20">
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-bold">Privacy Matrix</h4>
              </div>
              <p className="text-[10px] font-medium leading-relaxed text-muted-foreground italic">
                Your data is encrypted using enterprise-grade structural protocols. System access is logged for audit trails.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Content - Form Tabs */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="general" className="w-full space-y-8">
            <TabsList className="h-14 p-1 rounded-2xl bg-muted/30 border border-border/40 max-w-md">
              <TabsTrigger value="general" className="rounded-xl font-bold text-xs uppercase tracking-widest px-8">General</TabsTrigger>
              <TabsTrigger value="security" className="rounded-xl font-bold text-xs uppercase tracking-widest px-8">Security</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="general" className="focus-visible:ring-0">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="rounded-[2.5rem] border-border/40 shadow-2xl overflow-hidden bg-card/30 backdrop-blur-sm">
                    <CardHeader className="p-10 pb-6 border-b border-border/40">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                          <Layout className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-black italic tracking-tighter">General Metadata</CardTitle>
                          <CardDescription>Primary identity attributes and contact endpoints.</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Given Name</Label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className="h-12 !pl-14 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/20 font-bold"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Family Name</Label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className="h-12 !pl-14 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/20 font-bold"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Digital Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                            <Input
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="h-12 !pl-14 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/20 font-bold"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Communication String</Label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="h-12 !pl-14 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/20 font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-10 pt-4 border-t border-border/10 bg-muted/10 flex justify-end gap-3">
                      <Button variant="ghost" type="button" className="rounded-xl font-bold h-11 px-8" onClick={handleRevert}>
                        <RefreshCcw className="w-4 h-4 mr-2" /> REVERT
                      </Button>
                      <Button className="rounded-xl bg-primary text-white font-black italic h-11 px-10 shadow-lg shadow-primary/20" onClick={handleUpdateProfile} disabled={localLoading}>
                        {localLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        COMMIT CHANGES
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="security" className="focus-visible:ring-0">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="rounded-[2.5rem] border-border/40 shadow-2xl overflow-hidden bg-card/30 backdrop-blur-sm">
                    <CardHeader className="p-10 pb-6 border-b border-border/40">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          <Lock className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-black italic tracking-tighter">Security Protocol</CardTitle>
                          <CardDescription>Rotate credentials and manage session integrity.</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                      <div className="space-y-6 max-w-md">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current Secret</Label>
                          <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                            <Input
                                type={showPasswords.currentPassword ? "text" : "password"}
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                className="h-12 !pl-14 !pr-12 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/20 font-bold"
                              />
                            <button type="button" onClick={() => toggleShowPassword('currentPassword')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors">
                              {showPasswords.currentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">New Secret</Label>
                          <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                            <Input
                                type={showPasswords.newPassword ? "text" : "password"}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="Min. 8 characters"
                                className="h-12 !pl-14 !pr-12 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/20 font-bold"
                              />
                            <button type="button" onClick={() => toggleShowPassword('newPassword')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors">
                              {showPasswords.newPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm Secret</Label>
                          <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                            <Input
                                type={showPasswords.confirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="Re-enter secret"
                                className="h-12 !pl-14 !pr-12 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/20 font-bold"
                              />
                            <button type="button" onClick={() => toggleShowPassword('confirmPassword')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors">
                              {showPasswords.confirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-10 pt-4 border-t border-border/10 bg-muted/10 flex justify-end">
                      <Button
                          className="rounded-xl bg-slate-900 text-white font-black italic h-11 px-10 shadow-xl"
                          onClick={handleChangePassword}
                          disabled={securityLoading}
                        >
                          {securityLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
                          ROTATE CREDENTIALS
                        </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/20 backdrop-blur-sm">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      )}
    </motion.div>
  );
};

export default Profile;
