import { ReactNode } from "react";

interface ReflectionBoxProps {
  children: ReactNode;
}

export function ReflectionBox({ children }: ReflectionBoxProps) {
  return (
    <div className="my-8 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-l-4 border-[#f5a623] rounded-r-lg p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(245,166,35,0.12)]">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#f5a623] text-lg">💡</span>
        <h4 className="text-[#f5a623] font-bold text-sm uppercase tracking-widest">
          Reflexión y Aprendizaje
        </h4>
      </div>
      <div className="text-[#b0b8c4] text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
