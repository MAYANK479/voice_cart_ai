import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  Zap,
  Store,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ChevronRight,
  Receipt,
  FileDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShopping } from '../../context/ShoppingContext';
import { ShoppingItem } from '../../types/shopping';

export const CheckoutView: React.FC = () => {
  const {
    items,
    activeListName,
    removeItem,
    updateQuantity,
    setActiveView,
    addToast,
  } = useShopping();

  // Selected item IDs for checkout (default: all active items selected)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(() => items.map((i) => i.id));
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'pickup'>('standard');
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; type: 'fixed' | 'percent' | 'shipping' } | null>(null);
  const [promoError, setPromoError] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'apple-pay' | 'card' | 'google-pay' | 'cod'>('apple-pay');
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>('Leave at doorstep and ring the bell.');
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');

  // Selected items calculation
  const checkoutItems = useMemo(() => {
    return items.filter((item) => selectedItemIds.includes(item.id));
  }, [items, selectedItemIds]);

  const subtotal = useMemo(() => {
    return checkoutItems.reduce((sum, i) => sum + (i.estimatedPrice || 2.99) * (i.quantity || 1), 0);
  }, [checkoutItems]);

  // Delivery fee calculation
  const deliveryFee = useMemo(() => {
    if (deliveryMethod === 'pickup') return 0;
    if (appliedPromo?.type === 'shipping') return 0;
    if (deliveryMethod === 'express') return 4.99;
    return subtotal >= 35 ? 0 : 2.99;
  }, [deliveryMethod, subtotal, appliedPromo]);

  // Estimated Tax
  const tax = useMemo(() => subtotal * 0.08, [subtotal]);

  // Promo Discount Calculation
  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === 'fixed') return Math.min(subtotal, appliedPromo.discount);
    if (appliedPromo.type === 'percent') return subtotal * (appliedPromo.discount / 100);
    return 0;
  }, [appliedPromo, subtotal]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal + deliveryFee + tax - discountAmount);
  }, [subtotal, deliveryFee, tax, discountAmount]);

  // Toggle item selection
  const toggleItemSelect = (id: string) => {
    setSelectedItemIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedItemIds.length === items.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(items.map((i) => i.id));
    }
  };

  // Promo application
  const handleApplyPromo = (codeToApply?: string) => {
    const code = (codeToApply || promoCode).trim().toUpperCase();
    setPromoError('');

    if (code === 'VOICECART10') {
      if (subtotal < 25) {
        setPromoError('Requires a minimum order subtotal of $25.00');
        return;
      }
      setAppliedPromo({ code, discount: 10, type: 'fixed' });
      addToast({ type: 'success', title: 'Coupon Applied!', message: '$10.00 saved on your order.' });
    } else if (code === 'FREESHIP') {
      setAppliedPromo({ code, discount: 0, type: 'shipping' });
      addToast({ type: 'success', title: 'Free Delivery Applied!', message: 'Shipping fee waived.' });
    } else if (code === 'HARVEST15') {
      setAppliedPromo({ code, discount: 15, type: 'percent' });
      addToast({ type: 'success', title: '15% Off Applied!', message: '15% saved on your fresh cart.' });
    } else {
      setPromoError('Invalid coupon code. Try VOICECART10 or FREESHIP.');
    }
  };

  const handlePlaceOrder = () => {
    if (checkoutItems.length === 0) {
      addToast({ type: 'warning', title: 'No Items Selected', message: 'Please select at least 1 item to checkout.' });
      return;
    }

    const generatedId = `VC-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setOrderPlaced(true);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    addToast({
      type: 'success',
      title: '🎉 Order Placed Successfully!',
      message: `Your grocery order #${generatedId} is being prepared.`,
    });
  };

  // If order was placed, show confirmation receipt view
  if (orderPlaced) {
    return (
      <div className="checkout-container">
        <div className="order-success-card">
          <div className="success-icon-badge">
            <CheckCircle2 size={42} color="#10B981" />
          </div>
          <h1 className="success-headline">Order Confirmed!</h1>
          <p className="success-subtext">
            Thank you, Mayank! Your order <strong>#{orderId}</strong> has been received and is being prepared fresh from the local store.
          </p>

          {/* Delivery Tracker Progress */}
          <div className="order-tracker-box">
            <div className="tracker-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} color="#059669" />
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Estimated Delivery: Today, within 45 mins</span>
              </div>
              <span className="badge-live-delivery">● Live Tracking</span>
            </div>

            <div className="tracker-steps-line">
              <div className="step-point completed">
                <div className="point-dot" />
                <span>Confirmed</span>
              </div>
              <div className="step-point active">
                <div className="point-dot" />
                <span>Packing</span>
              </div>
              <div className="step-point">
                <div className="point-dot" />
                <span>On the way</span>
              </div>
              <div className="step-point">
                <div className="point-dot" />
                <span>Delivered</span>
              </div>
            </div>
          </div>

          {/* Receipt Breakdown */}
          <div className="receipt-summary-panel">
            <div className="receipt-header">
              <Receipt size={18} color="#059669" />
              <h3>Itemized Order Receipt</h3>
            </div>

            <div className="receipt-items-list">
              {checkoutItems.map((item) => (
                <div key={item.id} className="receipt-row">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-semibold">${((item.estimatedPrice || 2.99) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="receipt-divider" />

            <div className="receipt-totals-list">
              <div className="receipt-row-muted">
                <span>Subtotal ({checkoutItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="receipt-row-muted">
                <span>Delivery ({deliveryMethod === 'express' ? 'Express 1-Hour' : 'Standard'})</span>
                <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              {discountAmount > 0 && (
                <div className="receipt-row-discount">
                  <span>Coupon Discount ({appliedPromo?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="receipt-row-muted">
                <span>Estimated Taxes & Fees</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="receipt-row-grand-total">
                <span>Total Paid</span>
                <span className="total-highlight">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="success-actions-row">
            <button className="btn-secondary-action" onClick={() => window.print()}>
              <FileDown size={16} />
              <span>Download Receipt</span>
            </button>
            <button className="btn-primary-action" onClick={() => setActiveView('dashboard')}>
              <ArrowLeft size={16} />
              <span>Back to Shopping</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      {/* Top Header */}
      <div className="checkout-header">
        <button className="btn-subtle" onClick={() => setActiveView('dashboard')}>
          <ArrowLeft size={16} />
          <span>Back to Grocery Cart</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem' }}>
          <div>
            <h1 className="checkout-title">Review & Checkout</h1>
            <p className="checkout-subtitle">Verify your cart from <strong>{activeListName}</strong> and choose delivery options.</p>
          </div>
          <div className="secure-badge">
            <ShieldCheck size={16} color="#10B981" />
            <span>256-bit Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="checkout-grid">
        {/* Left Column: Cart Items & Delivery Details */}
        <div className="checkout-main-col">
          {/* Items In Order Card */}
          <div className="checkout-card">
            <div className="card-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={20} color="#059669" />
                <h2 className="card-heading">Cart Items ({checkoutItems.length} selected)</h2>
              </div>
              <button className="btn-select-all" onClick={toggleSelectAll}>
                {selectedItemIds.length === items.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {items.length === 0 ? (
              <div className="empty-cart-checkout">
                <ShoppingBag size={36} color="var(--text-muted)" />
                <p>Your cart is empty.</p>
                <button className="btn-primary-action" onClick={() => setActiveView('dashboard')}>
                  Add Groceries
                </button>
              </div>
            ) : (
              <div className="checkout-items-stack">
                {items.map((item: ShoppingItem) => {
                  const isSelected = selectedItemIds.includes(item.id);
                  return (
                    <div key={item.id} className={`checkout-item-row ${isSelected ? 'selected' : 'unselected'}`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItemSelect(item.id)}
                        className="checkout-checkbox"
                        aria-label={`Select ${item.name}`}
                      />

                      <div className="checkout-item-details">
                        <div className="checkout-item-title">{item.name}</div>
                        <div className="checkout-item-sub">
                          ${(item.estimatedPrice || 2.99).toFixed(2)} / {item.unit || 'unit'} • {item.category}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="checkout-stepper">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="btn-stepper-mini"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="stepper-val">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="btn-stepper-mini"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="checkout-item-price">
                        ${((item.estimatedPrice || 2.99) * item.quantity).toFixed(2)}
                      </div>

                      {/* Delete */}
                      <button
                        className="btn-trash-mini"
                        onClick={() => removeItem(item.id)}
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Delivery Options Card */}
          <div className="checkout-card">
            <div className="card-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={20} color="#059669" />
                <h2 className="card-heading">Delivery Method</h2>
              </div>
            </div>

            <div className="delivery-methods-grid">
              <div
                className={`delivery-option-box ${deliveryMethod === 'standard' ? 'active' : ''}`}
                onClick={() => setDeliveryMethod('standard')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Truck size={20} color="#059669" />
                  <div>
                    <div className="option-title">Standard Delivery</div>
                    <div className="option-sub">Today • 2 to 3 hours</div>
                  </div>
                </div>
                <div className="option-price">{subtotal >= 35 ? 'FREE' : '$2.99'}</div>
              </div>

              <div
                className={`delivery-option-box ${deliveryMethod === 'express' ? 'active' : ''}`}
                onClick={() => setDeliveryMethod('express')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Zap size={20} color="#F59E0B" />
                  <div>
                    <div className="option-title">Express 1-Hour</div>
                    <div className="option-sub">Direct priority courier</div>
                  </div>
                </div>
                <div className="option-price">$4.99</div>
              </div>

              <div
                className={`delivery-option-box ${deliveryMethod === 'pickup' ? 'active' : ''}`}
                onClick={() => setDeliveryMethod('pickup')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Store size={20} color="#3B82F6" />
                  <div>
                    <div className="option-title">Store Pickup</div>
                    <div className="option-sub">Ready in 30 mins</div>
                  </div>
                </div>
                <div className="option-price">FREE</div>
              </div>
            </div>

            {/* Delivery Address Box */}
            <div className="address-panel">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={18} color="#059669" style={{ marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Delivery Address</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    742 Evergreen Terrace, Apt 4B, Springfield, NY 10001
                  </div>
                </div>
              </div>
              <button className="btn-subtle" style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}>
                Edit
              </button>
            </div>

            {/* Delivery Instructions */}
            <div style={{ marginTop: '0.75rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Delivery Note / Gate Code
              </label>
              <input
                type="text"
                className="checkout-text-input"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="e.g. Ring bell, leave on front porch"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="checkout-card">
            <div className="card-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} color="#059669" />
                <h2 className="card-heading">Payment Option</h2>
              </div>
            </div>

            <div className="payment-options-grid">
              <div
                className={`payment-option-pill ${paymentMethod === 'apple-pay' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('apple-pay')}
              >
                <span>🍏 Apple Pay</span>
              </div>
              <div
                className={`payment-option-pill ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <span>💳 Card (•••• 4242)</span>
              </div>
              <div
                className={`payment-option-pill ${paymentMethod === 'google-pay' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('google-pay')}
              >
                <span>🌐 Google Pay</span>
              </div>
              <div
                className={`payment-option-pill ${paymentMethod === 'cod' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <span>💵 Pay on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="checkout-sidebar-col">
          <div className="checkout-card order-summary-card">
            <h2 className="card-heading" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              Order Summary
            </h2>

            {/* Promo Code Box */}
            <div className="promo-input-group">
              <div style={{ position: 'relative', flex: 1 }}>
                <Tag size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Promo code (e.g. VOICECART10)"
                  className="promo-input"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
              </div>
              <button className="btn-apply-promo" onClick={() => handleApplyPromo()}>
                Apply
              </button>
            </div>

            {/* Preset Promo Chips */}
            <div className="promo-chips-row">
              <button className="promo-chip" onClick={() => handleApplyPromo('VOICECART10')}>
                VOICECART10 ($10 Off)
              </button>
              <button className="promo-chip" onClick={() => handleApplyPromo('FREESHIP')}>
                FREESHIP
              </button>
            </div>

            {promoError && <div className="promo-error-text">{promoError}</div>}
            {appliedPromo && (
              <div className="promo-applied-badge">
                <span>✓ Applied <strong>{appliedPromo.code}</strong></span>
                <button onClick={() => setAppliedPromo(null)}>Remove</button>
              </div>
            )}

            {/* Price Calculations */}
            <div className="summary-breakdown-list">
              <div className="summary-row">
                <span>Items Subtotal ({checkoutItems.length})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Estimated Delivery</span>
                <span>{deliveryFee === 0 ? <span className="text-green">FREE</span> : `$${deliveryFee.toFixed(2)}`}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Taxes & Bag Fees</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row total">
                <span>Total Due</span>
                <span className="total-amount">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              className="btn-place-order"
              onClick={handlePlaceOrder}
              disabled={checkoutItems.length === 0}
            >
              <span>Place Order • ${grandTotal.toFixed(2)}</span>
              <ChevronRight size={18} />
            </button>

            <div className="guarantee-text">
              <Sparkles size={14} color="#10B981" />
              <span>100% Freshness Guarantee or instant refund.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
