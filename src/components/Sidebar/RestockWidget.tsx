import React from 'react';
import { History, Plus, Sparkles } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';

export const RestockWidget: React.FC = () => {
  const { restockPredictions, addItem, setSuggestionsModalOpen, setSuggestionsInitialTab } = useShopping();

  const handleOpenRestockTab = () => {
    setSuggestionsInitialTab('restock');
    setSuggestionsModalOpen(true);
  };

  return (
    <div className="glass-panel restock-widget">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', fontWeight: 700 }}>
          <History size={16} color="#fbbf24" />
          <span>Running Low?</span>
        </div>

        <button
          className="btn-subtle"
          style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
          onClick={handleOpenRestockTab}
        >
          <Sparkles size={11} />
          <span>View All</span>
        </button>
      </div>

      {restockPredictions.length === 0 ? (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
          All frequently bought items are currently on your list! 🎉
        </div>
      ) : (
        <div className="restock-list">
          {restockPredictions.slice(0, 3).map((item) => (
            <div key={item.id} className="restock-item-row">
              <div className="restock-item-left">
                <div className="restock-item-name">{item.itemName}</div>
                <div className="restock-reason">{item.reason}</div>
              </div>

              <button
                className="btn-quick-add"
                onClick={() =>
                  addItem({
                    name: item.itemName,
                    quantity: 1,
                    unit: item.unit,
                    category: item.category,
                    estimatedPrice: item.estimatedPrice,
                    source: 'suggestion',
                  })
                }
                title={`Add ${item.itemName} ($${item.estimatedPrice.toFixed(2)})`}
              >
                <Plus size={12} style={{ display: 'inline', marginRight: '2px' }} />
                +${item.estimatedPrice.toFixed(2)}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
