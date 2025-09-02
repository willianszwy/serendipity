import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Entry, Category, CreateEntryData } from '../../types';
import { COLORS, CONFIG } from '../../constants';
import { useFormValidation } from '../../hooks';
import { getCurrentDateString, formatCharacterCount } from '../../utils';

export interface EntryFormProps {
  entry?: Entry;
  categories: Category[];
  onSave: (data: CreateEntryData) => void;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

interface FormData {
  category: string;
  description: string;
  date: string;
  time: string;
  link1: string;
  link2: string;
  link3: string;
}

export const EntryForm: React.FC<EntryFormProps> = ({
  entry,
  categories,
  onSave,
  onCancel,
  loading = false,
  className = ''
}) => {
  const { errors, validate, clearError } = useFormValidation();
  
  const [formData, setFormData] = useState<FormData>({
    category: entry?.category || '',
    description: entry?.description || '',
    date: entry?.date || getCurrentDateString(),
    time: entry?.time || '',
    link1: entry?.link1 || '',
    link2: entry?.link2 || '',
    link3: entry?.link3 || ''
  });

  // Update form data when entry prop changes
  useEffect(() => {
    if (entry) {
      setFormData({
        category: entry.category || '',
        description: entry.description || '',
        date: entry.date || getCurrentDateString(),
        time: entry.time || '',
        link1: entry.link1 || '',
        link2: entry.link2 || '',
        link3: entry.link3 || ''
      });
    } else {
      setFormData({
        category: '',
        description: '',
        date: getCurrentDateString(),
        time: '',
        link1: '',
        link2: '',
        link3: ''
      });
    }
  }, [entry]);

  // Update form field with validation
  const updateFormField = useCallback((
    field: keyof FormData, 
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      clearError(field);
    }
  }, [errors, clearError]);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;

    // Convert FormData to CreateEntryData
    const entryData: CreateEntryData = {
      category: formData.category as any, // Type assertion needed here
      description: formData.description,
      date: formData.date,
      time: formData.time || undefined,
      link1: formData.link1 || undefined,
      link2: formData.link2 || undefined,
      link3: formData.link3 || undefined
    };

    // Validate before submitting
    if (validate(entryData)) {
      onSave(entryData);
    }
  }, [formData, loading, validate, onSave]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel, loading]);

  const isSubmitDisabled = !formData.category || !formData.description.trim() || loading;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ${className}`} style={{ zIndex: CONFIG.UI.MODAL_Z_INDEX }}>
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md overflow-y-auto shadow-xl"
        style={{ maxHeight: CONFIG.UI.MODAL_MAX_HEIGHT }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl font-borel" style={{ color: COLORS.primaryText }}>
            {entry ? 'Editar' : 'Adicionar'} Acontecimento
          </h2>
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Fechar"
            aria-label="Fechar formulário"
          >
            <X className="w-5 h-5" style={{ color: COLORS.primaryText }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block font-semibold mb-2 font-borel" style={{ color: COLORS.primaryText }}>
              Categoria *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  disabled={loading}
                  onClick={() => updateFormField('category', category.id)}
                  className={`p-3 rounded-lg border-2 transition-colors disabled:opacity-50 ${
                    formData.category === category.id
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={`Selecionar categoria ${category.name}`}
                >
                  <div className="text-2xl mb-1 flex justify-center items-center">
                    {category.emoji ? (
                      category.emoji
                    ) : category.icon ? (
                      React.createElement(category.icon, { 
                        className: "w-6 h-6", 
                        style: { color: COLORS.primaryText } 
                      })
                    ) : null}
                  </div>
                  <div className="text-sm font-medium font-borel" style={{ color: COLORS.primaryText }}>
                    {category.name}
                  </div>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block font-semibold mb-2 font-borel" style={{ color: COLORS.primaryText }}>
              Data *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => updateFormField('date', e.target.value)}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50 disabled:bg-gray-50"
              required
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-2 font-borel" style={{ color: COLORS.primaryText }}>
              Descrição *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormField('description', e.target.value)}
              maxLength={CONFIG.VALIDATION.DESCRIPTION_MAX_LENGTH}
              rows={3}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50 disabled:bg-gray-50"
              placeholder="Descreva o acontecimento..."
              required
            />
            <div className="flex justify-between items-center mt-1">
              <div className="text-sm text-gray-500">
                {formatCharacterCount(formData.description, CONFIG.VALIDATION.DESCRIPTION_MAX_LENGTH)}
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block font-semibold mb-2 font-borel" style={{ color: COLORS.primaryText }}>
              Hora (opcional)
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => updateFormField('time', e.target.value)}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50 disabled:bg-gray-50"
            />
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time}</p>
            )}
          </div>

          {/* Links */}
          <div>
            <label className="block font-semibold mb-2 font-borel" style={{ color: COLORS.primaryText }}>
              Links (opcionais)
            </label>
            {[1, 2, 3].map(num => {
              const fieldName = `link${num}` as keyof FormData;
              return (
                <div key={num} className="mb-2">
                  <input
                    type="url"
                    value={formData[fieldName]}
                    onChange={(e) => updateFormField(fieldName, e.target.value)}
                    disabled={loading}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50 disabled:bg-gray-50"
                    placeholder={`Link ${num} (https://...)`}
                  />
                  {errors[fieldName] && (
                    <p className="text-red-500 text-sm mt-1">{errors[fieldName]}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* General Errors */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              style={{ color: COLORS.primaryText }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="flex-1 py-3 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};