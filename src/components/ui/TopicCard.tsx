import Image from "next/image";
import { ReactNode } from "react";

interface TopicCardProps {
  title: string;
  category?: string;
  date?: string;
  imageUrl?: string;
  children?: ReactNode;
  actionText?: string;
}

export function TopicCard({
  title,
  category = "SISTEMAS OPERATIVOS",
  date,
  imageUrl,
  children,
  actionText = "LEER MÁS",
}: TopicCardProps) {
  return (
    <div className="bg-[#1c1c1c] border border-[#333333] hover:border-[#f5a623] transition-colors duration-300 rounded-sm overflow-hidden flex flex-col group h-full">
      {/* Image Header */}
      {imageUrl ? (
        <div className="relative h-48 w-full overflow-hidden bg-[#1c1c1c]">
          {/* Fallback pattern if no actual image is passed, using a placeholder logic for now */}
          <div className="absolute inset-0 opacity-50 group-hover:opacity-80 transition-opacity duration-300">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#252525] to-transparent"></div>
        </div>
      ) : (
        <div className="h-2 w-full bg-gradient-to-r from-[#f5a623] to-[#d48810]"></div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center text-[10px] uppercase tracking-widest text-[#888888] mb-2 font-bold">
          <span className="text-[#f5a623] mr-2">{category}</span>
          {date && <span>• {date}</span>}
        </div>
        
        <h3 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-[#f5a623] transition-colors">
          {title}
        </h3>

        <div className="text-[#a0a0a0] text-sm leading-relaxed mb-5 flex-1 font-medium">
          {children}
        </div>

        {/* Action Button */}
        <button className="self-start mt-auto bg-[#333333] hover:bg-[#f5a623] hover:text-[#111111] text-white text-[10px] font-bold py-2 px-5 rounded-sm transition-all duration-300 uppercase tracking-widest">
          {actionText}
        </button>
      </div>
    </div>
  );
}
