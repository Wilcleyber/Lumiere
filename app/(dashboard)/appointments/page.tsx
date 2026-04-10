import { createClient } from "@/lib/supabase/server";
import {
  deleteAppointmentAction,
  updateAppointmentStatus,
} from "@/lib/actions/appointments";
import { AppointmentForm } from "@/components/forms/appointment-form";

export default async function AppointmentsPage() {
  const supabase = createClient();

  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      *,
      clients ( name )
    `)
    .eq("status", "pending")
    .order("date", { ascending: true });

  const { data: clients } = await supabase.from("clients").select("id, name");

  const safeAppointments = appointments || [];

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Agendamentos
        </h1>
        <p className="text-slate-500 font-medium italic">
          Controle o fluxo de atendimentos com precisão Lumière.
        </p>
      </div>

      {/* FORM - Novo Agendamento */}
      <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
          <h2 className="text-xl font-bold text-slate-800">
            Novo Agendamento
          </h2>
        </div>
        <AppointmentForm clients={clients || []} />
      </section>

      {/* LISTA DE AGENDAMENTOS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Próximos Horários
          </h2>
          <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
            {safeAppointments.length} Pendentes
          </span>
        </div>

        {safeAppointments.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <p className="text-slate-400 font-bold italic text-lg">
              Sua agenda está livre para novos clientes! ☕
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {safeAppointments.map((appt) => {
              const date = new Date(appt.date);
              const isExpired = date < new Date();

              // Correção: usamos bind com 'as any' para satisfazer o TS
              const handleConfirm = updateAppointmentStatus.bind(
                null,
                appt.id,
                "confirmed"
              ) as any;
              const handleCancel = updateAppointmentStatus.bind(
                null,
                appt.id,
                "canceled"
              ) as any;
              const handleDelete = deleteAppointmentAction.bind(
                null,
                appt.id
              ) as any;

              return (
                <div
                  key={appt.id}
                  className={`group rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between transition-all border ${
                    isExpired
                      ? "border-orange-200 bg-orange-50/30"
                      : "bg-white border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-xl"
                  }`}
                >
                  {/* INFO DO CLIENTE E HORÁRIO */}
                  <div className="flex items-center gap-6">
                    <div
                      className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border shadow-inner ${
                        isExpired
                          ? "bg-orange-100 border-orange-200 text-orange-700"
                          : "bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300"
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-tighter">
                        {date.toLocaleString("pt-BR", { month: "short" })}
                      </span>
                      <span className="text-2xl font-black leading-none">
                        {date.getDate()}
                      </span>
                    </div>

                    <div>
                      <p className="font-extrabold text-2xl text-slate-900 tracking-tight mb-1">
                        {/* @ts-ignore */}
                        {appt.clients?.name}
                      </p>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
                          🕒{" "}
                          {date.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isExpired && (
                          <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-100 px-2 py-1 rounded-lg">
                            Atrasado
                          </span>
                        )}
                      </div>

                      {appt.notes && (
                        <p className="text-sm text-slate-400 font-medium italic mt-2">
                          "{appt.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-3 mt-6 md:mt-0">
                    <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-200">
                      {/* BOTAO CONFIRMAR */}
                      <form action={handleConfirm}>
                        <button
                          type="submit"
                          title="Confirmar Atendimento"
                          className="w-11 h-11 flex items-center justify-center rounded-xl bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
                        >
                          ✔
                        </button>
                      </form>

                      {/* BOTAO CANCELAR */}
                      <form action={handleCancel}>
                        <button
                          type="submit"
                          title="Cancelar Horário"
                          className="w-11 h-11 flex items-center justify-center rounded-xl bg-white text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                        >
                          ✖
                        </button>
                      </form>
                    </div>

                    {/* BOTAO DELETAR */}
                    <form action={handleDelete}>
                      <button
                        type="submit"
                        className="w-11 h-11 flex items-center justify-center text-slate-300 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                      >
                        🗑️
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

