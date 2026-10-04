import { generateId } from "./id-generator";
import type { Player, PlayerInput } from "./player";
import { calculateRatio } from "./ratio";

export function createPlayer(input: PlayerInput): Player {
  return {
    id: generateId(),
    name: input.name.trim(),
    score: input.score,
    power: input.power,
    ratio: calculateRatio(input.score, input.power),
    createdAt: new Date().toISOString(),
  };
}

export function updatePlayer(player: Player, input: PlayerInput): Player {
  return {
    ...player,
    name: input.name.trim(),
    score: input.score,
    power: input.power,
    ratio: calculateRatio(input.score, input.power),
  };
}
