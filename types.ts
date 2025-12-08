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
  timestamp: string; // Changed to string for serialization in localStorage
  sources: WebSource[];
  isWire?: boolean; // To distinguish between topic search and generic wire feed
}

export interface TrackerState {
  isLoading: boolean;
  error: string | null;
  results: NewsResult[];
}

// List of predefined sources for the user to select
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