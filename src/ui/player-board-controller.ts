import type { Player, RankedPlayer } from "../domain/player";
import { podiumPlayers, rankPlayers, restOfFlock } from "../domain/ranking";
import { formatRatio, formatStat } from "../domain/ratio";
import type { PlayerRepository } from "../persistence/player-repository";

type BoardCallbacks = {
  onEdit: (player: Player) => void;
  onDelete: (player: Player) => void;
  onClear: () => void;
};

export function bindPlayerBoard(
  root: HTMLElement,
  repository: PlayerRepository,
  callbacks: BoardCallbacks,
) {
  const podium = root.querySelector<HTMLElement>("[data-podium]");
  const flock = root.querySelector<HTMLElement>("[data-flock]");
  const empty = root.querySelector<HTMLElement>("[data-empty]");
  const searchEmpty = root.querySelector<HTMLElement>("[data-search-empty]");
  const count = root.querySelector<HTMLElement>("[data-count]");
  const searchWrapper = root.querySelector<HTMLElement>("[data-search-wrapper]");
  const searchInput = root.querySelector<HTMLInputElement>("[data-flock-search]");
  const clearBtn = root.querySelector<HTMLButtonElement>("[data-flock-search-clear]");
  const openClearBtn = root.querySelector<HTMLButtonElement>("[data-open-clear]");

  if (!podium || !flock || !empty || !count) {
    throw new Error("El tablero del flock no está completo.");
  }

  let allPlayers: Player[] = [];
  let searchQuery = "";

  const render = () => {
    const ranked = rankPlayers(allPlayers);
    count.textContent = String(ranked.length);
    empty.hidden = ranked.length > 0;

    if (searchWrapper) {
      searchWrapper.hidden = ranked.length === 0;
    }

    if (ranked.length === 0) {
      podium.replaceChildren();
      flock.replaceChildren();
      if (searchEmpty) searchEmpty.classList.add("is-hidden-tab");
      return;
    }

    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? ranked.filter((player) => player.name.toLowerCase().includes(query))
      : ranked;

    if (searchEmpty) {
      searchEmpty.classList.toggle("is-hidden-tab", !query || filtered.length > 0);
    }

    if (query) {
      // Cuando hay búsqueda activa, mostramos directamente la lista de coincidencias
      podium.replaceChildren();
      podium.hidden = true;
      flock.replaceChildren(...filtered.map((player) => renderFlockCard(player, callbacks)));
    } else {
      podium.hidden = false;
      podium.replaceChildren(...podiumPlayers(ranked).map((player) => renderPodiumCard(player, callbacks)));
      flock.replaceChildren(...restOfFlock(ranked).map((player) => renderFlockCard(player, callbacks)));
    }
  };

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchQuery = searchInput.value;
      if (clearBtn) {
        clearBtn.hidden = searchQuery.trim().length === 0;
      }
      render();
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchQuery = "";
      clearBtn.hidden = true;
      searchInput.focus();
      render();
    });
  }

  if (openClearBtn) {
    openClearBtn.addEventListener("click", () => {
      callbacks.onClear();
    });
  }

  repository.subscribe((players) => {
    allPlayers = players;
    render();
  });
}

function renderPodiumCard(player: RankedPlayer, callbacks: BoardCallbacks) {
  const article = document.createElement("article");
  article.className = `podium-card podium-card--${player.rank}`;
  article.innerHTML = `
    <div class="podium-card__header">
      <span class="podium-card__rank">${player.rank}</span>
      <div class="card-actions">
        <button type="button" class="btn-icon" data-edit title="Editar ${escapeHtml(player.name)}">✏️</button>
        <button type="button" class="btn-icon btn-icon--delete" data-delete title="Eliminar ${escapeHtml(player.name)}">🗑️</button>
      </div>
    </div>
    <div class="podium-card__body">
      <h3>${escapeHtml(player.name)}</h3>
      <div class="podium-card__ratio-row">
        <span class="podium-card__ratio">${formatRatio(player.ratio)}</span>
        <span class="podium-card__meta">RATIO</span>
      </div>
    </div>
    ${details(player)}
  `;
  bindCard(article, player, callbacks);
  return article;
}

function renderFlockCard(player: RankedPlayer, callbacks: BoardCallbacks) {
  const article = document.createElement("article");
  article.className = "flock-card";
  article.innerHTML = `
    <div class="flock-card__main">
      <span class="flock-card__rank">${player.rank}</span>
      <div class="flock-card__who">
        <strong>${escapeHtml(player.name)}</strong>
        <span class="flock-card__ratio-badge">Ratio ${formatRatio(player.ratio)}</span>
      </div>
      <div class="card-actions">
        <button type="button" class="btn-icon" data-edit title="Editar ${escapeHtml(player.name)}">✏️</button>
        <button type="button" class="btn-icon btn-icon--delete" data-delete title="Eliminar ${escapeHtml(player.name)}">🗑️</button>
      </div>
    </div>
    ${details(player)}
  `;
  bindCard(article, player, callbacks);
  return article;
}

function details(player: RankedPlayer) {
  return `
    <details class="more-info">
      <summary>Ver más</summary>
      <dl>
        <div><dt>Puntos</dt><dd>${formatStat(player.score)}</dd></div>
        <div><dt>Poder</dt><dd>${formatStat(player.power)}</dd></div>
        <div><dt>Ratio</dt><dd>${formatRatio(player.ratio)}</dd></div>
      </dl>
    </details>
  `;
}

function bindCard(article: HTMLElement, player: Player, callbacks: BoardCallbacks) {
  article.querySelector("[data-edit]")?.addEventListener("click", () => callbacks.onEdit(player));
  article.querySelector("[data-delete]")?.addEventListener("click", () => callbacks.onDelete(player));
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
