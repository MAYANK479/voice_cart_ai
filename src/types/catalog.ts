import { CategoryId } from './shopping';

export type DietaryTag =
  | 'Organic'
  | 'Gluten-Free'
  | 'Vegan'
  | 'Dairy-Free'
  | 'Keto'
  | 'Non-GMO'
  | 'Sugar-Free'
  | 'Low-Fat';

export interface CatalogProduct {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  price: number;
  unit: string;
  size: string;
  inStock: boolean;
  rating: number; // 1 to 5
  reviewCount: number;
  dietaryTags: DietaryTag[];
  description: string;
  popular: boolean;
  onSale?: boolean;
  salePrice?: number;
}
