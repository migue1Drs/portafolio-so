"use client";

import { motion } from "framer-motion";
import { SpotlightCard } from "./SpotlightCard";

interface PageHeaderProps {
  number: string;
  title: string;
  description: string;
}

export function PageHeader({ number, title, description }: PageHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-16"
    >
      <SpotlightCard className="bg-[#1c1c1c]/40 border border-[#30363d] rounded-xl p-8 lg:p-10 shadow-lg backdrop-blur-sm">
        {/* Background ambient glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f5a623] opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#58a6ff] opacity-[0.02] rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10">
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block text-[#f5a623] bg-[#f5a62310] px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.3em] font-bold shadow-sm"
          >
            {number}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#8b949e] font-extrabold mt-5 mb-5 tracking-tight leading-tight"
          >
            {title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-[#a0a0a0] text-base max-w-2xl leading-relaxed"
          >
            {description}
          </motion.p>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
