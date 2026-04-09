"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // UX: Função refinada para links ativos com padrão Lumière
  function linkClass(path: string) {
    const isActive = pathname === path;

    return `
      flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200
      ${isActive 
        ? "bg-white text-slate-900 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] scale-105" 
        : "text-slate-400 hover:text-white hover:bg-slate-900 hover:translate-x-1"}
    `;
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* SIDEBAR - Padrão Black Estética */}
      <aside className="w-72 bg-slate-900 text-white p-8 flex flex-col shadow-[10px_0_30px_-15px_rgba(0,0,0,0.3)] z-10">
        
        {/* LOGO LUMIÈRE */}
        <div className="mb-12">
          <h2 className="text-3xl font-black tracking-tighter italic leading-none">
            Lumière
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-2">
            Professional Management
          </p>
        </div>

        {/* NAV - Caminhos corrigidos para evitar 404 */}
        <nav className="flex-1 space-y-3">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            <span className="text-xl">📊</span> Dashboard
          </Link>

          <Link href="/appointments" className={linkClass("/appointments")}>
            <span className="text-xl">📅</span> Agendamentos
          </Link>

          <Link href="/clients" className={linkClass("/clients")}>
            <span className="text-xl">👥</span> Clientes
          </Link>

          <Link href="/ai" className={linkClass("/ai")}>
            <span className="text-xl">🤖</span> Assistente IA
          </Link>
        </nav>

        {/* FOOTER - Perfil e Sair */}
        <div className="pt-8 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">
              
            </div>
            <div className="overflow-hidden text-ellipsis">
              <p className="text-xs font-bold truncate"></p>
              <p className="text-[10px] text-slate-500 truncate"></p>
            </div>
          </div>

          <form action={signOut}>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
              🚪 Sair do Sistema
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 bg-slate-50/50 overflow-y-auto">
        {/* Adicionei um degradê sutil no topo para profundidade */}
        <div className="h-2 w-full bg-gradient-to-b from-slate-200/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
