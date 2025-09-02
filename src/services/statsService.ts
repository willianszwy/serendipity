import { Entry, CategoryStats, YearlyStats } from '../types';
import { CATEGORIES } from '../constants';
import { 
  getEntryDate, 
  isToday, 
  isInCurrentMonth, 
  isInMonth, 
  getCurrentYearEntries,
  groupEntriesByDate 
} from '../utils';

/**
 * Service for calculating statistics from entries
 */
export class StatsService {
  /**
   * Initialize empty category stats
   */
  private static createEmptyCategoryStats(): CategoryStats {
    const stats: Partial<CategoryStats> = {};
    CATEGORIES.forEach(category => {
      stats[category.id] = 0;
    });
    return stats as CategoryStats;
  }

  /**
   * Calculate stats for a specific set of entries
   */
  private static calculateCategoryStats(entries: Entry[]): CategoryStats {
    const stats = this.createEmptyCategoryStats();
    console.log('Initial empty stats:', stats);
    
    entries.forEach(entry => {
      console.log(`Processing entry ${entry.id} with category '${entry.category}'`);
      if (stats[entry.category] !== undefined) {
        stats[entry.category]++;
        console.log(`Incremented ${entry.category} to ${stats[entry.category]}`);
      } else {
        console.log(`Category '${entry.category}' not found in stats object`);
      }
    });
    
    console.log('Final calculated stats:', stats);
    return stats;
  }

  /**
   * Calculate daily statistics (today's entries)
   */
  static calculateDailyStats(entries: Entry[]): CategoryStats {
    console.log('=== CALCULATING DAILY STATS ===');
    console.log('Total entries available:', entries.length);
    
    const today = new Date();
    console.log('Today is:', today.toDateString());
    
    const todayEntries = entries.filter(entry => {
      const entryDate = getEntryDate(entry);
      const isTodayMatch = isToday(entryDate);
      console.log(`Entry ${entry.id}: ${entryDate.toDateString()} - isToday: ${isTodayMatch}`);
      return isTodayMatch;
    });
    
    console.log('Filtered today entries:', todayEntries.length);
    console.log('Today entries for stats:', todayEntries.map(e => ({ id: e.id, category: e.category, date: e.date })));
    
    const stats = this.calculateCategoryStats(todayEntries);
    console.log('=== END DAILY STATS ===');
    return stats;
  }

  /**
   * Calculate monthly statistics (current month's entries)
   */
  static calculateMonthlyStats(entries: Entry[]): CategoryStats {
    console.log('=== CALCULATING MONTHLY STATS ===');
    console.log('Total entries available:', entries.length);
    
    const now = new Date();
    console.log('Current month/year:', now.getMonth(), '/', now.getFullYear());
    
    const monthEntries = entries.filter(entry => {
      const entryDate = getEntryDate(entry);
      const isCurrentMonthMatch = isInCurrentMonth(entryDate);
      console.log(`Entry ${entry.id}: ${entryDate.toDateString()} (${entryDate.getMonth()}/${entryDate.getFullYear()}) - isCurrentMonth: ${isCurrentMonthMatch}`);
      return isCurrentMonthMatch;
    });
    
    console.log('Filtered month entries:', monthEntries.length);
    console.log('Month entries for stats:', monthEntries.map(e => ({ id: e.id, category: e.category, date: e.date })));
    
    const stats = this.calculateCategoryStats(monthEntries);
    console.log('=== END MONTHLY STATS ===');
    return stats;
  }

  /**
   * Calculate yearly statistics by month
   */
  static calculateYearlyStats(entries: Entry[], year?: number): YearlyStats {
    const targetYear = year || new Date().getFullYear();
    const yearlyStats: YearlyStats = {};
    
    // Initialize all months with empty stats
    for (let month = 0; month < 12; month++) {
      yearlyStats[month] = this.createEmptyCategoryStats();
    }
    
    // Filter entries for the target year and calculate stats per month
    const yearEntries = entries.filter(entry => {
      const entryDate = getEntryDate(entry);
      return entryDate.getFullYear() === targetYear;
    });
    
    yearEntries.forEach(entry => {
      const entryDate = getEntryDate(entry);
      const month = entryDate.getMonth();
      
      if (yearlyStats[month][entry.category] !== undefined) {
        yearlyStats[month][entry.category]++;
      }
    });
    
    return yearlyStats;
  }

