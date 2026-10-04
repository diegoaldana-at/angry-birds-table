export type PlayerId = string;

export type PlayerInput = {
  name: string;
  score: number;
  power: number;
};

export type Player = PlayerInput & {
  id: PlayerId;
  ratio: number;
  createdAt: string;
};

export type RankedPlayer = Player & {
  rank: number;
};
