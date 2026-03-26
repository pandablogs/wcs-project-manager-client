import React from "react";
import { Card, CardContent } from "./Card";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, trend, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:border-border transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-muted-foreground tracking-wide">{title}</h3>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <Icon className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold tracking-tight text-foreground">{value}</span>
            {trend !== undefined && trend !== null && (
              <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${trend >= 0 ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400" : "text-rose-600 bg-rose-500/10 dark:text-rose-400"}`}>
                {trend > 0 ? "+" : ""}{trend}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export { StatCard };
