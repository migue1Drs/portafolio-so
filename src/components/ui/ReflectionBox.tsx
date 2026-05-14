"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ReflectionBoxProps {
 children: ReactNode;
}

export function ReflectionBox({ children }: ReflectionBoxProps) {
 return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="my-10"
    >
      <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 md:p-8 relative overflow-hidden">
        {/* Acento superior sutil */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#30363d]">
          <div className="w-1/4 h-full bg-[#f5a623]"></div>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#f5a623]"></span>
          <h4 className="text-white font-bold text-sm md:text-base uppercase tracking-widest">
            Reflexión y Aprendizaje
          </h4>
        </div>
        
        <div className="text-[#8b949e] text-sm md:text-base leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </motion.div>
 );
}
