import React from 'react';
import { Category, YearlyStats } from '../../types';
import { COLORS, MONTHS } from '../../constants';

export interface YearlyScoreCardProps {
  yearlyStats: YearlyStats;
  categories: Category[];
  onMonthClick?: (monthIndex: number) => void;
  currentYear?: number;
  className?: string;
  showTitle?: boolean;
}

export const YearlyScoreCard: React.FC<YearlyScoreCardProps> = ({
  yearlyStats,
  categories,
  onMonthClick,
  currentYear = new Date().getFullYear(),
  className = '',
  showTitle = true
}) => {
  const handleMonthClick = (monthIndex: number) => {
    if (onMonthClick) {
      onMonthClick(monthIndex);
    }
  };

  // Calculate totals for each month
  const getMonthTotal = (monthIndex: number): number => {
    const monthStats = yearlyStats[monthIndex];
    if (!monthStats) return 0;
    
    return categories.reduce((total, category) => {
      return total + (monthStats[category.id] || 0);
    }, 0);
  };

  // Calculate category totals for the year
  const getCategoryYearTotal = (categoryId: string): number => {
    return Object.values(yearlyStats).reduce((total, monthStats) => {
      return total + (monthStats[categoryId] || 0);
    }, 0);
  };

  const totalEntries = categories.reduce((total, category) => {
    return total + getCategoryYearTotal(category.id);
  }, 0);

  return (
    <div 
      className={`rounded-lg p-6 mb-6 shadow-lg ${className}`} 
      style={{ backgroundColor: COLORS.yearlyCard }}
    >
      {showTitle && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold" style={{ color: COLORS.primaryText }}>
            Placar Anual
          </h2>
          <div className="text-base opacity-75" style={{ color: COLORS.primaryText }}>
            {currentYear} • {totalEntries} registros
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th 
                className="text-left p-2 font-semibold" 
                style={{ color: COLORS.primaryText }}
              >
                Mês
              </th>
              {categories.map(category => (
                <th key={category.id} className="text-center p-2">
                  <div 
                    className="flex justify-center items-center"
                    title={category.name}
                  >
                    {category.emoji ? (
                      <span className="text-2xl">{category.emoji}</span>
                    ) : category.icon ? (
                      React.createElement(category.icon, { 
                        className: "w-6 h-6", 
                        style: { color: COLORS.primaryText } 
                      })
                    ) : (
                      <span className="text-sm font-medium" style={{ color: COLORS.primaryText }}>
                        {category.name}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th 
                className="text-center p-2 font-semibold" 
                style={{ color: COLORS.primaryText }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {MONTHS.map((month, index) => {
              const monthTotal = getMonthTotal(index);
              
              return (
                <tr 
                  key={month}
                  className={`transition-colors ${
                    onMonthClick 
                      ? 'cursor-pointer hover:bg-black hover:bg-opacity-10' 
                      : ''
                  } ${monthTotal > 0 ? 'bg-black bg-opacity-5' : ''}`}
                  onClick={() => handleMonthClick(index)}
                  title={onMonthClick ? `Clique para ver detalhes de ${month}` : undefined}
                >
                  <td 
                    className="p-2 font-medium" 
                    style={{ color: COLORS.primaryText }}
                  >
                    {month}
                  </td>
                  {categories.map(category => {
                    const count = yearlyStats[index]?.[category.id] || 0;
                    
                    return (
                      <td key={category.id} className="text-center p-2">
                        <span 
                          className={`text-lg ${count > 0 ? 'font-semibold' : 'opacity-50'}`} 
                          style={{ color: COLORS.primaryText }}
                        >
                          {count}
                        </span>
                      </td>
                    );
                  })}
                  <td className="text-center p-2">
                    <span 
                      className={`text-lg font-bold ${monthTotal > 0 ? '' : 'opacity-50'}`} 
                      style={{ color: COLORS.primaryText }}
                    >
                      {monthTotal}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-black border-opacity-20">
              <th 
                className="text-left p-2 font-bold" 
                style={{ color: COLORS.primaryText }}
              >
                Total Anual
              </th>
              {categories.map(category => {
                const yearTotal = getCategoryYearTotal(category.id);
                
                return (
                  <th key={category.id} className="text-center p-2">
                    <span 
                      className="text-lg font-bold" 
                      style={{ color: COLORS.primaryText }}
                    >
                      {yearTotal}
                    </span>
                  </th>
                );
              })}
              <th className="text-center p-2">
                <span 
                  className="text-xl font-bold" 
                  style={{ color: COLORS.primaryText }}
                >
                  {totalEntries}
                </span>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};