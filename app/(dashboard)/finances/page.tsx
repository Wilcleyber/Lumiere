import { createClient } from "@/lib/supabase/server";
import { FinanceChart } from "@/components/ui/finance-chart";
import Link from "next/link";

// 🧠 Função de limpeza (ESSENCIAL pra IA + economia de tokens)
function sanitizeFinanceData(data: any[]) {
  return data.map(item => ({
    price: Number(item.final_price) || 0,
    date: item.completed_at,
    service: item.services?.name || "",
  }));
}

export default async function FinancesPage() {
  const supabase = createClient();

  const now = new Date();
  const thirtyDaysAgoDate = new Date();
  thirtyDaysAgoDate.setDate(now.getDate() - 30);
  const thirtyDaysAgo = thirtyDaysAgoDate.toISOString();

  // 💰 BUSCA DE DADOS
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

  // 🧠 DADOS LIMPOS PARA IA
  const sanitizedData = sanitizeFinanceData(completedAppts || []);

  const todayData = sanitizeFinanceData(
    (completedAppts || []).filter(
      a =>
        new Date(a.completed_at!).toDateString() ===
        new Date().toDateString()
    )
  );

  // 📊 GRÁFICO (7 dias)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  }).reverse();

  const chartData = last7Days.map(dateStr => {
    const totalDay = completedAppts
      ?.filter(
        a =>
          new Date(a.completed_at!).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
          }) === dateStr
      )
      .reduce((sum, a) => sum + (Number(a.final_price) || 0), 0);

    return { date: dateStr, value: totalDay || 0 };
  });

  // 🧮 CÁLCULOS
  const totalRevenue =
    completedAppts?.reduce(
      (acc, curr) => acc + (Number(curr.final_price) || 0),
      0
    ) || 0;

  const totalServices = completedAppts?.length || 0;

  const ticketAverage =
    totalServices > 0 ? totalRevenue / totalServices : 0;

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Financeiro
        </h1>
        <p className="text-slate-500 font-medium italic">
          Inteligência de faturamento e fluxo de caixa (Últimos 30 dias).
        </p>
      </div>

      {/* 🔥 IA INSIGHTS (NOVA FEATURE) */}
      <div className="flex gap-4 mb-4">
        <Link
          href={{
            pathname: "/ai",
            query: {
              mode: "7days",
              data: JSON.stringify(sanitizedData),
            },
          }}
          className="flex-1 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 hover:scale-[1.02] transition-all group"
        >
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
            IA Insight
          </p>
          <h3 className="font-bold text-slate-900">
            Análise Completa (7 dias) →
          </h3>
        </Link>

        <Link
          href={{
            pathname: "/ai",
            query: {
              mode: "today",
              data: JSON.stringify(todayData),
            },
          }}
          className="flex-1 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 hover:scale-[1.02] transition-all"
        >
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">
            IA Insight
          </p>
          <h3 className="font-bold text-white">
            O que rolou hoje? →
          </h3>
        </Link>
      </div>

      {/* 📊 GRÁFICO */}
      <FinanceChart data={chartData} />

      {/* 📦 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Faturamento Total (30d)
          </p>
          <p className="text-4xl font-black mt-2 text-emerald-400 tracking-tighter">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalRevenue)}
          </p>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 shadow-xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Ticket Médio
          </p>
          <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(ticketAverage)}
          </p>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 shadow-xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Serviços Concluídos
          </p>
          <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">
            {totalServices}
          </p>
        </div>
      </div>

      {/* 📄 TABELA */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-800">
          Extrato de Recebimentos
        </h2>

        <div className="bg-white rounded-[2rem] border overflow-hidden">
          <table className="w-full">
            <tbody>
              {completedAppts?.length ? (
                [...completedAppts].reverse().map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-6 font-medium text-slate-600">
                      {new Date(item.completed_at!).toLocaleDateString(
                        "pt-BR"
                      )}
                    </td>
                    <td className="p-6 font-semibold text-slate-900">{(item.clients as any)?.name}</td>
                    <td className="p-6 text-slate-600 italic">{(item.services as any)?.name}</td>
                    <td className="text-right font-bold text-emerald-600">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.final_price || 0)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-10 text-center">
                    Nenhum faturamento.
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
