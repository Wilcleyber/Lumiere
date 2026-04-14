"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema } from "@/lib/validators/appointment";
import { z } from "zod";
import { createAppointmentAction } from "@/lib/actions/appointments";
import { toast } from "sonner";

// ✅ A mágica está aqui: extraímos o tipo de ENTRADA do Zod
type AppointmentInput = z.input<typeof appointmentSchema>;

interface AppointmentFormProps {
  clients: { id: string; name: string }[];
  services: { id: string; name: string; price: number }[];
}

export function AppointmentForm({ clients, services }: AppointmentFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      notes: "",
    },
  });

  async function onSubmit(data: AppointmentInput) {
    if (loading) return;
    setLoading(true);

    try {
      // ✅ No Next.js, é mais seguro passar os dados limpos para a Action
      const formData = new FormData();
      formData.append("client_id", data.client_id);
      formData.append("service_id", data.service_id);
      formData.append("date", data.date);
      formData.append("notes", data.notes || "");

      const res = await createAppointmentAction(formData);

      if (res?.error) {
        toast.error(res.error);
      } else {
        reset();
        toast.success("Agendamento de elite confirmado!");
      }
    } catch (err) {
      console.error("Erro no formulário:", err);
      toast.error("Erro inesperado ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* SELEÇÃO DE CLIENTE */}
      <div className="flex flex-col">
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">
          Cliente
        </label>
        <select
          {...register("client_id")}
          className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-black bg-slate-50 transition-all appearance-none"
        >
          <option value="">Selecione um cliente...</option>
          {clients?.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        {errors.client_id && (
          <p className="text-red-500 text-[10px] mt-2 font-black uppercase ml-1 tracking-wider">
            {errors.client_id.message}
          </p>
        )}
      </div>

      {/* SELEÇÃO DE SERVIÇO */}
      <div className="flex flex-col">
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">
          Serviço de Elite
        </label>
        <select
          {...register("service_id")}
          className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-black bg-slate-50 transition-all appearance-none"
        >
          <option value="">Qual o procedimento?</option>
          {services?.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} — {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(service.price)}
            </option>
          ))}
        </select>
        {errors.service_id && (
          <p className="text-red-500 text-[10px] mt-2 font-black uppercase ml-1 tracking-wider">
            {errors.service_id.message}
          </p>
        )}
      </div>

      {/* DATA E HORA */}
      <div className="flex flex-col">
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">
          Data e Horário
        </label>
        <input
          type="datetime-local"
          {...register("date")}
          className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-black bg-slate-50 transition-all"
        />
        {errors.date && (
          <p className="text-red-500 text-[10px] mt-2 font-black uppercase ml-1 tracking-wider">
            {errors.date.message}
          </p>
        )}
      </div>

      {/* NOTAS */}
      <div className="flex flex-col">
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">
          Observações
        </label>
        <input
          {...register("notes")}
          placeholder="Ex: Detalhes específicos..."
          className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-black bg-slate-50 transition-all"
        />
      </div>

      <button
        disabled={loading}
        className={`md:col-span-2 py-5 rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all shadow-xl shadow-indigo-500/10
          ${
            loading
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 hover:bg-indigo-600 text-white active:scale-[0.98] hover:shadow-indigo-500/20"
          }`}
      >
        {loading ? "Sincronizando..." : "Confirmar Agendamento"}
      </button>
    </form>
  );
}
