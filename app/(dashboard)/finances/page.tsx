import { createClient } from "@/lib/supabase/server";
import { FinanceChart } from "@/components/ui/finance-chart";
import Link from "next/link";

// 🧠 Função ULTRA-compacta (economia de tokens)
function sanitizeFinanceData(data: any[]) {
  if (!data) return [];

  return data.map(item => ({
    v: Number(item.final_price) || 0,
    d: item.completed_at
      ? new Date(item.completed_at).toISOString().split("T")[0]
      : "",
  }));
}

export default async function FinancesPage() {
  const supabase = createClient();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30)).toISOString();

  // 💰 BUSCA
  const { data: completedAppts } = await supabase
    .from("appointments")
    .select(`
      final_price, 
      completed_at, 
      services ( name ), 
      clients ( name )
    `)
    .eq("status", "completed")
    .gte("completed_at", thirtyDaysAgo)
    .order("completed_at", { ascending: true });

  const data = completedAppts || [];

  // 🧠 IA (dados mínimos)
  const sanitizedData = sanitizeFinanceData(data);

  const todayData = sanitizeFinanceData(
    data.filter(
      a =>
        new Date(a.completed_at!).toDateString() ===
        new Date().toDateString()
    )
  );

  // 📊 GRÁFICO (7 dias)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }).reverse();

  const chartData = last7Days.map(dateStr => ({
    date: dateStr,
    value:
      data
        .filter(
          a =>
            new Date(a.completed_at!).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
            }) === dateStr
        )
        .reduce((sum, a) => sum + (Number(a.final_price) || 0), 0) || 0,
  }));

  // 🧮 MÉTRICAS
  const totalRevenue = data.reduce(
    (acc, curr) => acc + (Number(curr.final_price) || 0),
    0
  );

  const totalServices = data.length;

  const ticketAverage =
    totalServices > 0 ? totalRevenue / totalServices : 0;

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-black text-slate-900">Financeiro</h1>
        <p className="text-slate-500 italic">
          Inteligência de faturamento (30 dias)
        </p>
      </div>

      {/* 🤖 IA */}
      <div className="flex gap-4">
        <Link
          href={`/ai?mode=7days&data=${encodeURIComponent(
            JSON.stringify(sanitizedData)
          )}`}
          className="flex-1 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:scale-[1.02] transition"
        >
          <p className="text-xs font-bold text-emerald-600">IA Insight</p>
          <h3 className="text-slate-900">Análise 7 dias →</h3>
        </Link>

        <Link
          href={`/ai?mode=today&data=${encodeURIComponent(
            JSON.stringify(todayData)
          )}`}
          className="flex-1 p-4 rounded-2xl bg-slate-900 text-white hover:scale-[1.02] transition"
        >
          <p className="text-xs opacity-60">IA Insight</p>
          <h3 className="font-bold">Hoje →</h3>
        </Link>
      </div>

      {/* 📊 GRÁFICO */}
      <FinanceChart data={chartData} />

      {/* 📦 CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 text-white">
          <p className="text-xs opacity-60">Faturamento</p>
          <p className="text-3xl font-black text-emerald-400">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalRevenue)}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border">
          <p className="text-xs text-slate-500">Ticket Médio</p>
          <p className="text-3xl font-black">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(ticketAverage)}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border">
          <p className="text-xs text-slate-500">Serviços</p>
          <p className="text-3xl font-black">{totalServices}</p>
        </div>
      </div>

      {/* 📄 TABELA */}
      <section>
        <h2 className="text-xl font-black mb-4">Extrato</h2>

        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {data.length ? (
                [...data].reverse().map((item, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-4 text-slate-600">
                      {new Date(item.completed_at!).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-4 font-semibold text-slate-900">
                      {(item.clients as any)?.name}
                    </td>
                    <td className="p-4 text-slate-600 italic">
                      {(item.services as any)?.name}
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-600">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.final_price || 0)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    Nenhum faturamento
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
