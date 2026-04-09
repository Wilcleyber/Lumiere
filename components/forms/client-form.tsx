// /components/forms/client-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema } from "@/lib/validators/client";
import { z } from "zod";
import { createClientAction } from "@/lib/actions/clients";

type FormData = z.infer<typeof clientSchema>;

export function ClientForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(clientSchema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone || "");

    const res = await createClientAction(formData);

    setLoading(false);

    if (!res?.error) {
      reset();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* NOME */}
      <div>
        <input
          {...register("name")}
          placeholder="Nome do cliente"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black text-black"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* TELEFONE */}
      <div>
        <input
          {...register("phone")}
          placeholder="Telefone (ex: 62999999999)"
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-black text-black"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* BOTÃO */}
      <button
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold transition-all
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
      >
        {loading ? "Salvando..." : "+ Adicionar Cliente"}
      </button>
    </form>
  );
}
