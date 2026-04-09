"use client";

import { signUp } from "@/lib/actions/auth";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

// 1. Esquema de Validação (O "Contrato" de segurança)
const registerSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  // 2. Função de submissão manual para controlar o estado
  async function onSubmit(data: RegisterData) {
    setLoading(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await signUp(formData);
    
    // Se a sua action de signUp retornar erro (ex: e-mail já existe)
    if (result?.error) {
      setServerError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        <div className="bg-slate-900 p-8 text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter italic">
            Lumière
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            Comece sua jornada na gestão de elite
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-black text-slate-800">Criar Conta</h2>
            <p className="text-slate-500 text-sm">Cadastre-se para organizar sua clínica hoje mesmo.</p>
          </div>

          {/* MENSAGEM DE ERRO DO SERVIDOR (Caso o Supabase rejeite) */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold animate-pulse">
              ❌ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">E-mail Profissional</label>
              <input
                {...register("email")}
                type="email"
                placeholder="exemplo@clinica.com"
                className={`w-full border-2 rounded-xl p-3 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none transition-all ${
                  errors.email ? "border-red-300 bg-red-50" : "border-slate-100 focus:border-slate-900"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Crie uma Senha</label>
              <input
                {...register("password")}
                type="password"
                placeholder="No mínimo 6 caracteres"
                className={`w-full border-2 rounded-xl p-3 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none transition-all ${
                  errors.password ? "border-red-300 bg-red-50" : "border-slate-100 focus:border-slate-900"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.password.message}</p>
              )}
            </div>

            <button 
              disabled={loading}
              className={`w-full font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 mt-2 ${
                loading ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900 hover:bg-black text-white"
              }`}
            >
              {loading ? "CRIANDO CONTA..." : "FINALIZAR CADASTRO"}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100">
            <p className="text-center text-sm text-slate-500 font-medium">
              Já possui acesso?{" "}
              <Link href="/login" className="text-slate-900 font-black hover:underline">
                Fazer Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
