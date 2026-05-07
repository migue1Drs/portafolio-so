interface PageHeaderProps {
  number: string;
  title: string;
  description: string;
}

export function PageHeader({ number, title, description }: PageHeaderProps) {
  return (
    <div className="mb-16">
      <div className="relative overflow-hidden bg-[#1c1c1c]/40 border border-[#30363d] rounded-xl p-8 lg:p-10 shadow-lg backdrop-blur-sm">
        {/* Background glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f5a623] opacity-[0.04] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#58a6ff] opacity-[0.02] rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="relative z-10">
          <span className="inline-block text-[#f5a623] bg-[#f5a62310] px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.3em] font-bold shadow-sm">
            {number}
          </span>
          <h1 className="text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#8b949e] font-extrabold mt-5 mb-5 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-[#a0a0a0] text-base max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
