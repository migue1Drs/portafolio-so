export function LinuxTerminal({
  command,
  output,
  title = "bash",
}: {
  command?: string;
  output: string;
  title?: string;
}) {
  const highlightTerminal = (text: string) => {
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Directorios y rutas
    html = html.replace(/(\/[a-zA-Z0-9_.-]+)+/g, '<span class="text-[#58a6ff] font-bold">$&</span>');
    html = html.replace(/(\b[a-zA-Z0-9_-]+\/)(?=\s|$)/g, '<span class="text-[#58a6ff] font-bold">$1</span>');

    // Archivos .c o binarios
    html = html.replace(/([a-zA-Z0-9_.-]+\.[ch]\b)/g, '<span class="text-[#3fb950]">$1</span>');
    html = html.replace(/(\.\/[a-zA-Z0-9_-]+)/g, '<span class="text-[#3fb950] font-bold">$1</span>');
    
    // Comandos de linux
    html = html.replace(/(gcc|make|ls|pwd|mkdir|rm|cd)\b/g, '<span class="text-[#3fb950]">$1</span>');

    // Permisos ls -l
    html = html.replace(/^(d[rwx-]{9})/gm, '<span class="text-[#58a6ff]">$1</span>');
    html = html.replace(/^(-[rwx-]{9})/gm, '<span class="text-[#c9d1d9]">$1</span>');

    // Estados
    html = html.replace(/(\[INFO\])/g, '<span class="text-[#58a6ff] font-bold">$1</span>');
    html = html.replace(/(\[OK\]|✓)/g, '<span class="text-[#238636] font-bold">$1</span>');
    html = html.replace(/(\[ERROR\]|✗)/g, '<span class="text-[#ff5f56] font-bold">$1</span>');
    
    return html;
  };

  return (
    <div className="rounded-xl overflow-hidden bg-[#0d1117] border border-[#30363d] shadow-2xl my-6">
      {/* Mac/Linux terminal header */}
      <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="mx-auto text-xs text-[#8b949e] font-mono select-none">
          {title}
        </div>
      </div>
      
      {/* Terminal body */}
      <div className="p-4 font-mono text-sm overflow-x-auto whitespace-pre">
        {command && (
          <div className="mb-2">
            <span className="text-[#58a6ff]">user@linux</span>
            <span className="text-white">:</span>
            <span className="text-[#3fb950]">~</span>
            <span className="text-white">$ {command}</span>
          </div>
        )}
        <div className="text-[#c9d1d9]" dangerouslySetInnerHTML={{ __html: highlightTerminal(output) }} />
      </div>
    </div>
  );
}
