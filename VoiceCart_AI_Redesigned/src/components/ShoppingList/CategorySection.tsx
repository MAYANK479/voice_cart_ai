import React from 'react';
import { CategoryId, ShoppingItem } from '../../types/shopping';
import { CATEGORIES } from '../../data/categories';
import { ShoppingItemCard } from './ShoppingItemCard';

interface CategorySectionProps {
  categoryId: CategoryId;
  items: ShoppingItem[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({ categoryId, items }) => {
  const categoryInfo = CATEGORIES[categoryId] || CATEGORIES.other;
  const categoryTotal = items.reduce((sum, item) => sum + item.estimatedPrice * item.quantity, 0);

  if (items.length === 0) return null;

  return (
    <div className="category-group">
      <div className="category-header">
        <div className="category-title-badge">
          <span>{categoryInfo.emoji}</span>
          <span style={{ color: categoryInfo.color }}>{categoryInfo.name}</span>
          <span className="badge-counter" style={{ background: categoryInfo.bgColor, color: categoryInfo.color, borderColor: categoryInfo.color }}>
            {items.length}
          </span>
        </div>

        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          Subtotal: <strong style={{ color: 'var(--text-primary)' }}>${categoryTotal.toFixed(2)}</strong>
        </div>
      </div>

      <div className="items-grid">
        {items.map((item) => (
          <ShoppingItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
