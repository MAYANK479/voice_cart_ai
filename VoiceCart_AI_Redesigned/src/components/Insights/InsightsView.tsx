import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, DollarSign, PieChart, ShoppingBag, Clock, Plus, ArrowLeft } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { CATEGORIES, DEFAULT_CATEGORY_ORDER } from '../../data/categories';
import { CategoryId } from '../../types/shopping';

export const InsightsView: React.FC = () => {
  const { items, totalEstimatedCost, budget, restockPredictions, addItem, setActiveView } = useShopping();

  // Category breakdown calculation
  const categoryStats = useMemo(() => {
    const counts: Record<CategoryId, { count: number; spend: number }> = {
      produce: { count: 0, spend: 0 },
      dairy: { count: 0, spend: 0 },
      bakery: { count: 0, spend: 0 },
      meat: { count: 0, spend: 0 },
      pantry: { count: 0, spend: 0 },
      beverages: { count: 0, spend: 0 },
      snacks: { count: 0, spend: 0 },
      household: { count: 0, spend: 0 },
      other: { count: 0, spend: 0 },
    };

    for (const item of items) {
      const cat = counts[item.category] ? item.category : 'other';
      counts[cat].count += item.quantity;
      counts[cat].spend += item.estimatedPrice * item.quantity;
    }

    return counts;
  }, [items]);

  const activeCategoriesCount = useMemo(() => {
    return Object.values(categoryStats).filter((c) => c.count > 0).length;
  }, [categoryStats]);

  const budgetUsagePercent = budget > 0 ? Math.min(100, Math.round((totalEstimatedCost / budget) * 100)) : 0;

  return (
    <div className="insights-container">
      {/* Top Header */}
      <div className="insights-header">
        <div>
          <button
            className="btn-subtle"
            style={{ marginBottom: '0.5rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
            onClick={() => setActiveView('dashboard')}
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </button>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={24} color="var(--accent-primary)" />
            <span>Shopping Analytics & Spending Insights</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Real-time breakdown of current cart allocations, consumption velocity, and staple restock needs.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="insights-kpi-grid">
        <div className="kpi-card glass-panel">
          <div className="kpi-label">
            <ShoppingBag size={14} color="var(--accent-primary)" />
            <span>Total Items in Cart</span>
          </div>
          <div className="kpi-value">{items.reduce((s, i) => s + i.quantity, 0)}</div>
          <div className="kpi-sub">{items.length} unique products</div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-label">
            <DollarSign size={14} color="#10b981" />
            <span>Estimated Total Spend</span>
          </div>
          <div className="kpi-value highlight-green">${totalEstimatedCost.toFixed(2)}</div>
          <div className="kpi-sub">Target budget: ${budget.toFixed(2)} ({budgetUsagePercent}%)</div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-label">
            <PieChart size={14} color="#06b6d4" />
            <span>Active Departments</span>
          </div>
          <div className="kpi-value">{activeCategoriesCount} / 8</div>
          <div className="kpi-sub">Across grocery aisles</div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-label">
            <TrendingUp size={14} color="#fbbf24" />
            <span>Restock Velocity Alerts</span>
          </div>
          <div className="kpi-value highlight-amber">{restockPredictions.length}</div>
          <div className="kpi-sub">Predicted low staples</div>
        </div>
      </div>

      {/* Two-Column Visualizations */}
      <div className="insights-charts-grid">
        {/* Department Spend Allocation */}
        <div className="glass-panel chart-panel">
          <div className="panel-sub-header">
            <h3>Department Spend Allocation</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Estimated USD</span>
          </div>

          <div className="category-bars-list">
            {DEFAULT_CATEGORY_ORDER.map((catId) => {
              const catInfo = CATEGORIES[catId];
              const stat = categoryStats[catId];
              const percentage = totalEstimatedCost > 0 ? (stat.spend / totalEstimatedCost) * 100 : 0;

              return (
                <div key={catId} className="cat-bar-row">
                  <div className="cat-bar-info">
                    <span className="cat-name">
                      {catInfo.emoji} {catInfo.name}
                    </span>
                    <span className="cat-values">
                      <strong>${stat.spend.toFixed(2)}</strong> ({stat.count} units)
                    </span>
                  </div>
                  <div className="cat-progress-track">
                    <div
                      className="cat-progress-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: catInfo.color || 'var(--accent-primary)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consumption Cycle & Restock Forecast */}
        <div className="glass-panel chart-panel">
          <div className="panel-sub-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={16} color="#fbbf24" />
              <h3>Consumption Cycle & Restock Forecast</h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Algorithmic Velocity</span>
          </div>

          {restockPredictions.length === 0 ? (
            <div className="empty-chart-state">
              All predicted pantry staples are already in your cart! 🎉
            </div>
          ) : (
            <div className="restock-forecast-list">
              {restockPredictions.map((pred) => (
                <div key={pred.id} className="restock-forecast-card">
                  <div className="forecast-left">
                    <div className="forecast-title">{pred.itemName}</div>
                    <div className="forecast-meta">
                      <span>Cycle: every <strong>{pred.averageCycleDays} days</strong></span>
                      <span>•</span>
                      <span className={`urgency-badge ${pred.urgency}`}>
                        {pred.urgency.toUpperCase()} URGENCY
                      </span>
                    </div>
                    <div className="forecast-reason">{pred.reason}</div>
                  </div>

                  <button
                    className="btn-quick-add"
                    onClick={() =>
                      addItem({
                        name: pred.itemName,
                        quantity: 1,
                        unit: pred.unit,
                        category: pred.category,
                        estimatedPrice: pred.estimatedPrice,
                        source: 'suggestion',
                      })
                    }
                    title={`Add ${pred.itemName} to shopping list`}
                  >
                    <Plus size={13} style={{ marginRight: '4px' }} />
                    Add (${pred.estimatedPrice.toFixed(2)})
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
