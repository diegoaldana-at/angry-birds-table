import type { Player, PlayerId, PlayerInput } from "../domain/player";

export interface PlayerRepository {
  list(): Player[];
  add(input: PlayerInput): Player;
  update(id: PlayerId, input: PlayerInput): Player;
  remove(id: PlayerId): void;
  clear(): void;
  subscribe(listener: (players: Player[]) => void): () => void;
}
