import React from 'react';
import { Sparkles, ChevronRight, Tag } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';

interface PromoCard {
  id: string;
  discount: string;
  title: string;
  subtitle: string;
  command: string;
  gradient: string;
}

const PROMO_CARDS: PromoCard[] = [
  {
    id: 'promo-1',
    discount: '35% Discount',
    title: 'Organic Produce Harvest',
    subtitle: 'Order fresh farm fruits & crisp greens',
    command: 'Add 3 lbs of Honeycrisp apples and 2 lbs organic spinach',
    gradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
  },
  {
    id: 'promo-2',
    discount: '20% Discount',
    title: 'Weekly Staple Restock',
    subtitle: 'Auto-predicted favorites based on your cycle',
    command: 'What should I restock?',
    gradient: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
  },
  {
    id: 'promo-3',
    discount: '20% Discount',
    title: 'Healthier Alternatives',
    subtitle: 'Plant-based & dairy-free substitutes',
    command: 'Suggest a substitute for butter',
    gradient: 'linear-gradient(135deg, #15803D 0%, #22C55E 100%)',
  },
  {
    id: 'promo-4',
    discount: '10% Discount',
    title: 'Fresh Artisan Bakery',
    subtitle: 'Sourdough loaves & wholegrain breads',
    command: 'Add 1 sourdough bread and 1 baguette',
    gradient: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
  },
];

export const DiscountBanners: React.FC = () => {
  const { processTextInputCommand, setSuggestionsModalOpen } = useShopping();

  const handleShopNow = (cmd: string) => {
    processTextInputCommand(cmd, 'demo');
  };

  return (
    <div className="simi-discount-section">
      <div className="simi-section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Tag size={18} color="#059669" />
          <h2 className="simi-section-title">Discount Shop</h2>
        </div>
        <button className="simi-view-all" onClick={() => setSuggestionsModalOpen(true)}>
          <span>View More</span>
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="simi-discount-grid">
        {PROMO_CARDS.map((card) => (
          <div key={card.id} className="simi-discount-card" style={{ background: card.gradient }}>
            <div className="simi-discount-badge">{card.discount}</div>
            <div className="simi-discount-info">
              <h3 className="simi-discount-title">{card.title}</h3>
              <p className="simi-discount-sub">{card.subtitle}</p>
            </div>
            <button className="btn-shop-now" onClick={() => handleShopNow(card.command)}>
              <span>Shop Now</span>
              <Sparkles size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
