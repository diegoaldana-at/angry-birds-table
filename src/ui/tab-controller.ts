import type { PlayerRepository } from "../persistence/player-repository";

const STORAGE_ACTIVE_TAB = "flock-arena.active-tab";

export function bindViewTabs(root: HTMLElement, repository: PlayerRepository) {
  const tabs = root.querySelectorAll<HTMLButtonElement>("[data-tab-target]");
  const countBadge = root.querySelector<HTMLElement>("[data-tab-flock-count]");

  if (countBadge) {
    repository.subscribe((players) => {
      countBadge.textContent = String(players.length);
    });
  }

  const panels = Array.from(tabs)
    .map((tab) => {
      const targetId = tab.dataset.tabTarget;
      const panel = targetId ? document.getElementById(targetId) : null;
      return { tab, panel, id: targetId };
    })
    .filter((entry): entry is { tab: HTMLButtonElement; panel: HTMLElement; id: string } => !!entry.panel && !!entry.id);

  const activateTab = (targetId: string, smoothScroll = false) => {
    let targetPanel: HTMLElement | null = null;

    panels.forEach(({ tab, panel, id }) => {
      const isActive = id === targetId;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));

      if (isActive) {
        panel.classList.remove("is-hidden-tab");
        panel.removeAttribute("hidden");
        targetPanel = panel;
      } else {
        panel.classList.add("is-hidden-tab");
        panel.setAttribute("hidden", "until-found");
      }
    });

    try {
      sessionStorage.setItem(STORAGE_ACTIVE_TAB, targetId);
    } catch {
      // Ignore if sessionStorage is not accessible
    }

    if (smoothScroll && targetPanel) {
      (targetPanel as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.tabTarget;
      if (targetId) activateTab(targetId);
    });
  });

  // Listen to shortcut buttons with [data-switch-tab="..."] from anywhere in the document
  document.querySelectorAll<HTMLElement>("[data-switch-tab]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const target = trigger.dataset.switchTab;
      if (target) {
        activateTab(target, true);
      }
    });
  });

  // Restore previous active tab or default to the first one
  const savedTab = (() => {
    try {
      return sessionStorage.getItem(STORAGE_ACTIVE_TAB);
    } catch {
      return null;
    }
  })();

  const defaultId = (savedTab && panels.some((p) => p.id === savedTab)) ? savedTab : panels[0]?.id;
  if (defaultId) {
    activateTab(defaultId);
  }
}
