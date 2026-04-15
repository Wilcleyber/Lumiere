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

    if (mode && data && !hasCalled.current) {
      hasCalled.current = true;
      const parsedData = JSON.parse(data);

      let promptTecnico = "";

      if (mode === "7days") {
        promptTecnico = `Analise meu faturamento semanal. Dados: ${JSON.stringify(parsedData)}. Regras de Ouro:
    1. NÃO mostre cálculos matemáticos (somas).
    2. Vá direto aos destaques: Qual serviço brilhou e qual dia foi o ápice.
    3. Use um tom executivo, curto e sofisticado.
    4. Máximo de 3 parágrafos curtos.`;
      } else if (mode === "today") {
      promptTecnico = `Resumo executivo de hoje. Dados: ${JSON.stringify(parsedData)}. Diga o faturamento total e dê um insight rápido sobre o movimento. 
    Sem contas matemáticas expostas, apenas o veredito elegante.`;
      }

    // Passamos o prompt técnico já com os dados injetados
      handleAskAI(promptTecnico);
    }
  }, [searchParams]);

  // 🧠 FUNÇÃO CENTRAL
  async function handleAskAI(question: string) {
    if (isLoading) return;
    setIsLoading(true);
    setAnswer("");

    try {
      const isBotaoFinanceiro = searchParams.get("data") !== null;

    // Se veio do botão, mandamos a pergunta técnica. 
    // Se veio do Input (Chat), "vestimos" a pergunta com luxo.
      const finalPrompt = isBotaoFinanceiro 
      ? question 
      : `Você é a assistente Lumière para uma clínica de estética premium. Responda de forma elegante, curta e profissional à seguinte dúvida da proprietária: ${question}`;

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ content: finalPrompt }],
        // Note que NÃO mandamos contextData aqui no corpo, pois ele já foi injetado no finalPrompt se necessário
        }),
      });

      const result = await res.json();
      setAnswer(result.text || "Sem resposta.");
    } catch {
      setAnswer("Tive um problema ao processar sua solicitação, elegante.");
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
