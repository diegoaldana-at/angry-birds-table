import { createPlayer, updatePlayer } from "../domain/player-factory";
import type { Player, PlayerId, PlayerInput } from "../domain/player";
import type { PlayerRepository } from "./player-repository";

const STORAGE_KEY = "flock-arena.players.v1";

export class LocalPlayerStore implements PlayerRepository {
  private listeners = new Set<(players: Player[]) => void>();

  list(): Player[] {
    return this.read();
  }

  add(input: PlayerInput): Player {
    const player = createPlayer(input);
    const next = [...this.read(), player];
    this.write(next);
    return player;
  }

  update(id: PlayerId, input: PlayerInput): Player {
    const current = this.read();
    const index = current.findIndex((player) => player.id === id);

    if (index === -1) {
      throw new Error("No encontramos a ese jugador en el flock.");
    }

    const updated = updatePlayer(current[index], input);
    const next = [...current];
    next[index] = updated;
    this.write(next);
    return updated;
  }

  remove(id: PlayerId): void {
    this.write(this.read().filter((player) => player.id !== id));
  }

  clear(): void {
    this.write([]);
  }

  subscribe(listener: (players: Player[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.read());

    return () => {
      this.listeners.delete(listener);
    };
  }

  private read(): Player[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Player[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private write(players: Player[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    this.listeners.forEach((listener) => listener(players));
  }
}
