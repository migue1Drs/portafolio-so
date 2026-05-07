interface SectionHeadingProps {
  id: string;
  number: string;
  title: string;
}

export function SectionHeading({ id, number, title }: SectionHeadingProps) {
  return (
    <div id={id} className="scroll-mt-24 mb-6 mt-16 first:mt-0">
      <div className="flex items-center gap-4 border-b border-[#333333] pb-3 relative">
        <div className="absolute left-0 bottom-[-1px] w-24 h-[2px] bg-gradient-to-r from-[#f5a623] to-transparent"></div>
        <span className="text-[#f5a623] font-mono text-sm font-bold bg-[#f5a62315] px-3 py-1 rounded-sm shadow-sm">
          {number}
        </span>
        <h2 className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a0a0a0] font-extrabold tracking-wide">
          {title}
        </h2>
      </div>
    </div>
  );
}
