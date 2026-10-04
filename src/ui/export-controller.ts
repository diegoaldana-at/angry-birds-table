import type { PlayerRepository } from "../persistence/player-repository";
import { downloadCanvas, renderRatioTables } from "../image/table-exporter";

export function bindTableExport(root: HTMLElement, repository: PlayerRepository) {
  const button = root.querySelector<HTMLButtonElement>("[data-generate]");
  const gallery = root.querySelector<HTMLElement>("[data-gallery]");
  const status = root.querySelector<HTMLElement>("[data-export-status]");
  const emptyState = root.querySelector<HTMLElement>("[data-export-empty]");

  if (!button || !gallery || !status) {
    throw new Error("El panel de exportación no está completo.");
  }

  button.addEventListener("click", async () => {
    const players = repository.list();
    if (players.length === 0) {
      status.textContent = "No hay jugadores en el flock para generar la tabla. Agrega al menos uno.";
      status.dataset.tone = "error";
      return;
    }

    button.disabled = true;
    status.textContent = "Pintando la tabla del clan…";
    status.dataset.tone = "";

    try {
      const canvases = await renderRatioTables(players);
      gallery.replaceChildren();

      if (emptyState) {
        emptyState.hidden = true;
      }

      canvases.forEach((canvas, index) => {
        const card = document.createElement("div");
        card.className = "export-card";

        canvas.className = "table-preview";
        card.append(canvas);

        const actions = document.createElement("div");
        actions.className = "export-card__actions";

        const downloadBtn = document.createElement("button");
        downloadBtn.type = "button";
        downloadBtn.className = "btn btn--primary btn--sm";
        downloadBtn.innerHTML = `📥 Descargar imagen ${canvases.length > 1 ? `#${index + 1}` : ""}`;
        downloadBtn.addEventListener("click", () => {
          downloadCanvas(canvas, `tabla-ratios-${index + 1}.png`);
        });

        actions.append(downloadBtn);
        card.append(actions);
        gallery.append(card);
      });

      status.textContent =
        canvases.length === 1
          ? "¡Tabla lista! Puedes previsualizarla abajo y descargarla cuando quieras."
          : `¡${canvases.length} tablas listas! Previsualízalas abajo y descarga la que necesites.`;
      status.dataset.tone = "ok";
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "No se pudo generar la tabla.";
      status.dataset.tone = "error";
      console.error(error);
    } finally {
      button.disabled = false;
    }
  });
}
