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
      <motion.div 
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="bg-[#161b22] border border-[#30363d] hover:border-[#4b535d] hover:shadow-[0_4px_20px_rgba(245,166,35,0.05)] rounded-lg p-6 md:p-8 relative overflow-hidden transition-all group"
      >
        {/* Acento superior sutil (animado) */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#30363d]">
          <motion.div 
            initial={{ width: "0%" }}
            whileInView={{ width: "25%" }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="h-full bg-[#f5a623] group-hover:w-1/2 group-hover:bg-[#ffd33d] transition-all duration-500 ease-out"
          ></motion.div>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#f5a623] group-hover:shadow-[0_0_8px_rgba(245,166,35,0.8)] transition-shadow duration-300"></span>
          <h4 className="text-white font-bold text-sm md:text-base uppercase tracking-widest">
            Reflexión y Aprendizaje
          </h4>
        </div>
        
        <div className="text-[#8b949e] text-sm md:text-base leading-relaxed space-y-4">
          {children}
        </div>
      </motion.div>
    </motion.div>
 );
}
