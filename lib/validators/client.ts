// /lib/validators/client.ts
import { z } from "zod";

export const clientSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres"),

  phone: z
    .string()
    .min(10, "Telefone inválido")
    .optional()
    .or(z.literal("")),
});
