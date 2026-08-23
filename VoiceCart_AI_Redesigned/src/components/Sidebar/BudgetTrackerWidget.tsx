import React, { useState } from 'react';
import { DollarSign, AlertTriangle, Edit2, Check } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';

export const BudgetTrackerWidget: React.FC = () => {
  const { budget, setBudget, totalEstimatedCost, completedEstimatedCost, pendingCount } = useShopping();
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget.toString());

  const percentage = Math.min(100, Math.round((totalEstimatedCost / budget) * 100)) || 0;
  const isOverBudget = totalEstimatedCost > budget;
  const remaining = Math.max(0, budget - totalEstimatedCost);

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newBudget);
    if (!isNaN(val) && val > 0) {
      setBudget(val);
    }
    setIsEditing(false);
  };

  return (
    <div className="glass-panel budget-widget">
      <div className="budget-top">
        <div className="budget-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <DollarSign size={16} color="var(--accent-emerald)" />
          <span>Estimated Budget</span>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveBudget} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <input
              type="number"
              style={{
                width: '60px',
                padding: '0.2rem 0.4rem',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid var(--accent-primary)',
                color: 'white',
                fontSize: '0.8rem',
              }}
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="btn-icon"
              style={{ width: '24px', height: '24px' }}
              title="Save budget limit"
            >
              <Check size={12} />
            </button>
          </form>
        ) : (
          <button
            className="btn-icon"
            style={{ width: '28px', height: '28px' }}
            onClick={() => {
              setNewBudget(budget.toString());
              setIsEditing(true);
            }}
            title="Edit target budget"
          >
            <Edit2 size={13} />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div className="budget-amount">${totalEstimatedCost.toFixed(2)}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Target: <strong>${budget.toFixed(2)}</strong>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-bg">
        <div
          className={`progress-bar-fill ${isOverBudget ? 'over-budget' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="budget-metrics-row">
        <span>{percentage}% of budget</span>
        <span>
          {isOverBudget ? (
            <strong style={{ color: 'var(--accent-rose)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              <AlertTriangle size={12} /> Over by ${(totalEstimatedCost - budget).toFixed(2)}
            </strong>
          ) : (
            `$${remaining.toFixed(2)} left`
          )}
        </span>
      </div>

      <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
        <span>Pending items: {pendingCount}</span>
        <span>Checked total: ${completedEstimatedCost.toFixed(2)}</span>
      </div>
    </div>
  );
};
