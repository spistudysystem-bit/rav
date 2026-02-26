import React from 'react';
import { motion } from 'framer-motion';
import { ThemeConfig } from '../types';

interface CustomCardProps {
  title?: string | React.ReactNode;
  description?: string;
  children: React.ReactNode;
  className?: string;
  themeConfig: ThemeConfig;
  variant?: 'default' | 'compact' | 'glass';
  showEnergyLine?: boolean;
}

const CustomCard: React.FC<CustomCardProps> = ({ 
  title, 
  description, 
  children, 
  className = '', 
  themeConfig,
  variant = 'default',
  showEnergyLine = false
}) => {
  const baseClasses = "relative overflow-hidden backdrop-blur-3xl shadow-4xl transition-all duration-500";
  
  const variantClasses = {
    default: `p-12 rounded-[4rem] bg-slate-900/60 border ${themeConfig.accent}`,
    compact: `p-10 rounded-[3rem] bg-black/60 border ${themeConfig.border} shadow-3xl`,
    glass: `p-16 md:p-24 rounded-[5rem] bg-slate-900/50 border ${themeConfig.accent} space-y-16`
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {showEnergyLine && (
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent ${themeConfig.primary}`} />
      )}
      
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <div className="mb-2">
              {typeof title === 'string' ? (
                <h3 className={`font-tech ${themeConfig.primary} uppercase tracking-widest text-[10px]`}>{title}</h3>
              ) : title}
            </div>
          )}
          {description && (
            <p className="text-sm font-serif italic text-slate-400 leading-relaxed">{description}</p>
          )}
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default CustomCard;
