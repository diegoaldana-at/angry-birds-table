import { parsePlayerForm } from "../domain/player-validator";
import { formatRatio } from "../domain/ratio";
import type { PlayerRepository } from "../persistence/player-repository";

export function bindScoreForm(root: HTMLElement, repository: PlayerRepository) {
  const form = root.querySelector<HTMLFormElement>("form");
  const status = root.querySelector<HTMLElement>("[data-form-status]");
  const preview = root.querySelector<HTMLElement>("[data-ratio-preview]");

  if (!form || !status) {
    throw new Error("El formulario de puntuación no está completo.");
  }

  const refreshPreview = () => {
    if (!preview) return; 

    const parsed = parsePlayerForm(new FormData(form));
    preview.textContent = parsed.ok ? formatRatio((parsed.value.score / parsed.value.power) * 1000) : "—";
  };

  form.addEventListener("input", refreshPreview);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const parsed = parsePlayerForm(new FormData(form));

    if (!parsed.ok) {
      status.textContent = parsed.message;
      status.dataset.tone = "error";
      return;
    }

    try {
      repository.add(parsed.value);
      form.reset();
      refreshPreview();
      status.textContent = `${parsed.value.name} entra al flock. Puedes seguir sumando jugadores.`;
      status.dataset.tone = "ok";
      form.querySelector<HTMLInputElement>('[name="name"]')?.focus();
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "Error inesperado al guardar el jugador.";
      status.dataset.tone = "error";
      console.error("Error al registrar jugador:", error);
    }
  });
}