  /**
   * Get entries for a specific month and year
   */
  static getMonthEntries(entries: Entry[], month: number, year?: number): Entry[] {
    const targetYear = year || new Date().getFullYear();
    return entries.filter(entry => {
      const entryDate = getEntryDate(entry);
      return isInMonth(entryDate, month, targetYear);
    }).sort((a, b) => {
      const dateA = getEntryDate(a);
      const dateB = getEntryDate(b);
      return dateB.getTime() - dateA.getTime();
    });
  }

  /**
   * Get comprehensive statistics summary
   */
  static getStatsSummary(entries: Entry[]) {
    const currentYear = new Date().getFullYear();
    const totalEntries = entries.length;
    const currentYearEntries = getCurrentYearEntries(entries);
    
    return {
      total: {
        entries: totalEntries,
        currentYearEntries: currentYearEntries.length
      },
      daily: this.calculateDailyStats(entries),
      monthly: this.calculateMonthlyStats(entries),
      yearly: this.calculateYearlyStats(entries, currentYear),
      categories: this.getCategoryBreakdown(entries)
    };
  }

  /**
   * Get category breakdown with percentages
   */
  static getCategoryBreakdown(entries: Entry[]) {
    const categoryStats = this.calculateCategoryStats(entries);
    const total = entries.length;
    
    const breakdown = CATEGORIES.map(category => {
      const count = categoryStats[category.id];
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      
      return {
        id: category.id,
        name: category.name,
        emoji: category.emoji,
        icon: category.icon,
        count,
        percentage
      };
    });
    
    return breakdown.sort((a, b) => b.count - a.count);
  }

  /**
   * Get streak information for daily entries
   */
  static getDailyStreaks(entries: Entry[]) {
    const entriesByDate = groupEntriesByDate(entries);
    const dates = Object.keys(entriesByDate)
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let currentStreak = 0;
    let longestStreak = 0;
    // let streakCount = 0; // Currently unused
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate current streak
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      date.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (date.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Calculate longest streak
    let tempStreak = 0;
    let lastDate: Date | null = null;
    
    dates.forEach(date => {
      const currentDate = new Date(date);
      currentDate.setHours(0, 0, 0, 0);
      
      if (lastDate) {
        const daysDiff = Math.round((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      
      lastDate = currentDate;
    });
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return {
      current: currentStreak,
      longest: longestStreak,
      totalDaysWithEntries: dates.length
    };
  }

  /**
   * Get monthly trends (comparing with previous months)
   */
  static getMonthlyTrends(entries: Entry[]) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthStats = this.calculateCategoryStats(
      entries.filter(entry => isInMonth(getEntryDate(entry), currentMonth, currentYear))
    );
    
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const previousMonthStats = this.calculateCategoryStats(
      entries.filter(entry => isInMonth(getEntryDate(entry), previousMonth, previousYear))
    );
    
    const trends = CATEGORIES.map(category => {
      const current = currentMonthStats[category.id];
      const previous = previousMonthStats[category.id];
      const change = current - previous;
      const changePercent = previous > 0 ? Math.round((change / previous) * 100) : 0;
      
      return {
        categoryId: category.id,
        current,
        previous,
        change,
        changePercent,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
      };
    });
    
    return trends;
  }

  /**
   * Get best performing categories (highest counts)
   */
  static getTopCategories(entries: Entry[], limit = 3) {
    const categoryStats = this.calculateCategoryStats(entries);
    
    return CATEGORIES
      .map(category => ({
        ...category,
        count: categoryStats[category.id]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Calculate average entries per day/month
   */
  static getAverages(entries: Entry[]) {
    if (entries.length === 0) {
      return { daily: 0, monthly: 0 };
    }
    
    // const entriesByDate = groupEntriesByDate(entries);
    // const uniqueDays = Object.keys(entriesByDate).length; // Currently unused
    
    const oldestEntry = entries.reduce((oldest, entry) => {
      const entryDate = getEntryDate(entry);
      const oldestDate = getEntryDate(oldest);
      return entryDate < oldestDate ? entry : oldest;
    });
    
    const daysSinceStart = Math.max(1, 
      Math.ceil((Date.now() - getEntryDate(oldestEntry).getTime()) / (1000 * 60 * 60 * 24))
    );
    
    const monthsSinceStart = Math.max(1, Math.ceil(daysSinceStart / 30));
    
    return {
      daily: Math.round((entries.length / daysSinceStart) * 100) / 100,
      monthly: Math.round((entries.length / monthsSinceStart) * 100) / 100
    };
  }
}