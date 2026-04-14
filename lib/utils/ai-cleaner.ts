function sanitizeFinanceData(data: any[]) {
  if (!data) return [];

  return data.map(item => ({
    v: Number(item.final_price) || 0,
    d: item.completed_at
      ? new Date(item.completed_at).toISOString().split("T")[0]
      : "",
  }));
}
