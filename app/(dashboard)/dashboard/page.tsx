import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();

  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  ).toISOString();

  const todayEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  ).toISOString();

  // 📊 TOTAL PENDENTE
  const { count: totalActive } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // 📅 HOJE
  const { count: todayCount } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")
    .gte("date", todayStart)
    .lte("date", todayEnd);

  // ✅ ATENDIDOS HOJE
  const { count: attendedToday } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed")
    .gte("completed_at", todayStart)
    .lte("completed_at", todayEnd);

  // ⏰ PRÓXIMOS
  const { data: upcoming } = await supabase
    .from("appointments")
    .select(`
      *,
      clients ( name ),
      services ( name, price )
    `)
    .eq("status", "pending")
    .gte("date", now.toISOString())
    .order("date", { ascending: true })
    .limit(5);

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Dashboard
          </h1>
          <p className="text-slate-500 font-medium italic">
            Visão operacional Lumière.
          </p>
        </div>

        <div className="text-right bg-emerald-50 px-6 py-2 rounded-2xl border border-emerald-100">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
            Atendidos Hoje
          </p>
          <p className="text-2xl font-black text-emerald-700">
            {attendedToday ?? 0}{" "}
            <span className="text-sm font-medium">clientes</span>
          </p>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
            Pendente Geral
          </p>
          <p className="text-6xl font-black mt-2 tracking-tighter">
            {totalActive ?? 0}
          </p>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 shadow-xl">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
            Restantes para Hoje
          </p>
          <p className="text-6xl font-black text-slate-900 mt-2 tracking-tighter">
            {todayCount ?? 0}
          </p>
        </div>
      </div>

      {/* PRÓXIMOS */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Próximos da Fila
          </h2>
          <div className="flex-1 h-[2px] bg-slate-100"></div>
        </div>

        <div className="grid gap-4">
          {upcoming && upcoming.length > 0 ? (
            upcoming.map((appt) => {
              const apptDate = new Date(appt.date);
              const isToday =
                apptDate.toDateString() === new Date().toDateString();

              return (
                <div
                  key={appt.id}
                  className="group bg-white border border-slate-100 p-6 rounded-[2rem] flex justify-between items-center transition-all hover:shadow-2xl hover:border-slate-300"
                >
                  <div className="flex items-center gap-8">
                    {/* 🔥 DATA DINÂMICA */}
                    <div className="flex flex-col items-center justify-center min-w-[80px] py-3 bg-slate-900 text-white rounded-2xl shadow-lg">
                      <span
                        className={`text-[10px] font-black uppercase ${
                          isToday ? "text-emerald-400" : "opacity-60"
                        }`}
                      >
                        {isToday
                          ? "Hoje"
                          : apptDate.toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                            })}
                      </span>

                      <span className="text-xl font-black tracking-tighter">
                        {apptDate.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* INFO */}
                    <div>
                      <p className="font-black text-2xl text-slate-900 tracking-tighter">
                        {(appt.clients as any)?.name}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-slate-500">
                          {(appt.services as any)?.name}
                        </span>

                        <span className="text-slate-300">|</span>

                        <span className="text-sm font-medium text-slate-400 italic">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format((appt.services as any)?.price || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ICON */}
                  <div className="hidden md:block">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-300 group-hover:text-indigo-500 transition-colors">
                      👤
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
              <p className="text-slate-400 font-bold italic">
                Nenhum atendimento pendente no momento.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
