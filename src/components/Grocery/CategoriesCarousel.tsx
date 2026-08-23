import React from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { CategoryId } from '../../types/shopping';

interface CategoryPill {
  id: CategoryId;
  name: string;
  emoji: string;
  bgColor: string;
}

const GROCERY_CATEGORIES: CategoryPill[] = [
  { id: 'produce', name: 'Fruits & Veggies', emoji: '🍎', bgColor: '#FEF2F2' },
  { id: 'bakery', name: 'Bread & Bakery', emoji: '🍞', bgColor: '#FFFBEB' },
  { id: 'dairy', name: 'Dairy & Eggs', emoji: '🥛', bgColor: '#EFF6FF' },
  { id: 'meat', name: 'Fresh Meat', emoji: '🥩', bgColor: '#FEF2F2' },
  { id: 'beverages', name: 'Drinks & Juice', emoji: '🧃', bgColor: '#ECFEFF' },
  { id: 'snacks', name: 'Snacks & Sweets', emoji: '🥨', bgColor: '#FDF2F8' },
  { id: 'pantry', name: 'Grains & Pasta', emoji: '🥫', bgColor: '#F5F3FF' },
  { id: 'household', name: 'Home & Clean', emoji: '🧼', bgColor: '#F0FDF4' },
];

export const CategoriesCarousel: React.FC = () => {
  const { setCatalogModalOpen, setCatalogSearchQuery, setCatalogCategoryFilter } = useShopping();

  const handleCategoryClick = (cat: CategoryPill) => {
    setCatalogCategoryFilter(cat.id);
    setCatalogSearchQuery('');
    setCatalogModalOpen(true);
  };



  return (
    <div className="simi-categories-section">
      <div className="simi-section-header">
        <h2 className="simi-section-title">Categories</h2>
        <div className="simi-header-actions">
          <button className="btn-simi-filter" onClick={() => setCatalogModalOpen(true)}>
            <Filter size={14} color="#059669" />
            <span>Filter</span>
          </button>
          <div className="simi-scroll-arrows">
            <button className="btn-arrow" aria-label="Scroll left">
              <ChevronLeft size={16} />
            </button>
            <button className="btn-arrow" aria-label="Scroll right">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="simi-categories-scroll">
        {GROCERY_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="simi-category-card"
            onClick={() => handleCategoryClick(cat)}
            title={`Browse ${cat.name}`}

          >
            <div className="simi-category-icon-box" style={{ backgroundColor: cat.bgColor }}>
              <span className="simi-category-emoji">{cat.emoji}</span>
            </div>
            <span className="simi-category-name">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
