"use client";

import { useRef, useState, ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export function SpotlightCard({ children, className = "" }: { children: ReactNode, className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      whileHover="hover"
      initial="initial"
      className={`relative overflow-hidden rounded-sm ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px z-10"
        variants={{
          initial: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(245,166,35,0.15),
              transparent 40%
            )
          `,
        }}
      />
      {children}
    </motion.div>
  );
}
