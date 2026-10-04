import { LocalPlayerStore } from "../persistence/local-player-store";
import { bindScoreForm } from "../ui/score-form-controller";
import { bindPlayerBoard } from "../ui/player-board-controller";
import { bindPlayerModals } from "../ui/modal-controller";
import { bindTableExport } from "../ui/export-controller";
import { bindViewTabs } from "../ui/tab-controller";

export function bootstrap() {
  const store = new LocalPlayerStore();
  const form = must("#score-form");
  const board = must("#player-board");
  const dialogs = must("#player-dialogs");
  const exporter = must("#table-export");
  const tabs = document.querySelector<HTMLElement>("#view-tabs");

  const modals = bindPlayerModals(dialogs, store);
  bindScoreForm(form, store);
  bindPlayerBoard(board, store, {
    onEdit: modals.openEdit,
    onDelete: modals.openDelete,
    onClear: modals.openClear,
  });
  bindTableExport(exporter, store);

  if (tabs) {
    bindViewTabs(tabs, store);
  }
}

function must(selector: string): HTMLElement {
  const node = document.querySelector<HTMLElement>(selector);
  if (!node) {
    throw new Error(`No está el bloque ${selector}.`);
  }
  return node;
}
