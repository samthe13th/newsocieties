export interface LandTile {
  value: number;
  owner: LandOwner, 
  side?: 'back' | 'front';
  harvested?: boolean;
  contaminated: boolean;
  mark: string | number | null;
}

export interface LandOwner {
  name: string;
  division: string;
}

export enum LandCardValues {
  EMPTY = -1,
  CONTAM = 0,
  V1 = 1,
  V2 = 2,
  V3 = 3
}

export type LandCardValue = LandCardValues | keyof typeof LandCardValues;
