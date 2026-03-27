import React, { useEffect } from "react";
import { Card, CardContent } from "./Card";
import { motion, animate } from "framer-motion";

const CountUpValue = ({ value }) => {
  const [displayValue, setDisplayValue] = React.useState("0");
  
  const isCurrency = typeof value === 'string' && value.startsWith('$');
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^0-9.]/g, ''));
  const isNanValue = isNaN(numericValue) && typeof value === 'string';

  const prefix = typeof value === 'string' ? value.match(/^[^0-9]*/)?.[0] || "" : "";
  const suffix = typeof value === 'string' ? value.match(/[a-zA-Z%]*$/)?.[0] || "" : "";
  
  useEffect(() => {
    if (isNanValue) return;
    const controls = animate(0, numericValue, { 
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (isCurrency) {
          setDisplayValue(latest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        } else {
          if (numericValue % 1 === 0) setDisplayValue(Math.round(latest).toLocaleString());
          else setDisplayValue(latest.toFixed(1));
        }
      }
    });
    return controls.stop;
  }, [numericValue, isCurrency]);

  return (
    <span>
      {isNanValue ? value : (
        <>
          {prefix}{displayValue}{suffix}
        </>
      )}
    </span>
  );
};

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
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary transition-colors duration-300">
              <Icon className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold tracking-tight text-foreground">
              <CountUpValue value={value} />
            </span>
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
