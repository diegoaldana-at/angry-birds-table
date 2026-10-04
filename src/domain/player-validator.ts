import type { PlayerInput } from "./player";

export type ValidationResult =
  | { ok: true; value: PlayerInput }
  | { ok: false; message: string };

export function parsePlayerForm(form: FormData): ValidationResult {
  const name = String(form.get("name") ?? "").trim();
  const score = Number(form.get("score"));
  const power = Number(form.get("power"));

  if (!name) {
    return { ok: false, message: "Escribe el nombre del jugador." };
  }

  if (name.length > 24) {
    return { ok: false, message: "El nombre no puede pasar de 24 caracteres." };
  }

  if (!Number.isFinite(score) || score < 0) {
    return { ok: false, message: "La puntuación debe ser un número válido." };
  }

  if (!Number.isFinite(power) || power <= 0) {
    return { ok: false, message: "El poder debe ser mayor que cero." };
  }

  return { ok: true, value: { name, score, power } };
}
