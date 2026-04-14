// lib/utils/ai-cleaner.ts

export function sanitizeFinanceData(appts: any[]) {
  if (!appts) return [];

  return appts.map(a => ({
    d: new Date(a.completed_at).toLocaleDateString("pt-BR", { weekday: 'short', day: '2-digit' }), // Ex: "seg, 13"
    s: a.services?.name?.substring(0, 15), // Nome do serviço encurtado
    v: a.final_price, // Valor
    c: a.clients?.name?.split(' ')[0] // Só o primeiro nome do cliente
  }));
}
