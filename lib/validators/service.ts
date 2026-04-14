import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  // O coerce tenta transformar qualquer entrada em número automaticamente
  price: z.coerce.number().min(0, "Preço deve ser positivo"),
  duration: z.coerce.number().min(1, "Mínimo 1 minuto"),
});
