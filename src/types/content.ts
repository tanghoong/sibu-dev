// src/types/content.ts

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  youtubeLink: string;
  content: string;
}

export interface ContentPageProps {
  category: string;
  id: string;
}

export interface ContentManagerState {
  items: ContentItem[];
  loading: boolean;
  error: string | null;
}

export interface ContentManager {
  getAll: () => Promise<ContentItem[]>;
  getById: (id: string) => Promise<ContentItem | undefined>;
  getByCategory: (category: string) => Promise<ContentItem[]>;
  addBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  getBookmarks: () => ContentItem[];
}
