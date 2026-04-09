// /components/forms/appointment-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema } from "@/lib/validators/appointment";
import { z } from "zod";
import { createAppointmentAction } from "@/lib/actions/appointments";

type FormData = z.infer<typeof appointmentSchema>;

export function AppointmentForm({ clients }: { clients: any[] }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(appointmentSchema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);

    const formData = new FormData();
    formData.append("client_id", data.client_id);
    formData.append("date", data.date);
    formData.append("notes", data.notes || "");

    const res = await createAppointmentAction(formData);

    setLoading(false);

    if (!res?.error) {
      reset();
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* CLIENTE */}
      <div>
        <select
          {...register("client_id")}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black text-black"
        >
          <option value="">Selecione um cliente...</option>
          {clients?.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        {errors.client_id && (
          <p className="text-red-500 text-sm mt-1">
            {errors.client_id.message}
          </p>
        )}
      </div>

      {/* DATA */}
      <div>
        <input
          type="datetime-local"
          {...register("date")}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black text-black"
        />

        {errors.date && (
          <p className="text-red-500 text-sm mt-1">
            {errors.date.message}
          </p>
        )}
      </div>

      {/* NOTES */}
      <div className="md:col-span-2">
        <input
          {...register("notes")}
          placeholder="x: Limpeza de Pele Profunda, Microagulhamento..."
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black text-black"
        />
      </div>

      {/* BOTÃO */}
      <button
        disabled={loading}
        className={`md:col-span-2 py-3 rounded-lg font-semibold transition-all
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
      >
        {loading ? "Salvando..." : "+ Criar Agendamento"}
      </button>
    </form>
  );
}
