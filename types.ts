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
  timestamp: Date;
  sources: WebSource[];
}

export interface TrackerState {
  isLoading: boolean;
  error: string | null;
  results: NewsResult[];
}