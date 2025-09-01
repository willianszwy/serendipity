import React, { useMemo } from 'react';
import { Entry, Category } from '../../types';
import { COLORS } from '../../constants';
import { EntryCard } from '../entry/EntryCard';
import { isToday, getEntryDate, sortEntriesByDate } from '../../utils';

export interface TodayEntriesProps {
  entries: Entry[];
  categories: Category[];
  onEdit: (entry: Entry) => void;
  onDelete: (id: number) => void;
  className?: string;
  showTitle?: boolean;
  maxEntries?: number;
}

export const TodayEntries: React.FC<TodayEntriesProps> = ({
  entries,
  categories,
  onEdit,
  onDelete,
  className = '',
  showTitle = true,
  maxEntries
}) => {
  // Get and sort today's entries
  const todayEntries = useMemo(() => {
    const filtered = entries.filter(entry => isToday(getEntryDate(entry)));
    const sorted = sortEntriesByDate(filtered, false); // newest first
    
    return maxEntries ? sorted.slice(0, maxEntries) : sorted;
  }, [entries, maxEntries]);

  // Don't render if no entries today
  if (todayEntries.length === 0) {
    return null;
  }

  const hasMoreEntries = maxEntries && entries.filter(entry => isToday(getEntryDate(entry))).length > maxEntries;

  return (
    <div 
      className={`rounded-lg p-6 mb-6 shadow-lg ${className}`} 
      style={{ backgroundColor: COLORS.dailyCard }}
    >
      {showTitle && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" style={{ color: COLORS.lightText }}>
            Acontecimentos de Hoje
          </h2>
          <span 
            className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium"
            style={{ color: COLORS.lightText }}
          >
            {todayEntries.length} {todayEntries.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>
      )}
      
      <div className="space-y-3">
        {todayEntries.map(entry => (
          <EntryCard
            key={entry.id}
            entry={entry}
            categories={categories}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {hasMoreEntries && (
        <div className="mt-4 text-center">
          <p 
            className="text-sm opacity-75"
            style={{ color: COLORS.lightText }}
          >
            + {entries.filter(entry => isToday(getEntryDate(entry))).length - maxEntries!} mais registros hoje
          </p>
        </div>
      )}
    </div>
  );
};