import React, { useMemo } from 'react';
import { ShoppingCart, Trash2, CheckCircle2, Download, FileSpreadsheet, Sparkles } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { CategorySection } from './CategorySection';
import { DEFAULT_CATEGORY_ORDER } from '../../data/categories';
import { CategoryId, ShoppingItem } from '../../types/shopping';

export const ShoppingListView: React.FC = () => {
  const {
    lists,
    activeListId,
    setActiveListId,
    activeListName,
    activeListItems,
    clearCompleted,
    clearAll,
    exportList,
    setBuildMyListModalOpen,
    setActiveView,
    completedCount,
    totalEstimatedCost,
  } = useShopping();



  // Group active list items by category in predefined order
  const groupedItems = useMemo(() => {
    const map: Partial<Record<CategoryId, ShoppingItem[]>> = {};

    for (const item of activeListItems) {
      if (!map[item.category]) {
        map[item.category] = [];
      }
      map[item.category]!.push(item);
    }

    return map;
  }, [activeListItems]);

  return (
    <div className="glass-panel shopping-list-panel">
      {/* Multi-List Selector Tabs */}
      <div className="list-tabs-container">
        <div className="list-tabs-scroll">
          {lists.map((list) => {
            const listItemsCount = (useShopping().items || []).filter((i) => (i.listId || 'weekly-grocery') === list.id).length;
            const isActive = list.id === activeListId;
            return (
              <button
                key={list.id}
                className={`list-tab-pill ${isActive ? 'active' : ''}`}
                onClick={() => setActiveListId(list.id)}
                title={list.description}
              >
                <span className="list-tab-emoji">{list.emoji}</span>
                <span className="list-tab-name">{list.name}</span>
                {listItemsCount > 0 && <span className="list-tab-count">{listItemsCount}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel Header */}
      <div className="panel-header">
        <div className="panel-title-group">
          <ShoppingCart size={20} color="var(--accent-primary)" />
          <div>
            <h2>{activeListName}</h2>
            <div className="panel-stats-subtext">
              <span>{activeListItems.length} items</span>
              <span className="bullet-sep">•</span>
              <span className="price-bold">${totalEstimatedCost.toFixed(2)} estimated</span>
            </div>
          </div>
        </div>

        <div className="list-action-btns">
          {/* Build My List AI Button */}
          <button
            className="btn-build-list-action"
            onClick={() => setBuildMyListModalOpen(true)}
            title="Analyze shopping habits and auto-assemble basket"
          >
            <Sparkles size={14} color="#173F32" />
            <span>✨ Build My List</span>
          </button>

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

          {activeListItems.length > 0 && (
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
                title="Clear all items in this list"
              >
                <Trash2 size={15} />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>


      {/* Empty State or Categorized Stack */}
      {activeListItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-circle">
            <ShoppingCart size={32} />
          </div>
          <div>
            <h3>Your {activeListName} is Empty</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Say <span style={{ color: 'var(--accent-mint)' }}>"Add 2 bottles of organic milk"</span> or click <strong>✨ Build My List</strong>.
            </p>
          </div>
          <button
            className="btn-build-list-action"
            onClick={() => setBuildMyListModalOpen(true)}
            style={{ marginTop: '0.5rem' }}
          >
            <Sparkles size={14} />
            <span>✨ Build My List with AI</span>
          </button>
        </div>
      ) : (
        <>
          <div className="categories-stack">
            {DEFAULT_CATEGORY_ORDER.map((categoryId) => {
              const categoryItems = groupedItems[categoryId];
              if (!categoryItems || categoryItems.length === 0) return null;
              return <CategorySection key={categoryId} categoryId={categoryId} items={categoryItems} />;
            })}
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <button
              className="btn-place-order"
              onClick={() => setActiveView('checkout')}
              style={{ width: '100%' }}
            >
              <span>🛒 Proceed to Checkout ({activeListItems.length} items • ${totalEstimatedCost.toFixed(2)}) →</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};


