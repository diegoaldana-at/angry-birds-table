import type { RankedPlayer } from "../domain/player";
import { formatRatio } from "../domain/ratio";
import { BOARD, columnBounds, INK, TABLE_SIZE } from "./table-layout";

const FONTS = {
  header: '700 15px "Fredoka", sans-serif',
  name: '600 15px "Fredoka", sans-serif',
  ratio: '700 16px "Fredoka", sans-serif',
  rank: '700 13px "Fredoka", sans-serif',
  footer: '700 20px "Fredoka", sans-serif',
  footer_low: '700 15px "Fredoka", sans-serif'
};

export function paintRatioTable(
  template: HTMLImageElement,
  page: RankedPlayer[],
  totalMembers: number,
  pageIndex: number,
  pageCount: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = TABLE_SIZE.width;
  canvas.height = TABLE_SIZE.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Este navegador no puede pintar la tabla.");
  }

  ctx.drawImage(template, 0, 0, TABLE_SIZE.width, TABLE_SIZE.height);
  drawHeaders(ctx);
  drawRows(ctx, page);
  drawFooter(ctx, totalMembers, pageIndex, pageCount);

  return canvas;
}

function drawHeaders(ctx: CanvasRenderingContext2D) {
  const [left, right] = columnBounds();
  ctx.fillStyle = INK.header;
  ctx.font = FONTS.header;
  ctx.textBaseline = "middle";

  ctx.fillText("RANGO", left.x, BOARD.headerY);
  ctx.fillText("JUGADOR", left.x + 52, BOARD.headerY);
  ctx.textAlign = "right";
  ctx.fillText("RATIO", left.x + left.width - 4, BOARD.headerY);

  ctx.textAlign = "left";
  ctx.fillText("RANGO", right.x, BOARD.headerY);
  ctx.fillText("JUGADOR", right.x + 52, BOARD.headerY);
  ctx.textAlign = "right";
  ctx.fillText("RATIO", right.x + right.width - 4, BOARD.headerY);
  ctx.textAlign = "left";
}

function drawRows(ctx: CanvasRenderingContext2D, page: RankedPlayer[]) {
  const columns = columnBounds();

  page.forEach((player, index) => {
    const columnIndex = index < BOARD.rowsPerColumn ? 0 : 1;
    const rowIndex = index % BOARD.rowsPerColumn;
    const column = columns[columnIndex];
    const y = BOARD.firstRowY + rowIndex * BOARD.rowHeight;

    paintRowBackground(ctx, column.x, y, column.width, player.rank);
    paintRankBadge(ctx, column.x + 14, y, player.rank);

    ctx.textBaseline = "middle";
    ctx.fillStyle = INK.name;
    ctx.font = FONTS.name;
    ctx.textAlign = "left";
    ctx.fillText(ellipsis(ctx, player.name, column.width - 110), column.x + 52, y);

    ctx.fillStyle = player.rank <= 3 ? "#B32600" : INK.ratio;
    ctx.font = FONTS.ratio;
    ctx.textAlign = "right";
    ctx.fillText(formatRatio(player.ratio), column.x + column.width - 4, y);
    ctx.textAlign = "left";
  });
}

function paintRowBackground(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  rank: number,
) {
  if (rank > 3) return;

  const colors = ["rgba(232, 180, 35, 0.38)", "rgba(190, 210, 230, 0.42)", "rgba(214, 130, 62, 0.34)"];
  ctx.fillStyle = colors[rank - 1];
  roundRect(ctx, x - 6, y - BOARD.rowHeight / 2 + 1, width + 10, BOARD.rowHeight - 2, 8);
  ctx.fill();
}

function paintRankBadge(ctx: CanvasRenderingContext2D, x: number, y: number, rank: number) {
  if (rank <= 3) {
    const fill = [INK.gold, INK.silver, INK.bronze][rank - 1];
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = "rgba(70, 35, 10, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#3A220C";
    ctx.font = FONTS.rank;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(rank), x, y + 0.5);
    ctx.textAlign = "left";
    return;
  }

  ctx.fillStyle = INK.muted;
  ctx.font = FONTS.rank;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${rank}.`, x, y);
  ctx.textAlign = "left";
}

function drawFooter(
  ctx: CanvasRenderingContext2D,
  totalMembers: number,
  pageIndex: number,
  pageCount: number,
) {
  ctx.fillStyle = INK.footer;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const pageLabel = pageCount > 1 ? `  ·  PÁGINA ${pageIndex + 1}/${pageCount}` : "";
  if (pageLabel !== "") {
    ctx.font = FONTS.footer_low;
  }
  else {
    ctx.font = FONTS.footer;
  }
  ctx.fillText(`TOTAL MIEMBROS: ${totalMembers}${pageLabel}`, TABLE_SIZE.width / 2, BOARD.footerY);
  ctx.textAlign = "left";
}

function ellipsis(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;

  let value = text;
  while (value.length > 1 && ctx.measureText(`${value}…`).width > maxWidth) {
    value = value.slice(0, -1);
  }

  return `${value}…`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}
