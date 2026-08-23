import React, { useState } from 'react';
import { Plus, Heart, ChevronRight } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { CategoryId } from '../../types/shopping';

interface FeaturedProduct {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  unit: string;
  subtitle: string;
  emoji: string;
  bgColor: string;
  discount?: string;
}

const FEATURED_GROCERIES: FeaturedProduct[] = [
  {
    id: 'feat-1',
    name: 'Fresh Strawberries',
    category: 'produce',
    price: 3.89,
    unit: 'pack',
    subtitle: 'Sweet local organic harvest',
    emoji: '🍓',
    bgColor: '#FEF2F2',
    discount: '15% Off',
  },
  {
    id: 'feat-2',
    name: 'Organic Green Cabbage',
    category: 'produce',
    price: 2.10,
    unit: 'kg',
    subtitle: 'Farm fresh crisp greens',
    emoji: '🥬',
    bgColor: '#F0FDF4',
  },
  {
    id: 'feat-3',
    name: 'Fresh Broccoli Crowns',
    category: 'produce',
    price: 2.75,
    unit: 'kg',
    subtitle: 'Rich in vitamin C & iron',
    emoji: '🥦',
    bgColor: '#ECFDF5',
  },
  {
    id: 'feat-4',
    name: 'Valencia Navel Orange',
    category: 'produce',
    price: 3.20,
    unit: 'kg',
    subtitle: 'Juicy sweet citrus fruit',
    emoji: '🍊',
    bgColor: '#FFF7ED',
    discount: '10% Off',
  },
  {
    id: 'feat-5',
    name: 'Fresh Fuji Apples',
    category: 'produce',
    price: 2.99,
    unit: 'lb',
    subtitle: 'Crisp, sweet Honeycrisp',
    emoji: '🍎',
    bgColor: '#FEF2F2',
  },
  {
    id: 'feat-6',
    name: 'Pasture Raised Eggs',
    category: 'dairy',
    price: 4.99,
    unit: 'carton',
    subtitle: 'Grade A Large Organic',
    emoji: '🥚',
    bgColor: '#FEFCE8',
  },
];

export const PopularProductsGrid: React.FC = () => {
  const { addItem, setCatalogModalOpen } = useShopping();
  const [favorites, setFavorites] = useState<string[]>(['feat-1', 'feat-5']);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const handleAdd = (item: FeaturedProduct) => {
    addItem({
      name: item.name,
      quantity: 1,
      unit: item.unit,
      category: item.category,
      estimatedPrice: item.price,
      source: 'catalog',
    });
  };

  return (
    <div className="simi-popular-section">
      <div className="simi-section-header">
        <h2 className="simi-section-title">Popular Products</h2>
        <button className="simi-view-all" onClick={() => setCatalogModalOpen(true)}>
          <span>View More</span>
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="simi-products-grid">
        {FEATURED_GROCERIES.map((prod) => {
          const isFav = favorites.includes(prod.id);
          return (
            <div key={prod.id} className="simi-product-card">
              {/* Discount Tag or Favorite Heart */}
              <div className="simi-card-top">
                {prod.discount ? (
                  <span className="simi-discount-tag">{prod.discount}</span>
                ) : (
                  <span />
                )}
                <button
                  className={`simi-heart-btn ${isFav ? 'active' : ''}`}
                  onClick={(e) => toggleFavorite(prod.id, e)}
                  aria-label="Save to favorites"
                >
                  <Heart size={15} fill={isFav ? '#EF4444' : 'none'} color={isFav ? '#EF4444' : '#9CA3AF'} />
                </button>
              </div>

              {/* Product Visual */}
              <div className="simi-product-thumb" style={{ backgroundColor: prod.bgColor }}>
                <span className="simi-thumb-emoji">{prod.emoji}</span>
              </div>

              {/* Product Info */}
              <div className="simi-product-info">
                <h3 className="simi-product-name">{prod.name}</h3>
                <p className="simi-product-sub">{prod.subtitle}</p>
              </div>

              {/* Price & Add Button */}
              <div className="simi-product-footer">
                <div className="simi-product-price">
                  <span className="price-num">${prod.price.toFixed(2)}</span>
                  <span className="price-unit">/{prod.unit}</span>
                </div>

                <button
                  className="simi-btn-add"
                  onClick={() => handleAdd(prod)}
                  title={`Add ${prod.name} to cart`}
                  aria-label={`Add ${prod.name}`}
                >
                  <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
