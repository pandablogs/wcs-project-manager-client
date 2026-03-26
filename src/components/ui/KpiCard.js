import React from 'react';
import { Card } from './Card';
import { twMerge } from 'tailwind-merge';

export const KpiCard = ({ title, value, subValue, trend, trendValue, icon: Icon, iconColorClass }) => {
  return (
    <Card className="p-0 border-none shadow-none bg-transparent">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all duration-300 hover:shadow-premium dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:shadow-premium-dark h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {title}
            </span>
            <div className={twMerge(
              'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
              iconColorClass || 'bg-brand-500/10 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400'
            )}>
              <Icon size={18} />
            </div>
          </div>
          
          <div className="mt-4 flex items-end gap-3">
            <h3 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
              {value}
            </h3>
            {trend && (
              <div className={twMerge(
                'flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-xs font-black uppercase tracking-tighter',
                trend === 'up' 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' 
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
              )}>
                {trend === 'up' ? '+' : '-'}{trendValue}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/40">
           <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
             {subValue}
           </p>
        </div>
      </div>
    </Card>
  );
};
