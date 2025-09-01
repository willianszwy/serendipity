import { Category } from '../types';
import { 
  GratitudeIcon, 
  SerendipityIcon, 
  ManifestationIcon, 
  WishIcon, 
  DreamIcon,
  EspIcon
} from '../components/icons';

export const CATEGORIES: Category[] = [
  { id: 'gratidao', name: 'Gratidão', icon: GratitudeIcon, color: 'text-pink-600' },
  { id: 'serendipity', name: 'Serendipity', icon: SerendipityIcon, color: 'text-blue-600' },
  { id: 'manifestacao', name: 'Manifestação', icon: ManifestationIcon, color: 'text-yellow-600' },
  { id: 'desejo', name: 'Novo desejo', icon: WishIcon, color: 'text-purple-600' },
  { id: 'sonho', name: 'Sonho', icon: DreamIcon, color: 'text-indigo-600' },
  { id: 'esp', name: 'ESP', icon: EspIcon, color: 'text-green-600' }
];

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];