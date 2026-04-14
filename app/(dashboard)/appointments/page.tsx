import { createClient } from "@/lib/supabase/server";
import {
  deleteAppointmentAction,
  updateAppointmentStatus,
} from "@/lib/actions/appointments";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { CompleteAppointmentModal } from "@/components/modals/complete-appointment-modal";
import { ActionButton } from "@/components/ui/action-button";

export default async function AppointmentsPage() {
  const supabase = createClient();

  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      *,
      clients ( name ),
      services ( name, price )
    `)
    .eq("status", "pending")
    .order("date", { ascending: true });

  const { data: clients } = await supabase.from("clients").select("id, name");
  const { data: services } = await supabase.from("services").select("*");

  const safeAppointments = appointments || [];

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Agendamentos
        </h1>
        <p className="text-slate-500 font-medium italic">
          Gestão inteligente da agenda Lumière.
        </p>
      </div>

      {/* NOVO AGENDAMENTO */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
          <h2 className="text-xl font-bold text-slate-800">
            Novo Agendamento
          </h2>
        </div>
        <AppointmentForm clients={clients || []} services={services || []} />
      </section>

      {/* LISTA */}
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
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
            <p className="text-slate-400 font-bold italic text-lg">
              Sua agenda está livre para novos clientes! ☕
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {safeAppointments.map((appt) => {
              const date = new Date(appt.date);
              const isExpired = date < new Date();

              return (
                <div
                  key={appt.id}
                  className={`group rounded-[2rem] p-6 flex flex-col md:flex-row md:items-center justify-between transition-all border ${
                    isExpired
                      ? "border-orange-200 bg-orange-50/30"
                      : "bg-white border-slate-100 hover:shadow-xl hover:border-slate-300"
                  }`}
                >
                  {/* INFO */}
                  <div className="flex items-center gap-6">
                    {/* DATA */}
                    <div
                      className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border ${
                        isExpired
                          ? "bg-orange-100 border-orange-200 text-orange-700"
                          : "bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all"
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase">
                        {date.toLocaleString("pt-BR", { month: "short" })}
                      </span>
                      <span className="text-2xl font-black">
                        {date.getDate()}
                      </span>
                    </div>

                    {/* DETALHES */}
                    <div>
                      <p className="font-extrabold text-2xl text-slate-900 mb-1">
                        {appt.clients?.name}
                      </p>
                      <p className="text-sm text-slate-600 font-medium">
                        {appt.services?.name
                          ? `${appt.services.name} — ${new Intl.NumberFormat(
                              "pt-BR",
                              { style: "currency", currency: "BRL" }
                            ).format(appt.services.price)}`
                          : "Serviço não definido"}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                          🕒{" "}
                          {date.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isExpired && (
                          <span className="text-[10px] font-black text-orange-600 uppercase bg-orange-100 px-2 py-1 rounded-lg">
                            Atrasado
                          </span>
                        )}
                      </div>
                      {appt.notes && (
                        <p className="text-sm text-slate-400 italic mt-2">
                          "{appt.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-3 mt-6 md:mt-0">
                    <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-200">
                      <CompleteAppointmentModal appointment={appt} />

                      {/* BOTÃO CANCELAR */}
                      <ActionButton
                        action={updateAppointmentStatus}
                        id={appt.id}
                        args={["canceled"]}
                        icon="✖"
                        className="w-11 h-11 flex items-center justify-center rounded-xl bg-white text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-all"
                      />
                    </div>

                    {/* BOTÃO DELETAR */}
                    <ActionButton
                      action={deleteAppointmentAction}
                      id={appt.id}
                      icon="🗑️"
                      className="w-11 h-11 flex items-center justify-center text-slate-300 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                    />
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

