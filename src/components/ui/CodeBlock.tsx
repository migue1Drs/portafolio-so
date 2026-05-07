interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "c", filename }: CodeBlockProps) {
  return (
    <div className="rounded-xl overflow-hidden bg-[#0d1117] border border-[#30363d] shadow-2xl my-6">
      {/* File header */}
      <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        {filename && (
          <span className="text-xs text-[#8b949e] font-mono">{filename}</span>
        )}
        <span className="ml-auto text-[10px] text-[#484f58] font-mono uppercase">{language}</span>
      </div>

      {/* Code body */}
      <div className="p-4 font-mono text-sm overflow-x-auto">
        <pre className="text-[#c9d1d9] whitespace-pre leading-relaxed">{code}</pre>
      </div>
    </div>
  );
}
