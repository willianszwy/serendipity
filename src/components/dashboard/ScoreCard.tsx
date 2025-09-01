import React from 'react';
import { Category, CategoryStats } from '../../types';
import { COLORS } from '../../constants';

export interface ScoreCardProps {
  title: string;
  stats: CategoryStats;
  backgroundColor: string;
  categories: Category[];
  variant?: 'default' | 'compact';
  showTitle?: boolean;
  className?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  stats,
  backgroundColor,
  categories,
  variant = 'default',
  showTitle = true,
  className = ''
}) => {
  const isCompact = variant === 'compact';

  return (
    <div 
      className={`rounded-lg p-6 mb-6 shadow-lg ${className}`} 
      style={{ backgroundColor }}
    >
      {showTitle && (
        <h2 
          className={`font-borel mb-4 ${isCompact ? 'text-3xl mb-3' : 'text-4xl'}`} 
          style={{ color: COLORS.lightText }}
        >
          {title}
        </h2>
      )}
      
      <div className={`grid gap-4 ${isCompact ? 'grid-cols-5 gap-2' : 'grid-cols-2 md:grid-cols-5'}`}>
        {categories.map(category => {
          const count = stats[category.id] || 0;
          
          return (
            <div key={category.id} className="text-center">
              <div className={`mb-2 flex justify-center items-center ${isCompact ? 'text-3xl mb-1' : 'text-4xl'}`}>
                {category.emoji ? (
                  category.emoji
                ) : category.icon ? (
                  React.createElement(category.icon, { 
                    className: isCompact ? "w-8 h-8" : "w-10 h-10", 
                    style: { color: COLORS.lightText } 
                  })
                ) : null}
              </div>
              
              {!isCompact && (
                <div 
                  className="text-base font-borel font-bold" 
                  style={{ color: COLORS.lightText }}
                >
                  {category.name}
                </div>
              )}
              
              <div 
                className={`font-bold mt-1 ${isCompact ? 'text-xl' : 'text-3xl'}`} 
                style={{ color: COLORS.lightText }}
                title={`${category.name}: ${count}`}
              >
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};