"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const pathname = usePathname();

  // No mostrar en la página de inicio o en lugares donde no sea útil
  if (pathname === "/") return null;

  return (
    <div className="fixed top-20 right-0 lg:right-auto lg:left-0 bottom-0 w-1 bg-transparent z-50 pointer-events-none">
      <motion.div
        className="w-full bg-[#f5a623] origin-top opacity-80"
        style={{ scaleY, height: "100%" }}
      />
    </div>
  );
}
