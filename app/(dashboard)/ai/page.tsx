"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AIChatContent() {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contextData, setContextData] = useState<any>(null);
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  // Efeito para capturar dados vindos do Financeiro via URL
  useEffect(() => {
    const mode = searchParams.get("mode");
    const data = searchParams.get("data");

    if (mode && data) {
      const parsedData = JSON.parse(data);
      setContextData(parsedData);
      
      const prompt = mode === "7days" 
        ? "Faça uma análise completa dos meus últimos 7 dias de faturamento." 
        : "O que rolou hoje no meu financeiro? Me dê um resumo rápido.";
      
      // Dispara a análise automaticamente se vier do botão do financeiro
      handleAskAI(prompt, parsedData);
    }
  }, [searchParams]);

  async function handleAskAI(question: string, dataToUse?: any) {
    setIsLoading(true);
    setAnswer("");

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ content: question }],
          contextData: dataToUse || contextData, // Usa o dado da URL ou o que já está no estado
        }),
      });

      const result = await response.json();
      setAnswer(result.text || "Desculpe, não consegui processar agora.");
    } catch (error) {
      setAnswer("Erro ao conectar com a inteligência Lumière.");
    } finally {
      setIsLoading(false);
    }
  }

  const suggestions = [
    "Análise de faturamento semanal",
    "Qual meu ticket médio atual?",
    "Sugestões para aumentar vendas",
  ];

  return (
    <div className="space-y-12 max-w-4xl">
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
          Sua consultoria de negócios integrada ao seu banco de dados.
        </p>
      </div>

      <div className="grid gap-8">
        <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <form 
            ref={formRef} 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAskAI(formData.get("question") as string);
              e.currentTarget.reset(); // Limpa o campo após enviar
            }} 
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">
                O que você deseja saber?
              </label>
              <div className="relative">
                <input
                  name="question"
                  required
                  placeholder="Ex: Como foi meu desempenho essa semana?"
                  className="w-full border-2 border-slate-100 rounded-2xl p-4 text-slate-900 font-medium focus:border-slate-900 focus:outline-none transition-all pr-16 shadow-inner bg-slate-50/50"
                />
                <button 
                  disabled={isLoading}
                  className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-black text-white px-4 rounded-xl transition-all active:scale-95 disabled:bg-slate-300"
                >
                  {isLoading ? "..." : "⚡"}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => handleAskAI(text)}
                  className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-900 hover:text-white transition-all border border-slate-200"
                >
                  {text}
                </button>
              ))}
            </div>
          </form>
        </section>

        {(answer || isLoading) && (
          <div className={`p-8 rounded-[2.5rem] transition-all duration-500 border ${
            isLoading ? "bg-slate-50 border-slate-200 animate-pulse" : "bg-slate-900 border-slate-800 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]"
          }`}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
              <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
                Análise do Gestor
              </span>
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-3 bg-slate-200 rounded-full w-full"></div>
                <div className="h-3 bg-slate-200 rounded-full w-5/6"></div>
                <div className="h-3 bg-slate-200 rounded-full w-4/6"></div>
              </div>
            ) : (
              <div className="text-slate-100 text-lg font-medium leading-relaxed whitespace-pre-wrap">
                {answer}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// O Next.js exige Suspense ao usar useSearchParams em Client Components
export default function AIPage() {
  return (
    <Suspense fallback={<div className="p-10 font-black animate-pulse">CARREGANDO INTELIGÊNCIA...</div>}>
      <AIChatContent />
    </Suspense>
  );
}
