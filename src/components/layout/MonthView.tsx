import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Entry, Category } from '../../types';
import { COLORS, MONTHS } from '../../constants';
import { EntryCard } from '../entry/EntryCard';
import { formatDatePT, groupEntriesByDate } from '../../utils';

export interface MonthViewProps {
  entries: Entry[];
  categories: Category[];
  monthIndex: number;
  year: number;
  onBack: () => void;
  onEdit: (entry: Entry) => void;
  onDelete: (id: number) => void;
  className?: string;
}

export const MonthView: React.FC<MonthViewProps> = ({
  entries,
  categories,
  monthIndex,
  year,
  onBack,
  onEdit,
  onDelete,
  className = ''
}) => {
  const groupedEntries = groupEntriesByDate(entries);
  const monthName = MONTHS[monthIndex];
  const totalEntries = entries.length;

  return (
    <div 
      className={`min-h-screen ${className}`} 
      style={{ 
        backgroundColor: COLORS.background, 
        fontFamily: 'Raleway, sans-serif' 
      }}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
            title="Voltar para visão principal"
            aria-label="Voltar para visão principal"
          >
            <ChevronLeft className="w-6 h-6" style={{ color: COLORS.primaryText }} />
          </button>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold" style={{ color: COLORS.primaryText }}>
              {monthName} {year}
            </h2>
            {totalEntries > 0 && (
              <p className="text-sm opacity-75 mt-1" style={{ color: COLORS.primaryText }}>
                {totalEntries} {totalEntries === 1 ? 'acontecimento' : 'acontecimentos'} registrado{totalEntries > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Entries by Date */}
        <div className="space-y-4">
          {Object.entries(groupedEntries)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime()) // Most recent first
            .map(([date, dayEntries]) => (
              <div 
                key={date} 
                className="rounded-lg p-4 shadow-lg" 
                style={{ backgroundColor: COLORS.dailyCard }}
              >
                <h3 className="mb-3 text-lg font-semibold" style={{ color: COLORS.lightText }}>
                  {formatDatePT(new Date(date))}
                  <span className="ml-2 text-sm opacity-75">
                    ({dayEntries.length} {dayEntries.length === 1 ? 'registro' : 'registros'})
                  </span>
                </h3>
                
                <div className="space-y-3">
                  {dayEntries
                    .sort((a, b) => {
                      // Sort by time if both have time, otherwise by creation date
                      if (a.time && b.time) {
                        return b.time.localeCompare(a.time);
                      }
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    })
                    .map(entry => (
                      <EntryCard 
                        key={entry.id} 
                        entry={entry} 
                        categories={categories}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>

        {/* Empty State */}
        {Object.keys(groupedEntries).length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: COLORS.dailyCard }}
              >
                <span className="text-2xl opacity-50">📅</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.primaryText }}>
              Nenhum acontecimento em {monthName.toLowerCase()}
            </h3>
            <p className="opacity-75" style={{ color: COLORS.primaryText }}>
              Que tal adicionar algo especial que aconteceu este mês?
            </p>
          </div>
        )}
      </div>
    </div>
  );
};