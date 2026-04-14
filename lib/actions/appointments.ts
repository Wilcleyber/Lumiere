"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ➕ Criar agendamento
export async function createAppointmentAction(formData: FormData) {
  const supabase = createClient();

  const client_id = formData.get("client_id") as string;
  const service_id = formData.get("service_id") as string;
  const dateInput = formData.get("date") as string;
  const notes = formData.get("notes") as string;
  const dateISO = new Date(dateInput).toISOString();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  // Buscar o preço atual do serviço para "congelar" no agendamento
  const { data: serviceData, error: serviceError } = await supabase
    .from("services")
    .select("price")
    .eq("id", service_id)
    .single();

  if (serviceError || !serviceData) {
    return { error: "Serviço não encontrado ou removido." };
  }

  const { error } = await supabase.from("appointments").insert({
    client_id,
    service_id,
    price_at_time: serviceData.price, 
    date: dateISO,
    notes,
    user_id: user.id,
    status: "pending",
  });

  if (error) return { error: error.message };

  // Revalidamos o dashboard para atualizar os gráficos e listas
  revalidatePath("/dashboard");
  return { success: true };
}

// ✅ Concluir agendamento (Com lógica financeira)
export async function completeAppointmentAction(
  id: string,
  final_price: number,
  completion_notes: string
) {
  const supabase = createClient();

  // Verificação de segurança: O usuário está logado?
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ação não autorizada." };

  const { error } = await supabase
    .from("appointments")
    .update({
      final_price,
      completion_notes,
      completed_at: new Date().toISOString(),
      status: "completed",
    })
    .eq("id", id)
    .eq("user_id", user.id); // Garante que só edita o que é dele

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

// ❌ Deletar agendamento
export async function deleteAppointmentAction(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Você precisa estar logado para deletar." };
  }

  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}

// 🔄 Atualizar status (Geral)
export async function updateAppointmentStatus(id: string, status: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { success: true };
}
