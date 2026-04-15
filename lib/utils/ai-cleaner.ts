function sanitizeFinanceData(data: any[]) {
  if (!data) return [];

  return data.map(item => ({
    v: Number(item.final_price) || 0, // v = valor
    d: item.completed_at
      ? new Date(item.completed_at).toISOString().split("T")[0] // d = data
      : "",
    s: item.services?.name?.substring(0, 15) || "Geral", // s = serviço (máx 15 letras)
  }));
}
