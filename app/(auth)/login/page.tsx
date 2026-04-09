"use client"; // Precisamos de interação para o botão Demo

import { signIn } from "@/lib/actions/auth";
import Link from "next/link";
import { useRef } from "react";

export default function LoginPage() {
  const formRef = useRef<HTMLFormElement>(null);

  // Função para preencher automaticamente os dados de Demo
  const fillDemoData = () => {
    if (formRef.current) {
      const emailInput = formRef.current.querySelector('input[name="email"]') as HTMLInputElement;
      const passwordInput = formRef.current.querySelector('input[name="password"]') as HTMLInputElement;
      
      if (emailInput && passwordInput) {
        emailInput.value = "demo@lumiere.com";
        passwordInput.value = "Demo1234";
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* BANNER SUPERIOR */}
        <div className="bg-slate-900 p-8 text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter italic">
            Lumière
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            Gestão Inteligente para Clínicas de Estética
          </p>
        </div>

        <div className="p-8 space-y-6">
          <form ref={formRef} action={signIn} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">E-mail Profissional</label>
              <input
                name="email"
                type="email"
                required
                placeholder="exemplo@clinica.com"
                className="w-full border-2 border-slate-100 rounded-xl p-3 text-slate-900 font-medium placeholder:text-slate-400 focus:border-slate-900 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Senha de Acesso</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full border-2 border-slate-100 rounded-xl p-3 text-slate-900 font-medium placeholder:text-slate-400 focus:border-slate-900 focus:outline-none transition-all"
              />
            </div>

            <button className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-xl transition-all shadow-lg active:scale-95">
              ENTRAR NO SISTEMA
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs font-bold uppercase">Ou</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* BOTÃO DEMO - O Diferencial */}
          <button 
            onClick={fillDemoData}
            className="w-full border-2 border-slate-200 hover:border-slate-900 text-slate-600 hover:text-slate-900 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            🚀 Acesso Rápido (Demo)
          </button>

          <p className="text-center text-sm text-slate-500 font-medium">
            Ainda não tem conta?{" "}
            <Link href="/register" className="text-slate-900 font-black hover:underline">
              Criar Cadastro
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
