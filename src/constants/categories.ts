import { Category } from '../types';
import { 
  SerendipityIcon, 
  ManifestationIcon, 
  WishIcon, 
  DreamIcon,
  EspIcon,
  InsightIcon,
  MeditIcon,
  EuAmoIcon
} from '../components/icons';

export const CATEGORIES: Category[] = [
  { id: 'gratidao', name: 'Eu amo', icon: EuAmoIcon, color: 'text-pink-600' },
  { id: 'serendipity', name: 'Serendipity', icon: SerendipityIcon, color: 'text-blue-600' },
  { id: 'manifestacao', name: 'Manifest', icon: ManifestationIcon, color: 'text-yellow-600' },
  { id: 'desejo', name: 'Novo desejo', icon: WishIcon, color: 'text-purple-600' },
  { id: 'sonho', name: 'Sonho', icon: DreamIcon, color: 'text-indigo-600' },
  { id: 'esp', name: 'ESP', icon: EspIcon, color: 'text-green-600' },
  { id: 'insight', name: 'Insight', icon: InsightIcon, color: 'text-orange-600' },
  { id: 'medit', name: 'Medit', icon: MeditIcon, color: 'text-cyan-600' }
];

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];