import React, { useState, useMemo } from 'react';
import { X, Search, Filter, Plus, Star, Tag } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { CategoryId } from '../../types/shopping';
import { CATEGORIES } from '../../data/categories';
import { DietaryTag } from '../../types/catalog';

const DIETARY_FILTERS: DietaryTag[] = [
  'Organic',
  'Gluten-Free',
  'Vegan',
  'Dairy-Free',
  'Keto',
  'Sugar-Free',
  'Low-Fat',
];

export const CatalogModal: React.FC = () => {
  const {
    catalog,
    catalogModalOpen,
    setCatalogModalOpen,
    catalogSearchQuery,
    setCatalogSearchQuery,
    catalogMaxPrice,
    setCatalogMaxPrice,
    addItem,
  } = useShopping();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedDietaryTag, setSelectedDietaryTag] = useState<DietaryTag | 'all'>('all');

  // Filter catalog products based on search, category, dietary, and price bounds
  const filteredProducts = useMemo(() => {
    return catalog.filter((product) => {
      // 1. Text Search match
      if (catalogSearchQuery.trim()) {
        const q = catalogSearchQuery.toLowerCase();
        const matchesText =
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q);
        if (!matchesText) return false;
      }

      // 2. Category match
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Dietary tag match
      if (selectedDietaryTag !== 'all' && !product.dietaryTags.includes(selectedDietaryTag)) {
        return false;
      }

      // 4. Max price match
      const effectivePrice = product.onSale && product.salePrice ? product.salePrice : product.price;
      if (catalogMaxPrice !== null && effectivePrice > catalogMaxPrice) {
        return false;
      }

      return true;
    });
  }, [catalog, catalogSearchQuery, selectedCategory, selectedDietaryTag, catalogMaxPrice]);

  if (!catalogModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setCatalogModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search size={22} color="var(--accent-primary)" />
            <div>
              <h3>Store Product Catalog</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Search by name, category, or say <span style={{ color: 'var(--accent-cyan)' }}>"Find apples under $5"</span>
              </p>
            </div>
          </div>
          <button
            className="btn-icon"
            onClick={() => setCatalogModalOpen(false)}
            title="Close catalog modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Search and Filters Bar */}
          <div className="catalog-filter-bar">
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <input
                type="text"
                className="catalog-search-input"
                style={{ width: '100%', paddingLeft: '2.5rem' }}
                placeholder="Search by product name, brand, or attributes..."
                value={catalogSearchQuery}
                onChange={(e) => setCatalogSearchQuery(e.target.value)}
              />
              <Search
                size={16}
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
            </div>

            {/* Max Price Filter Indicator / Reset */}
            {catalogMaxPrice !== null && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: '#67e8f9',
                }}
              >
                <span>Price: ≤ ${catalogMaxPrice.toFixed(2)}</span>
                <button
                  onClick={() => setCatalogMaxPrice(null)}
                  style={{ background: 'transparent', border: 'none', color: '#67e8f9', cursor: 'pointer' }}
                  title="Remove price filter"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Category Dropdown Filter */}
            <select
              className="select-language"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as CategoryId | 'all')}
              aria-label="Filter by Category"
            >
              <option value="all">All Departments (All)</option>
              {Object.entries(CATEGORIES).map(([id, info]) => (
                <option key={id} value={id}>
                  {info.emoji} {info.name}
                </option>
              ))}
            </select>

            {/* Dietary Tag Dropdown Filter */}
            <select
              className="select-language"
              value={selectedDietaryTag}
              onChange={(e) => setSelectedDietaryTag(e.target.value as DietaryTag | 'all')}
              aria-label="Filter by Dietary Tag"
            >
              <option value="all">All Diets (Any)</option>
              {DIETARY_FILTERS.map((tag) => (
                <option key={tag} value={tag}>
                  🌱 {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Catalog Results Grid */}
          {filteredProducts.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
              <Filter size={32} color="var(--text-muted)" />
              <div>
                <h4>No matching products found</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Try changing your keyword or clearing the price/dietary filters.
                </p>
              </div>
              <button
                className="btn-subtle"
                onClick={() => {
                  setCatalogSearchQuery('');
                  setCatalogMaxPrice(null);
                  setSelectedCategory('all');
                  setSelectedDietaryTag('all');
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="catalog-grid">
              {filteredProducts.map((product) => {
                const effectivePrice = product.onSale && product.salePrice ? product.salePrice : product.price;

                return (
                  <div key={product.id} className="product-card">
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                        <span className="product-card-brand">{product.brand}</span>
                        {product.onSale && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#fca5a5',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                            }}
                          >
                            SALE
                          </span>
                        )}
                      </div>

                      <div className="product-card-title">{product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {product.size} • {product.category}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.4rem', fontSize: '0.75rem', color: '#fbbf24' }}>
                        <Star size={12} fill="#fbbf24" color="#fbbf24" />
                        <span>{product.rating}</span>
                        <span style={{ color: 'var(--text-muted)' }}>({product.reviewCount})</span>
                      </div>

                      {/* Dietary Tags */}
                      {product.dietaryTags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
                          {product.dietaryTags.slice(0, 2).map((tag) => (
                            <span key={tag} className="tag-badge" style={{ fontSize: '0.65rem' }}>
                              <Tag size={9} style={{ display: 'inline', marginRight: '2px' }} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="product-card-bottom">
                      <div>
                        <div className="product-card-price">${effectivePrice.toFixed(2)}</div>
                        {product.onSale && (
                          <span style={{ fontSize: '0.72rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <button
                        className="btn-quick-add"
                        onClick={() =>
                          addItem({
                            name: product.name,
                            quantity: 1,
                            unit: product.unit,
                            category: product.category,
                            estimatedPrice: effectivePrice,
                            brand: product.brand,
                            dietaryTags: product.dietaryTags,
                            source: 'catalog',
                          })
                        }
                      >
                        <Plus size={13} style={{ display: 'inline', marginRight: '3px' }} />
                        Add to List
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
