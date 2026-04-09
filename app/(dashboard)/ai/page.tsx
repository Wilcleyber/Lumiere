"use client";

import { useState, useRef } from "react";
import { askAI } from "@/lib/actions/ai";

export default function AIPage() {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setAnswer("");
    const res = await askAI(formData);
    setAnswer(res?.answer || "Desculpe, não consegui processar essa informação agora.");
    setIsLoading(false);
  }

  // Sugestões focadas no negócio de estética
  const suggestions = [
    "Quais os agendamentos de hoje?",
    "Quantos clientes cadastrados eu tenho?",
    "Resuma minha agenda de amanhã.",
  ];

  const handleSuggestion = (text: string) => {
    if (formRef.current) {
      const input = formRef.current.querySelector('input[name="question"]') as HTMLInputElement;
      if (input) {
        input.value = text;
        // Opcional: submeter automaticamente
        // formRef.current.requestSubmit();
      }
    }
  };

  return (
    <div className="space-y-12 max-w-4xl">
      {/* HEADER IA */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Lumière <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-400">Intelligence</span>
          </h1>
          <span className="bg-slate-900 text-[10px] text-white px-2 py-1 rounded font-black tracking-widest animate-pulse">
            AI ACTIVE
          </span>
        </div>
        <p className="text-slate-500 font-medium italic mt-2">
          Consulte dados, analise sua agenda e tome decisões baseadas em dados.
        </p>
      </div>

      {/* ÁREA DE INTERAÇÃO */}
      <div className="grid gap-8">
        <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <form ref={formRef} action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">
                O que você deseja saber?
              </label>
              <div className="relative">
                <input
                  name="question"
                  required
                  placeholder="Ex: Qual o meu volume de atendimentos hoje?"
                  className="w-full border-2 border-slate-100 rounded-2xl p-4 text-slate-900 font-medium placeholder:text-slate-400 focus:border-slate-900 focus:outline-none transition-all pr-16 shadow-inner bg-slate-50/50"
                />
                <button 
                  disabled={isLoading}
                  className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-black text-white px-4 rounded-xl transition-all active:scale-95 disabled:bg-slate-300"
                >
                  {isLoading ? "..." : "⚡"}
                </button>
              </div>
            </div>

            {/* QUICK SUGGESTIONS */}
            <div className="flex flex-wrap gap-2">
              {suggestions.map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => handleSuggestion(text)}
                  className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-900 hover:text-white transition-all border border-slate-200"
                >
                  {text}
                </button>
              ))}
            </div>
          </form>
        </section>

        {/* RESPOSTA DA IA */}
        { (answer || isLoading) && (
          <div className={`p-8 rounded-3xl transition-all duration-500 border ${
            isLoading ? "bg-slate-50 border-slate-200 animate-pulse" : "bg-slate-900 border-slate-800 shadow-2xl"
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
                Análise do Assistente
              </span>
            </div>
            
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ) : (
              <p className="text-slate-100 text-lg font-medium leading-relaxed italic">
                "{answer}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* FOOTER TIPS */}
      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
        <p className="text-emerald-800 text-sm font-medium">
          <strong>Dica Pro:</strong> Você pode perguntar sobre nomes de clientes específicos ou datas para o Lumière localizar rapidamente no seu banco de dados.
        </p>
      </div>
    </div>
  );
}
