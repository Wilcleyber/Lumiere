"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createServiceAction(formData: FormData) {
  const supabase = createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price");
  const duration = formData.get("duration");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase.from("services").insert({
    name,
    description,
    price: Number(price),
    duration: Number(duration),
    user_id: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/services");
}

export async function deleteServiceAction(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/services");
}
