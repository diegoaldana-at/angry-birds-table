import type { Player, RankedPlayer } from "./player";

export const MEMBERS_PER_TABLE = 30;

export function rankPlayers(players: Player[]): RankedPlayer[] {
  return [...players]
    .sort((left, right) => {
      if (right.ratio !== left.ratio) {
        return right.ratio - left.ratio;
      }

      return left.name.localeCompare(right.name, "es");
    })
    .map((player, index) => ({ ...player, rank: index + 1 }));
}

export function paginatePlayers<T>(items: T[], pageSize = MEMBERS_PER_TABLE): T[][] {
  if (items.length === 0) {
    return [[]];
  }

  const pages: T[][] = [];

  for (let index = 0; index < items.length; index += pageSize) {
    pages.push(items.slice(index, index + pageSize));
  }

  return pages;
}

export function podiumPlayers(ranked: RankedPlayer[]): RankedPlayer[] {
  return ranked.slice(0, 3);
}

export function restOfFlock(ranked: RankedPlayer[]): RankedPlayer[] {
  return ranked.slice(3);
}
