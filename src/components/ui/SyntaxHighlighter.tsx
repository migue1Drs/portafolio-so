export function SyntaxHighlighter({ code, language }: { code: string; language: string }) {
  if (language.toLowerCase() !== "c") {
    return <>{code}</>;
  }

  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Strings (ej. "hola")
  html = html.replace(/(&quot;.*?&quot;|&#39;.*?&#39;|".*?"|'.*?')/g, '<span class="text-[#a5d6ff]">$1</span>');
  
  // Comments (ej. // hola)
  html = html.replace(/(\/\/.*)/g, '<span class="text-[#8b949e] italic">$1</span>');
  
  // Macros (ej. #include <stdio.h>)
  html = html.replace(/(#(?:include|define|ifndef|endif|pragma)\b)/g, '<span class="text-[#ff7b72]">$1</span>');
  
  // System libraries within includes (ej. <stdio.h>)
  html = html.replace(/(&lt;[a-zA-Z0-9_\.\/]+&gt;)/g, '<span class="text-[#a5d6ff]">$1</span>');

  // Reserved keywords
  const keywords = "int|void|char|return|if|else|while|for|struct|pid_t|mode_t|const|switch|case|break|continue|default|long|short|unsigned|signed|size_t|ssize_t|NULL|static|extern";
  const kwRegex = new RegExp(`\\b(${keywords})\\b`, "g");
  html = html.replace(kwRegex, '<span class="text-[#ff7b72]">$1</span>');

  // Functions (ej. printf, malloc, fork)
  html = html.replace(/([a-zA-Z_]\w*)(?=\s*\()/g, '<span class="text-[#d2a8ff]">$1</span>');
  
  // Numbers
  html = html.replace(/\b(\d+)\b/g, '<span class="text-[#79c0ff]">$1</span>');

  return (
    <pre 
      className="text-[#c9d1d9] whitespace-pre leading-relaxed" 
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}
