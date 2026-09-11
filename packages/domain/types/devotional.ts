export interface GlobalSettingsData {
  monthlyVerse: string;
  weeklyVerse: string;
  updatedAt: number;
}

export interface DevotionalData {
  date: string;
  scripture: string;
  reflection: string;
  audioUrl?: string;
  prayerSuggestion: string;
  publishedBy?: string;
  createdAt: number;
}
