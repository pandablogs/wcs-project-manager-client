import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  ArrowLeft, 
  KeyRound, 
  Send, 
  Loader2,
  ShieldCheck,
  Building2
} from "lucide-react";
import { motion } from "framer-motion";

// Premium UI Components
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden py-12 px-4">
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-500/5" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] dark:opacity-[0.04] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="z-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-border/50 shadow-2xl flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground italic">WCS Manager</h1>
        </div>

        <Card className="border-border/50 shadow-2xl bg-card/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden p-2">
          {!isSent ? (
            <>
              <CardHeader className="text-center pb-8 pt-6">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
                   <KeyRound className="w-6 h-6" />
                </div>
                <CardTitle className="text-2xl font-black tracking-tight">Recover Access</CardTitle>
                <CardDescription className="text-sm font-medium">
                  Enter your registered digital address and we'll transmit recovery protocols.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Digital Address</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
                      <Input 
                        id="email" 
                        type="email"
                        placeholder="pm@wcs-manager.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 h-12 rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/20 font-bold"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-xl text-base font-black italic tracking-tight shadow-xl shadow-primary/20 hover:shadow-2xl transition-all active:scale-[0.98] bg-primary group" 
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        TRANSMIT INSTRUCTIONS
                        <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
                
                <div className="mt-8 text-center pt-6 border-t border-border/40">
                    <Link to="/login" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-all">
                        <ArrowLeft className="w-3.5 h-3.5" /> Return to Gateway
                    </Link>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="p-10 text-center space-y-8 py-16">
               <motion.div 
                 initial={{ scale: 0 }} 
                 animate={{ scale: 1 }} 
                 className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto"
               >
                  <ShieldCheck className="w-10 h-10" />
               </motion.div>
               <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight italic">Transmission Successful</h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed px-4">
                    If an account exists for <span className="text-foreground font-bold">{email}</span>, you will receive a secure recovery link shortly.
                  </p>
               </div>
               <Button 
                 variant="outline" 
                 className="w-full h-12 rounded-xl border-border/50 font-bold" 
                 onClick={() => navigate("/login")}
               >
                 Back to Login
               </Button>
            </div>
          )}
        </Card>
        
        <p className="mt-12 text-center text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">
            Secure Identity Protocol &bull; PMC-8827
        </p>
      </motion.div>
    </div>
  );
};

export default ForgetPassword;
