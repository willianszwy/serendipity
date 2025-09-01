import { Category } from '../types';
import { EspIcon } from '../components/icons';

export const CATEGORIES: Category[] = [
  { id: 'gratidao', name: 'Gratidão', emoji: '💖', color: 'text-pink-600' },
  { id: 'serendipity', name: 'Serendipity', emoji: '🦋', color: 'text-blue-600' },
  { id: 'manifestacao', name: 'Manifestação', emoji: '🌟', color: 'text-yellow-600' },
  { id: 'desejo', name: 'Novo desejo', emoji: '🚀', color: 'text-purple-600' },
  { id: 'esp', name: 'ESP', icon: EspIcon, color: 'text-amber-600' }
];

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];