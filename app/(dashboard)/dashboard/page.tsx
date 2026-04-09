import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // 📊 TOTAL DE ATIVOS (Pendente e Futuro)
  const { count: totalActive } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")
    .gte("date", todayStart.toISOString());

  // 📅 HOJE
  const { count: todayPending } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")
    .gte("date", todayStart.toISOString())
    .lte("date", todayEnd.toISOString());

  // ⏰ PRÓXIMOS DA FILA
  const { data: upcoming } = await supabase
    .from("appointments")
    .select(`
      *,
      clients ( name )
    `)
    .eq("status", "pending")
    .gte("date", new Date().toISOString())
    .order("date", { ascending: true })
    .limit(5);

  return (
    <div className="space-y-12">
      {/* HEADER SIMPLIFICADO */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Dashboard
        </h1>
        <p className="text-slate-500 font-medium">Bem-vindo à sua central de performance.</p>
      </div>

      {/* CARDS DE RESUMO - Estilo Minimalista de Luxo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative overflow-hidden p-8 rounded-3xl bg-slate-900 text-white shadow-2xl group transition-all hover:scale-[1.02]">
          <div className="relative z-10">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Total Pendente</p>
            <p className="text-6xl font-black mt-2 tracking-tighter">
              {totalActive ?? 0}
            </p>
            <p className="text-sm text-slate-400 mt-4 font-medium italic">Agendamentos ativos aguardando você.</p>
          </div>
          {/* Círculo decorativo sutil no fundo */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-slate-800 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
        </div>

        <div className="p-8 rounded-3xl bg-white border-2 border-slate-100 shadow-xl shadow-slate-200/50 transition-all hover:border-slate-900">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Agendados para Hoje</p>
          <p className="text-6xl font-black text-slate-900 mt-2 tracking-tighter">
            {todayPending ?? 0}
          </p>
          <p className="text-sm text-slate-500 mt-4 font-medium italic">Foco total nos atendimentos de agora.</p>
        </div>
      </div>

      {/* LISTAGEM DOS PRÓXIMOS */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Próximos da Fila</h2>
          <div className="flex-1 h-[2px] bg-slate-100"></div>
        </div>
        
        <div className="grid gap-4">
          {upcoming && upcoming.length > 0 ? (
            upcoming.map((appt) => (
              <div key={appt.id} className="group bg-white border border-slate-100 p-6 rounded-2xl flex justify-between items-center transition-all hover:shadow-lg hover:border-slate-300">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-xl shadow-inner group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    👤
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900 text-lg">{appt.clients?.name}</p>
                    <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
                      <span className="text-slate-300 text-xs">●</span>
                      {new Date(appt.date).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <span className="text-[10px] font-black px-3 py-1 bg-slate-100 text-slate-600 rounded-full uppercase tracking-widest border border-slate-200">
                    Aguardando
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
              <p className="text-slate-400 font-bold italic">Tudo limpo! Nenhum compromisso nas próximas horas.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
