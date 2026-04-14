// app/api/ai/chat/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // validação básica
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Mensagens inválidas" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      messages.map((m: any) => m.content)
    );

    return NextResponse.json({
      text: result.response.text(),
    });

  } catch (error: any) {
    console.error("Erro API:", error.message);

    return NextResponse.json(
      { error: "IA indisponível." },
      { status: 500 }
    );
  }
}
