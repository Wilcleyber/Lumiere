"use client";

import { useTransition } from "react";

interface ActionButtonProps {
  action: (id: string, ...args: any[]) => Promise<any>;
  id: string;
  args?: any[];
  icon: string;
  className: string;
}

export function ActionButton({ action, id, args = [], icon, className }: ActionButtonProps) {
  let [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await action(id, ...args);
        });
      }}
      className={`${className} ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isPending ? "..." : icon}
    </button>
  );
}
