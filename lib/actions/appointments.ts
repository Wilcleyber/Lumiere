"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ➕ Criar agendamento
export async function createAppointmentAction(formData: FormData) {
  const supabase = createClient();

  const client_id = formData.get("client_id") as string;
  const date = formData.get("date") as string;
  const dateInput = formData.get("date") as string;
  const dateISO = new Date(dateInput).toISOString();
  const notes = formData.get("notes") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase.from("appointments").insert({
    client_id,
    date: dateISO,
    notes,
    user_id: user.id,
    status: "pending",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/appointments");
}

// ❌ Deletar
export async function deleteAppointmentAction(id: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/appointments");
}

export async function updateAppointmentStatus(id: string, status: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/appointments");
}
