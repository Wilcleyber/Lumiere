import { createClient } from "@/lib/supabase/server";
import { deleteServiceAction } from "@/lib/actions/services";
import { ServiceForm } from "@/components/forms/service-form";

export default async function ServicesPage() {
  const supabase = createClient();

  // Buscamos os serviços do dono logado
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Serviços
        </h1>
        <p className="text-slate-500 font-medium italic">
          Defina seu cardápio de elite e organize sua vitrine.
        </p>
      </div>

      {/* FORM CARD */}
      <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
          <h2 className="text-xl font-bold text-slate-800">Novo Serviço</h2>
        </div>
        <ServiceForm />
      </section>

      {/* LISTA DE SERVIÇOS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Cardápio de Serviços
          </h2>
          <span className="bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
            {services?.length || 0} Ativos
          </span>
        </div>

        {!services || services.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <p className="text-slate-400 font-bold italic text-lg">
              Nenhum serviço cadastrado ainda. Comece definindo suas especialidades!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {services?.map((service) => {
              // Bind da ação de deletar com 'as any' para evitar erro de tipo no build
              const handleDeleteService = deleteServiceAction.bind(
                null,
                service.id
              ) as any;

              return (
                <div
                  key={service.id}
                  className="group bg-white border border-slate-100 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between transition-all hover:shadow-2xl hover:border-slate-300"
                >
                  <div className="flex items-center gap-6">
                    {/* ÍCONE/AVATAR DO SERVIÇO */}
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-400 font-black text-xl border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300 shadow-inner">
                      {service.name.substring(0, 1).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-extrabold text-2xl text-slate-900 tracking-tight leading-none mb-2">
                        {service.name}
                      </p>
                      <div className="flex items-center gap-4">
                        {/* PREÇO */}
                        <p className="text-sm text-emerald-600 font-black flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                        </p>
                        {/* DURAÇÃO */}
                        <p className="text-sm text-slate-500 font-bold flex items-center gap-2">
                          <span className="text-slate-900">🕒</span>
                          {service.duration} min
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AÇÕES */}
                  <div className="flex items-center gap-4 mt-6 md:mt-0">
                    <form action={handleDeleteService}>
                      <button
                        type="submit"
                        className="text-[10px] font-black tracking-widest uppercase py-3 px-6 rounded-xl border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all active:scale-90"
                      >
                        Excluir Serviço
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
