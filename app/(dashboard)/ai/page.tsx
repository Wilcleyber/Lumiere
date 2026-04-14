"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AIChatContent() {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const hasCalled = useRef(false);

  // 🤖 AUTO EXEC (vindo do Financeiro)
  useEffect(() => {
    const mode = searchParams.get("mode");
    const data = searchParams.get("data");

    if (!mode || !data || hasCalled.current) return;

    hasCalled.current = true;

    const parsedData = JSON.parse(data);

    let prompt = "";

    // 🧠 Estratégia (NOVO)
    if (mode === "strategy") {
      prompt = `
Você é um consultor estratégico da Lumière (clínica premium).

Dados:
${JSON.stringify(parsedData)}

Responda:
- Serviços mais lucrativos
- Oportunidades pouco exploradas
- 1 estratégia prática de crescimento

Seja direto, profissional e acionável.
`;
    }

    // 📊 7 dias
    else if (mode === "7days") {
      prompt = `
Analise meu faturamento:

${JSON.stringify(parsedData)}

Responda:
- Dia mais lucrativo
- Faturamento total
- 1 insight estratégico

Seja direto e use emojis.
`;
    }

    // 📅 Hoje
    else {
      prompt = `
Resumo financeiro do dia:

${JSON.stringify(parsedData)}

Traga:
- Resumo rápido
- Destaque principal

Seja curto e profissional.
`;
    }

    handleAskAI(prompt);
  }, [searchParams]);

  // 🧠 FUNÇÃO CENTRAL
  async function handleAskAI(prompt: string) {
    if (isLoading) return;

    setIsLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ content: prompt }],
        }),
      });

      const result = await res.json();
      setAnswer(result.text || "Sem resposta.");
    } catch {
      setAnswer("Erro ao processar análise.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 p-6">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
          Lumière <span className="text-slate-400">Intelligence</span>
        </h1>
        <p className="text-sm text-slate-600">
          Insights inteligentes do seu negócio
        </p>
      </div>

      {/* INPUT */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const question = form.get("question") as string;

          if (!question.trim()) return;

          const promptChat = `
Você é o assistente Lumière, focado em clínicas de estética premium.

Responda com clareza, sofisticação e objetividade.

Pergunta:
${question}
`;

          handleAskAI(promptChat);
          e.currentTarget.reset();
        }}
        className="space-y-4"
      >
        <div className="relative">
          <input
            name="question"
            placeholder="Pergunte algo sobre sua clínica..."
            className="w-full p-5 rounded-2xl border-2 border-slate-200 text-slate-800 bg-white focus:border-slate-900 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-3 top-3 bottom-3 bg-slate-900 text-white px-6 rounded-xl font-bold"
          >
            {isLoading ? "..." : "Enviar"}
          </button>
        </div>
      </form>

      {/* RESPOSTA */}
      {(answer || isLoading) && (
        <div
          className={`p-8 rounded-[2rem] border transition-all ${
            isLoading
              ? "bg-slate-50 border-slate-200 text-slate-600"
              : "bg-slate-900 border-slate-800 text-white"
          }`}
        >
          {isLoading ? "Analisando..." : answer}
        </div>
      )}
    </div>
  );
}

export default function AIPage() {
  return (
    <Suspense fallback={<div className="p-6">Carregando...</div>}>
      <AIChatContent />
    </Suspense>
  );
}
