import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';
import { twMerge } from 'tailwind-merge';

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  size = 'md',
  showClose = true
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]'
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={twMerge(
        'relative w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-premium overflow-hidden border border-white/20 dark:border-slate-800 transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-4',
        sizes[size]
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 dark:border-slate-800/60">
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              {title}
            </h3>
          </div>
          {showClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-xl h-10 w-10 p-0 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X size={20} />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="px-8 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
