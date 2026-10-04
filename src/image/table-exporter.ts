import type { Player } from "../domain/player";
import { paginatePlayers, rankPlayers } from "../domain/ranking";
import { paintRatioTable } from "./table-painter";
import { TABLE_TEMPLATE_SRC } from "./table-layout";

export async function renderRatioTables(players: Player[]): Promise<HTMLCanvasElement[]> {
  if (players.length === 0) {
    throw new Error("Agrega al menos un jugador para pintar la tabla.");
  }

  await document.fonts.ready;

  const template = await loadTemplate();
  const ranked = rankPlayers(players);
  const pages = paginatePlayers(ranked);

  return pages.map((page, index) =>
    paintRatioTable(template, page, ranked.length, index, pages.length),
  );
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

function loadTemplate(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo cargar la plantilla de la tabla."));
    image.src = TABLE_TEMPLATE_SRC;
  });
}
