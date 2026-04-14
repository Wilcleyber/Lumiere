"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema } from "@/lib/validators/service";
import { createServiceAction } from "@/lib/actions/services";
import { z } from "zod";

type ServiceInput = z.input<typeof serviceSchema>;
type ServiceOutput = z.output<typeof serviceSchema>;

export function ServiceForm() {
  const [loading, setLoading] = useState(false);

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
  });

  async function onSubmit(data: ServiceInput) {
    setLoading(true);
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("price", String(data.price));
    formData.append("duration", String(data.duration));

    const res = await createServiceAction(formData);
    
    setLoading(false);
    if (!res?.error) reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
    >
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Nome do Serviço
        </label>
        <input
          {...register("name")}
          placeholder="Ex: Limpeza de Pele"
          className="w-full border rounded-lg p-3 text-black"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Preço (R$)
        </label>
        <input
          type="number"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          placeholder="0.00"
          className="w-full border rounded-lg p-3 text-black"
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Duração (min)
        </label>
        <input
          type="number"
          {...register("duration", { valueAsNumber: true })}
          placeholder="60"
          className="w-full border rounded-lg p-3 text-black"
        />
        {errors.duration && (
          <p className="text-red-500 text-sm">{errors.duration.message}</p>
        )}
      </div>

      <button
        disabled={loading}
        className="md:col-span-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all"
      >
        {loading ? "Salvando..." : "Cadastrar Serviço"}
      </button>
    </form>
  );
}
