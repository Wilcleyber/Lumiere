"use server";

export async function askAI(formData: FormData) {
  const question = (formData.get("question") as string).toLowerCase();

  // 🧠 Respostas simuladas
  if (question.includes("hoje")) {
    return { answer: "Você tem agendamentos hoje. Verifique sua agenda." };
  }

  if (question.includes("cliente")) {
    return { answer: "Você pode gerenciar seus clientes na aba de clientes." };
  }

  if (question.includes("cancelar")) {
    return { answer: "Você pode cancelar um agendamento clicando no botão vermelho." };
  }

  return {
    answer: "Ainda estou aprendendo! Em breve serei mais inteligente 😄",
  };
}
