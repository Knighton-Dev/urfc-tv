export interface StreamingService {
  provider: string;
  url: string;
}

export interface BroadcastChannel {
  provider: string;
}

export interface Game {
  date: string; // YYYY-MM-DD
  opponent: string;
  time: string;
  home: boolean;
  streamingServices?: StreamingService[];
  broadcast?: BroadcastChannel[];
}
