// /lib/validators/appointment.ts
import { z } from "zod";

export const appointmentSchema = z.object({
  client_id: z.string().min(1, "Selecione um cliente"),

  service_id: z.string().min(1, "Selecione um serviço"),

  date: z.string().min(1, "Informe a data"),

  notes: z.string().optional(),
});
