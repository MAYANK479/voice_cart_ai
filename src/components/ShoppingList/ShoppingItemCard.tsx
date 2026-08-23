import React from 'react';
import { Check, Plus, Minus, Trash2, Repeat } from 'lucide-react';
import { ShoppingItem } from '../../types/shopping';
import { useShopping } from '../../context/ShoppingContext';

interface ShoppingItemCardProps {
  item: ShoppingItem;
}

export const ShoppingItemCard: React.FC<ShoppingItemCardProps> = ({ item }) => {
  const { toggleCompleted, updateQuantity, removeItem, toggleItemRecurring } = useShopping();

  return (
    <div className={`item-card ${item.completed ? 'completed' : ''}`}>
      <div className="item-left">
        {/* Custom Circular / Box Checkbox */}
        <button
          className={`checkbox-custom ${item.completed ? 'checked' : ''}`}
          onClick={() => toggleCompleted(item.id)}
          aria-label={item.completed ? `Mark ${item.name} as incomplete` : `Mark ${item.name} as completed`}
        >
          {item.completed && <Check size={14} strokeWidth={3} />}
        </button>

        {/* Item Info */}
        <div className="item-info">
          <div className="item-name">{item.name}</div>
          <div className="item-meta">
            <span>
              ${item.estimatedPrice.toFixed(2)} / {item.unit}
            </span>
            {item.dietaryTags && item.dietaryTags.length > 0 && (
              <span className="tag-badge">{item.dietaryTags[0]}</span>
            )}
            {item.isRecurring && (
              <button
                className="recurring-badge active"
                onClick={() => toggleItemRecurring(item.id, 7)}
                title="Recurring staple (every 7 days). Click to toggle."
              >
                <Repeat size={11} />
                <span>Every {item.recurringDays || 7}d</span>
              </button>
            )}
            {!item.isRecurring && (
              <button
                className="recurring-badge subtle"
                onClick={() => toggleItemRecurring(item.id, 7)}
                title="Mark this item as recurring weekly"
              >
                <Repeat size={11} />
                <span>Repeat</span>
              </button>
            )}
            {item.source === 'voice' && (
              <span className="voice-source-tag">• Voice</span>
            )}
          </div>
        </div>
      </div>

      <div className="item-right">
        {/* Quantity Controls */}
        <div className="quantity-controller">
          <button
            className="btn-qty"
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            disabled={item.completed}
            aria-label="Decrease quantity"
          >
            <Minus size={13} />
          </button>
          <span className="qty-display">{item.quantity}</span>
          <button
            className="btn-qty"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.completed}
            aria-label="Increase quantity"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Line Total */}
        <div className="item-price">
          ${(item.estimatedPrice * item.quantity).toFixed(2)}
        </div>

        {/* Delete Item */}
        <button
          className="btn-delete-item"
          onClick={() => removeItem(item.id)}
          title={`Remove ${item.name}`}
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

