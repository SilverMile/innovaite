export interface WasteItem {
  name: string;
  category: 'recyclable' | 'organic' | 'hazardous' | 'landfill';
  instruction: string;
  energySaved: number;
  confidence?: number;
}

export interface ScanHistoryEntry {
  id: string;
  date: string;
  items: WasteItem[];
  pointsEarned: number;
  energySaved: number;
}

export type Screen = 'home' | 'scanner' | 'results' | 'leaderboard' | 'analytics' | 'history' | 'map';

export interface BinInfo {
  color: string;
  emoji: string;
  name: string;
}
