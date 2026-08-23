import React, { useMemo } from 'react';
import { ShoppingCart, Trash2, CheckCircle2, Download, FileSpreadsheet, PlusCircle } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { CategorySection } from './CategorySection';
import { DEFAULT_CATEGORY_ORDER } from '../../data/categories';
import { CategoryId, ShoppingItem } from '../../types/shopping';

export const ShoppingListView: React.FC = () => {
  const {
    items,
    clearCompleted,
    clearAll,
    exportList,
    setCatalogModalOpen,
    completedCount,
  } = useShopping();

  // Group items by category in predefined order
  const groupedItems = useMemo(() => {
    const map: Partial<Record<CategoryId, ShoppingItem[]>> = {};

    for (const item of items) {
      if (!map[item.category]) {
        map[item.category] = [];
      }
      map[item.category]!.push(item);
    }

    return map;
  }, [items]);

  return (
    <div className="glass-panel shopping-list-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title-group">
          <ShoppingCart size={20} color="var(--accent-primary)" />
          <h2>My Smart Shopping List</h2>
          <span className="badge-counter">{items.length} total</span>
        </div>

        <div className="list-action-btns">
          {completedCount > 0 && (
            <button
              className="btn-subtle"
              onClick={clearCompleted}
              title="Clear completed items"
            >
              <CheckCircle2 size={15} color="#10b981" />
              <span>Clear Done ({completedCount})</span>
            </button>
          )}

          {items.length > 0 && (
            <>
              <button
                className="btn-subtle"
                onClick={() => exportList('csv')}
                title="Export as CSV"
              >
                <FileSpreadsheet size={15} color="#06b6d4" />
                <span>CSV</span>
              </button>

              <button
                className="btn-subtle"
                onClick={() => exportList('json')}
                title="Export as JSON"
              >
                <Download size={15} />
                <span>JSON</span>
              </button>

              <button
                className="btn-subtle danger"
                onClick={clearAll}
                title="Clear all items"
              >
                <Trash2 size={15} />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Empty State or Categorized Stack */}
      {items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-circle">
            <ShoppingCart size={32} />
          </div>
          <div>
            <h3>Your Shopping List is Empty</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Say <span style={{ color: 'var(--accent-cyan)' }}>"Add 2 bottles of milk"</span> or explore catalog items.
            </p>
          </div>
          <button
            className="btn-send-command"
            style={{ marginTop: '0.5rem' }}
            onClick={() => setCatalogModalOpen(true)}
          >
            <PlusCircle size={16} />
            <span>Browse Catalog</span>
          </button>
        </div>
      ) : (
        <div className="categories-stack">
          {DEFAULT_CATEGORY_ORDER.map((catId) => {
            const categoryItems = groupedItems[catId];
            if (!categoryItems || categoryItems.length === 0) return null;
            return <CategorySection key={catId} categoryId={catId} items={categoryItems} />;
          })}
        </div>
      )}
    </div>
  );
};
