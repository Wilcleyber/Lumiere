"use client";

import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const supabase = createClient();

  async function testConnection() {
    const { data, error } = await supabase.auth.getSession();
    console.log(data, error);
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Schedly AI</h1>

      <button
        onClick={testConnection}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Testar conexão
      </button>
    </div>
  );
}
