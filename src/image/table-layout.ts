export const TABLE_TEMPLATE_SRC = "/tabla-definitiva.jpg";

export const TABLE_SIZE = {
  width: 1200,
  height: 896,
} as const;

export const BOARD = {
  left: 348,
  right: 858,
  headerY: 268,
  firstRowY: 294,
  rowHeight: 26.6,
  rowsPerColumn: 15,
  footerY: 823,
  columnGap: 22,
} as const;

export const INK = {
  name: "#4A2A12",
  muted: "#6B4424",
  ratio: "#C24A12",
  header: "#5C3310",
  footer: "#F6E2B8",
  gold: "#E8B423",
  silver: "#C5D0DC",
  bronze: "#D07A38",
} as const;

export function columnBounds() {
  const width = BOARD.right - BOARD.left;
  const columnWidth = (width - BOARD.columnGap) / 2;

  return [
    { x: BOARD.left, width: columnWidth },
    { x: BOARD.left + columnWidth + BOARD.columnGap, width: columnWidth },
  ] as const;
}
