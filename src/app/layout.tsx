import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProgressProvider } from "@/lib/progress-context";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portafolio Sistemas Operativos",
  description: "Portafolio de evidencias de Sistemas Operativos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased bg-[#111111] text-[#c9d1d9]`}
    >
      <body className="flex flex-col min-h-screen bg-[#111111]">
        <ProgressProvider>
          <Navbar />

          <div className="flex flex-1 max-w-[1600px] mx-auto w-full relative">
            {/* Contenido principal a la izquierda */}
            <main className="flex-1 w-full bg-[#111111]">
              <div className="px-4 lg:px-8 py-10">
                {children}
              </div>
            </main>
            
            {/* Navegación a la derecha (Sticky) */}
            <div className="hidden lg:block w-80 flex-shrink-0 border-l border-[#333333]">
              <div className="sticky top-20 h-[calc(100vh-5rem)]">
                <Sidebar />
              </div>
            </div>
          </div>
        </ProgressProvider>
      </body>
    </html>
  );
}
