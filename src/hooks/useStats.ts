import { useMemo } from 'react';
import { Entry, CategoryStats, YearlyStats } from '../types';
import { StatsService } from '../services';

export interface UseStatsReturn {
  // Basic stats
  dailyStats: CategoryStats;
  monthlyStats: CategoryStats;
  yearlyStats: YearlyStats;
  
  // Advanced analytics
  statsSummary: ReturnType<typeof StatsService.getStatsSummary>;
  categoryBreakdown: ReturnType<typeof StatsService.getCategoryBreakdown>;
  dailyStreaks: ReturnType<typeof StatsService.getDailyStreaks>;
  monthlyTrends: ReturnType<typeof StatsService.getMonthlyTrends>;
  topCategories: ReturnType<typeof StatsService.getTopCategories>;
  averages: ReturnType<typeof StatsService.getAverages>;
  
  // Utilities
  getMonthEntries: (month: number, year?: number) => Entry[];
  getTotalEntries: () => number;
  getCurrentYearTotal: () => number;
}

/**
 * Custom hook for calculating and providing statistics from entries
 */
export const useStats = (entries: Entry[]): UseStatsReturn => {
  /**
   * Calculate daily statistics (memoized)
   */
  const dailyStats = useMemo(() => {
    const stats = StatsService.calculateDailyStats(entries);
    console.log('Daily stats calculated:', stats, 'from entries:', entries.length);
    return stats;
  }, [entries]);

  /**
   * Calculate monthly statistics (memoized)
   */
  const monthlyStats = useMemo(() => {
    const stats = StatsService.calculateMonthlyStats(entries);
    console.log('Monthly stats calculated:', stats, 'from entries:', entries.length);
    return stats;
  }, [entries]);

  /**
   * Calculate yearly statistics (memoized)
   */
  const yearlyStats = useMemo(() => {
    return StatsService.calculateYearlyStats(entries);
  }, [entries]);

  /**
   * Get comprehensive stats summary (memoized)
   */
  const statsSummary = useMemo(() => {
    return StatsService.getStatsSummary(entries);
  }, [entries]);

  /**
   * Get category breakdown with percentages (memoized)
   */
  const categoryBreakdown = useMemo(() => {
    return StatsService.getCategoryBreakdown(entries);
  }, [entries]);

  /**
   * Calculate daily streaks (memoized)
   */
  const dailyStreaks = useMemo(() => {
    return StatsService.getDailyStreaks(entries);
  }, [entries]);

  /**
   * Get monthly trends (memoized)
   */
  const monthlyTrends = useMemo(() => {
    return StatsService.getMonthlyTrends(entries);
  }, [entries]);

  /**
   * Get top performing categories (memoized)
   */
  const topCategories = useMemo(() => {
    return StatsService.getTopCategories(entries);
  }, [entries]);

  /**
   * Calculate averages (memoized)
   */
  const averages = useMemo(() => {
    return StatsService.getAverages(entries);
  }, [entries]);

  /**
   * Get entries for a specific month
   */
  const getMonthEntries = useMemo(() => {
    return (month: number, year?: number) => {
      return StatsService.getMonthEntries(entries, month, year);
    };
  }, [entries]);

  /**
   * Get total number of entries
   */
  const getTotalEntries = useMemo(() => {
    return () => entries.length;
  }, [entries]);

  /**
   * Get current year total
   */
  const getCurrentYearTotal = useMemo(() => {
    return () => statsSummary.total.currentYearEntries;
  }, [statsSummary]);

  return {
    // Basic stats
    dailyStats,
    monthlyStats,
    yearlyStats,
    
    // Advanced analytics
    statsSummary,
    categoryBreakdown,
    dailyStreaks,
    monthlyTrends,
    topCategories,
    averages,
    
    // Utilities
    getMonthEntries,
    getTotalEntries,
    getCurrentYearTotal
  };
};