import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2 } from "lucide-react";

const PremiumLoader = ({ loading = true }) => {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-xl"
        >
          <div className="relative">
            {/* Main Spinner Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 rounded-full border-t-2 border-primary shadow-[0_0_40px_-10px_rgba(var(--primary),0.3)]"
            />
            
            {/* Secondary Opposite Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border-b-2 border-primary/20"
            />

            {/* Center Icon and Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30">
                  <Building2 className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="flex flex-col items-center">
                   <span className="font-display font-black text-xl tracking-tighter text-slate-900 dark:text-white leading-none">
                    WCS <span className="text-primary">PM</span>
                  </span>
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/60 mt-1 leading-none">Initializing</span>
                </div>
              </motion.div>
            </div>

            {/* Animated Orbiting Dot */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),1)]" />
            </motion.div>
          </div>

          {/* Bottom Progress Hint */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-12 flex flex-col items-center gap-3"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
              ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500/50 dark:text-slate-400/30">
              Synchronizing Workspace
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { PremiumLoader };
