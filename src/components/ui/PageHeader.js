import React from "react";
import { motion } from "framer-motion";

const PageHeader = ({ title, description, children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8"
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground font-medium text-lg max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {children}
      </div>
    </motion.div>
  );
};

export { PageHeader };
