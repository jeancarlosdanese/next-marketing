// utils/formaters.ts

import { log } from "console";

export function formatPhoneNumber(numero: string): string {
  const digits = numero.replace(/\D/g, "");

  if (!/^\d{12,13}$/.test(digits)) return numero;

  const pais = digits.slice(0, 2); // 55
  const ddd = digits.slice(2, 4); // 49
  const numeroBase = digits.slice(4); // 8 ou 9 dígitos

  const parte1 = numeroBase.length === 9 ? numeroBase.slice(0, 5) : numeroBase.slice(0, 4);

  const parte2 = numeroBase.length === 9 ? numeroBase.slice(5) : numeroBase.slice(4);

  return `+${pais} (${ddd}) ${parte1}-${parte2}`;
}
