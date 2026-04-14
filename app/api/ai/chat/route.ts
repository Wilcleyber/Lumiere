// app/api/ai/chat/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { messages, contextData } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite", // Ou a versão que você configurou (2.5)
      systemInstruction: `
        Você é o Chief Financial Officer (CFO) de uma clínica de estética de luxo chamada Lumière.
  
        DADOS REAIS DA SEMANA: ${JSON.stringify(contextData)}
  
        Sua missão é analisar os números e entregar:
        1. 📊 RESUMO EXECUTIVO: Faturamento total e ticket médio real.
        2. 🏆 PERFORMANCE DE SERVIÇOS: Qual serviço mais rendeu e qual teve mais volume.
        3. 🔍 INSIGHT ESTRATÉGICO: Identifique um padrão (ex: "Sua terça-feira está vazia" ou      "Clientes de Botox não fazem Limpeza").
        4. 💡 AÇÃO RECOMENDADA: Uma sugestão prática para o dono faturar mais AMANHÃ.

        REGRAS DE OURO:
        - Não seja genérico. Use os nomes dos clientes e valores que estão nos dados.
        - Mantenha o tom de consultoria de alto nível.
        - Se os dados estiverem vazios, motive o usuário a concluir agendamentos para gerar análise.
    `,
    });

    const result = await model.generateContent({
      contents: messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    });

    const response = await result.response;
    
    return NextResponse.json({ text: response.text() });
  } catch (error) {
    console.error("Erro na AI:", error);
    return NextResponse.json({ error: "Falha na análise" }, { status: 500 });
  }
}
