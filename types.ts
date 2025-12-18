
export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  MARATHI = 'Marathi'
}

export interface WebSource {
  uri: string;
  title: string;
}

export interface NewsResult {
  id: string;
  topic: string;
  summary: string;
  language: Language;
  timestamp: string;
  sources: WebSource[];
  isWire?: boolean;
  isWatchlistReport?: boolean;
}

export interface TrackedTopic {
  id: string;
  keyword: string;
  context: string;
  language: Language;
  lastChecked?: string;
  createdAt: string;
  isActive: boolean;
}

export interface UserProfile {
  name: string;
  bureau: string;
  idNumber: string;
  isRegistered: boolean;
}

export interface TrackerState {
  isLoading: boolean;
  error: string | null;
  results: NewsResult[];
}

export const PREDEFINED_SOURCES = [
  "The Times of India",
  "The Hindu",
  "Hindustan Times",
  "The Indian Express",
  "The Economic Times",
  "Mint",
  "Business Standard",
  "Dainik Jagran",
  "Lokmat"
];
