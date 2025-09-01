import { CategoryId } from './Entry';

export type CategoryStats = {
  [K in CategoryId]: number;
};

export interface MonthlyStats {
  [month: number]: CategoryStats;
}

export interface YearlyStats extends MonthlyStats {}

export interface GroupedEntries {
  [dateKey: string]: Array<import('./Entry').Entry>;
}