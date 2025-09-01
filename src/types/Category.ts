import React from 'react';
import { CategoryId } from './Entry';

export interface Category {
  id: CategoryId;
  name: string;
  emoji?: string;
  icon?: React.ComponentType<any>;
  color: string;
}