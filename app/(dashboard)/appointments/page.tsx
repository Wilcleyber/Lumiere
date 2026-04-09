import { createClient } from "@/lib/supabase/server";
import {
  deleteAppointmentAction,
  updateAppointmentStatus,
} from "@/lib/actions/appointments";
import { AppointmentForm } from "@/components/forms/appointment-form";

export default async function AppointmentsPage() {
  const supabase = createClient();

  // Buscamos os agendamentos (Join com clients)
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      *,
      clients ( name )
    `)
    .eq("status", "pending")
    .order("date", { ascending: true });

  // Lista de clientes para o Form
  const { data: clients } = await supabase.from("clients").select("id, name");

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Agendamentos
        </h1>
        <p className="text-slate-500 font-medium">Controle o fluxo de atendimentos com precisão.</p>
      </div>

      {/* 🚀 FORM CARD - Padrão Lumière */}
      <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
          <h2 className="text-xl font-bold text-slate-800">Novo Agendamento</h2>
        </div>
        <AppointmentForm clients={clients || []} />
      </section>

      {/* LISTA DE AGENDAMENTOS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Próximos Horários</h2>
          <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {appointments?.length || 0} Pendentes
          </span>
        </div>
        
        {appointments?.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <p className="text-slate-400 font-bold italic text-lg">
              Sua agenda está livre para novos clientes! ☕
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {appointments?.map((appt) => {
              const isExpired = new Date(appt.date) < new Date();

              return (
                <div
                  key={appt.id}
                  className={`relative group rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between transition-all border-2 ${
                    isExpired
                      ? "border-orange-200 bg-orange-50/30 shadow-sm"
                      : "bg-white border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-lg"
                  }`}
                >
                  {/* INFO PRINCIPAL */}
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border ${
                      isExpired ? "bg-orange-100 border-orange-200 text-orange-700" : "bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900"
                    } transition-all`}>
                      <span className="text-[10px] font-black uppercase leading-none">
                        {new Date(appt.date).toLocaleString("pt-BR", { month: "short" })}
                      </span>
                      <span className="text-xl font-black leading-none mt-1">
                        {new Date(appt.date).getDate()}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-extrabold text-xl text-slate-900">
                          {appt.clients?.name}
                        </p>
                        {isExpired && (
                          <span className="animate-pulse bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            Atrasado
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="text-sm font-black text-slate-600 flex items-center gap-1">
                          🕒 {new Date(appt.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {appt.notes && (
                          <span className="text-sm text-slate-400 italic">
                            — {appt.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* PAINEL DE AÇÕES - Muito mais robusto */}
                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className="flex gap-2 p-1 bg-white/50 rounded-2xl border border-slate-200 shadow-inner">
                      <form action={updateAppointmentStatus.bind(null, appt.id, "confirmed")}>
                        <button
                          title="Marcar como Concluído"
                          className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 hover:border-emerald-600 shadow-sm active:scale-90"
                        >
                          ✔
                        </button>
                      </form>

                      <form action={updateAppointmentStatus.bind(null, appt.id, "canceled")}>
                        <button
                          title="Cancelar"
                          className="w-12 h-12 flex items-center justify-center rounded-xl bg-white text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-100 hover:border-rose-500 shadow-sm active:scale-90"
                        >
                          ✖
                        </button>
                      </form>
                    </div>

                    <form action={deleteAppointmentAction.bind(null, appt.id)}>
                      <button
                        className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 transition-all hover:bg-red-50 rounded-xl"
                        title="Remover permanentemente"
                      >
                        🗑
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
