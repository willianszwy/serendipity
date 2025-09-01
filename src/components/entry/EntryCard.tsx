import React from 'react';
import { Edit3, Trash2, Calendar, Clock, Link } from 'lucide-react';
import { Entry, Category } from '../../types';
import { COLORS } from '../../constants';
import { getEntryDate, formatDateShort, formatTime } from '../../utils';

export interface EntryCardProps {
  entry: Entry;
  categories: Category[];
  onEdit: (entry: Entry) => void;
  onDelete: (id: number) => void;
  variant?: 'default' | 'compact';
  showActions?: boolean;
}

export const EntryCard: React.FC<EntryCardProps> = ({
  entry,
  categories,
  onEdit,
  onDelete,
  variant = 'default',
  showActions = true
}) => {
  const category = categories.find(cat => cat.id === entry.category);
  const entryDate = getEntryDate(entry);
  
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(entry);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(entry.id);
  };

  const isCompact = variant === 'compact';
  
  return (
    <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {category?.emoji ? (
              <span className={isCompact ? "text-lg" : "text-xl"}>
                {category.emoji}
              </span>
            ) : category?.icon ? (
              React.createElement(category.icon, { 
                className: isCompact ? "w-4 h-4" : "w-5 h-5", 
                style: { color: COLORS.lightText } 
              })
            ) : null}
          </div>
          <span 
            className={`font-poiret font-bold ${isCompact ? "text-sm" : ""}`} 
            style={{ color: COLORS.lightText }}
          >
            {category?.name}
          </span>
        </div>
        
        {showActions && (
          <div className="flex gap-1">
            <button
              onClick={handleEdit}
              className="p-2 rounded hover:bg-white hover:bg-opacity-30 transition-colors"
              style={{ minWidth: '32px', minHeight: '32px' }}
              title="Editar acontecimento"
              aria-label="Editar acontecimento"
            >
              <Edit3 className="w-4 h-4" style={{ color: COLORS.lightText }} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded hover:bg-white hover:bg-opacity-30 transition-colors z-10 relative"
              style={{ minWidth: '32px', minHeight: '32px' }}
              title="Excluir acontecimento"
              aria-label="Excluir acontecimento"
            >
              <Trash2 className="w-4 h-4" style={{ color: COLORS.lightText }} />
            </button>
          </div>
        )}
      </div>
      
      {/* Description */}
      {entry.description && (
        <p 
          className={`mb-2 font-poiret font-bold ${isCompact ? 'text-sm' : ''}`} 
          style={{ color: COLORS.lightText }}
        >
          {entry.description}
        </p>
      )}
      
      {/* Date and Time Info */}
      <div 
        className="flex items-center gap-4 text-sm opacity-80 font-poiret font-bold" 
        style={{ color: COLORS.lightText }}
      >
        {entry.time && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTime(entry.time)}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDateShort(entryDate)}
        </span>
      </div>
      
      {/* Links */}
      {(entry.link1 || entry.link2 || entry.link3) && (
        <div className="mt-2 flex gap-2 flex-wrap">
          {[entry.link1, entry.link2, entry.link3]
            .filter(Boolean)
            .map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm hover:underline transition-colors font-poiret font-bold"
                style={{ color: COLORS.lightText }}
                title={link}
              >
                <Link className="w-3 h-3" />
                Link {index + 1}
              </a>
            ))
          }
        </div>
      )}
    </div>
  );
};