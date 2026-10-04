import { parsePlayerForm } from "../domain/player-validator";
import type { Player } from "../domain/player";
import type { PlayerRepository } from "../persistence/player-repository";

export function bindPlayerModals(root: HTMLElement, repository: PlayerRepository) {
  const editDialog = root.querySelector<HTMLDialogElement>("[data-edit-dialog]");
  const deleteDialog = root.querySelector<HTMLDialogElement>("[data-delete-dialog]");
  const clearDialog = root.querySelector<HTMLDialogElement>("[data-clear-dialog]");
  const editForm = editDialog?.querySelector<HTMLFormElement>("form");
  const deleteName = deleteDialog?.querySelector<HTMLElement>("[data-delete-name]");
  const confirmDelete = deleteDialog?.querySelector<HTMLButtonElement>("[data-confirm-delete]");
  const confirmClear = clearDialog?.querySelector<HTMLButtonElement>("[data-confirm-clear]");

  if (!editDialog || !deleteDialog || !editForm || !deleteName || !confirmDelete) {
    throw new Error("Los modales no están completos.");
  }

  let editingId = "";
  let deletingId = "";

  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const parsed = parsePlayerForm(new FormData(editForm));
    const status = editForm.querySelector<HTMLElement>("[data-edit-status]");

    if (!parsed.ok) {
      if (status) status.textContent = parsed.message;
      return;
    }

    try {
      repository.update(editingId, parsed.value);
      editDialog.close();
    } catch (error) {
      if (status) {
        status.textContent = error instanceof Error ? error.message : "Error al actualizar al jugador.";
      }
      console.error("Error al actualizar jugador:", error);
    }
  });

  confirmDelete.addEventListener("click", () => {
    try {
      repository.remove(deletingId);
      deleteDialog.close();
    } catch (error) {
      console.error("Error al eliminar jugador:", error);
    }
  });

  confirmClear?.addEventListener("click", () => {
    try {
      repository.clear();
      clearDialog?.close();
    } catch (error) {
      console.error("Error al vaciar flock:", error);
    }
  });

  root.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
      editDialog.close();
      deleteDialog.close();
      clearDialog?.close();
    });
  });

  return {
    openEdit(player: Player) {
      editingId = player.id;
      const name = editForm.querySelector<HTMLInputElement>('[name="name"]');
      const score = editForm.querySelector<HTMLInputElement>('[name="score"]');
      const power = editForm.querySelector<HTMLInputElement>('[name="power"]');
      if (name) name.value = player.name;
      if (score) score.value = String(player.score);
      if (power) power.value = String(player.power);
      const status = editForm.querySelector<HTMLElement>("[data-edit-status]");
      if (status) status.textContent = "";
      editDialog.showModal();
    },
    openDelete(player: Player) {
      deletingId = player.id;
      deleteName.textContent = player.name;
      deleteDialog.showModal();
    },
    openClear() {
      clearDialog?.showModal();
    },
  };
}
