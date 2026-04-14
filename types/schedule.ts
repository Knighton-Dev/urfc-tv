export type Provider =
  | "MLS Season Pass"
  | "ESPN"
  | "ESPN+"
  | "Peacock"
  | "Apple TV+"
  | "TNT"
  | "FS1"
  | "Local Broadcast";

export interface Game {
  date: string; // YYYY-MM-DD
  opponent: string;
  provider: Provider;
  streamUrl: string;
  time: string;
}
