export type CategoryId = 'gratidao' | 'serendipity' | 'manifestacao' | 'desejo' | 'sonho' | 'esp';

export interface Entry {
  id: number;
  category: CategoryId;
  description: string;
  date: string;
  time?: string;
  link1?: string;
  link2?: string;
  link3?: string;
  createdAt: string;
}

export interface CreateEntryData {
  category: CategoryId;
  description: string;
  date: string;
  time?: string;
  link1?: string;
  link2?: string;
  link3?: string;
}

export type UpdateEntryData = Partial<CreateEntryData>;