"use client";

import { useState } from "react";
import { completeAppointmentAction } from "@/lib/actions/appointments";
import { toast } from "sonner";

interface Props {
  appointment: any;
}

export function CompleteAppointmentModal({ appointment }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finalPrice, setFinalPrice] = useState(appointment.services?.price || 0);

  async function handleComplete(formData: FormData) {
    setLoading(true);
    const notes = formData.get("notes") as string;
    
    const res = await completeAppointmentAction(appointment.id, Number(finalPrice), notes);
    
    setLoading(false);
    if (res.success) {
      toast.success("Atendimento finalizado e enviado ao financeiro!");
      setIsOpen(false);
    } else {
      toast.error(res.error);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-11 h-11 flex items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-90"
        title="Concluir e Receber"
      >
        ✔
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Finalizar Atendimento</h3>
        <p className="text-slate-600 text-sm mb-6 font-medium italic">Confirme o valor final para o seu caixa.</p>

        <form action={handleComplete} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Valor Recebido (R$)</label>
            <input
              type="number"
              step="0.01"
              value={finalPrice}
              onChange={(e) => setFinalPrice(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-black placeholder-slate-500 bg-white"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">Observações do Acerto</label>
            <textarea
              name="notes"
              placeholder="Ex: Teve desconto, pago no Pix..."
              className="w-full border-2 border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none min-h-[100px] text-black font-medium placeholder-slate-500 bg-white"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
            >
              Cancelar
            </button>
            <button
              disabled={loading}
              className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-xs bg-slate-900 text-white hover:bg-emerald-600 transition-all disabled:opacity-50"
            >
              {loading ? "Gravando..." : "Confirmar Caixa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

