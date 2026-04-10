import { createClient } from "@/lib/supabase/server";
import { deleteClientAction } from "@/lib/actions/clients";
import { ClientForm } from "@/components/forms/client-form";

export default async function ClientsPage() {
  const supabase = createClient();

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Clientes
        </h1>
        <p className="text-slate-500 font-medium italic">
          A base do seu sucesso: pessoas e conexões.
        </p>
      </div>

      {/* FORM CARD */}
      <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-6 bg-slate-900 rounded-full"></div>
          <h2 className="text-xl font-bold text-slate-800">Novo Cadastro</h2>
        </div>
        <ClientForm />
      </section>

      {/* LISTA DE CONTATOS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Base de Clientes
          </h2>
          <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
            {clients?.length || 0} Registrados
          </span>
        </div>

        {!clients || clients.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <p className="text-slate-400 font-bold italic text-lg">
              Sua lista de contatos está vazia. Comece a expandir seu negócio!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {clients?.map((client) => {
              // Correção: usamos bind com 'as any' para satisfazer o TS
              const handleDeleteClient = deleteClientAction.bind(
                null,
                client.id
              ) as any;

              return (
                <div
                  key={client.id}
                  className="group bg-white border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between transition-all hover:shadow-2xl hover:border-slate-300"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl border border-slate-100 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300 shadow-inner">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-extrabold text-2xl text-slate-900 tracking-tight leading-none mb-2">
                        {client.name}
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
                          <span className="text-slate-900">📞</span>
                          {client.phone || "Sem contato cadastrado"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ações corrigidas */}
                  <div className="flex items-center gap-4 mt-6 md:mt-0">
                    <form action={handleDeleteClient}>
                      <button
                        type="submit"
                        className="text-[10px] font-black tracking-widest uppercase py-3 px-6 rounded-xl border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all active:scale-90"
                      >
                        Remover Cliente
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

