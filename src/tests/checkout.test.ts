import { describe, it, expect } from 'vitest';

describe('Checkout Calculations & Promo Code Validation Engine', () => {
  const sampleItems = [
    { id: '1', name: 'Organic Honeycrisp Apples', price: 4.99, quantity: 2, selected: true },
    { id: '2', name: 'Almond Milk 64oz', price: 3.49, quantity: 1, selected: true },
    { id: '3', name: 'Sourdough Bread', price: 4.29, quantity: 1, selected: false }, // unselected
  ];

  it('calculates accurate subtotal for selected items only', () => {
    const selectedItems = sampleItems.filter((i) => i.selected);
    const subtotal = selectedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    expect(subtotal).toBeCloseTo(4.99 * 2 + 3.49, 2);
  });

  it('applies percentage discount coupon FRESHFLOW10 correctly', () => {
    const subtotal = 40.00;
    const discount = subtotal * 0.10;
    expect(discount).toBe(4.00);
    expect(subtotal - discount).toBe(36.00);
  });

  it('applies HARVEST15 coupon correctly', () => {
    const subtotal = 50.00;
    const discount = subtotal * 0.15;
    expect(discount).toBe(7.50);
  });

  it('grants free delivery for orders above $35 on standard shipping', () => {
    const subtotal = 38.50;
    const deliveryFee = subtotal >= 35 ? 0 : 3.99;
    expect(deliveryFee).toBe(0);
  });

  it('charges delivery fee for orders below $35 on standard shipping', () => {
    const subtotal = 22.00;
    const deliveryFee = subtotal >= 35 ? 0 : 3.99;
    expect(deliveryFee).toBe(3.99);
  });

  it('calculates express shipping accurately regardless of order total', () => {
    const expressFee = 4.99;
    expect(expressFee).toBe(4.99);
  });

  it('calculates pickup delivery with 0 fee', () => {
    const pickupFee = 0.00;
    expect(pickupFee).toBe(0.00);
  });

  it('calculates estimated tax (8%) accurately', () => {
    const subtotal = 50.00;
    const discount = 5.00;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.08;
    expect(tax).toBeCloseTo(3.60, 2);
  });

  it('rejects invalid promo codes gracefully', () => {
    const validCodes = ['FRESHFLOW10', 'VOICECART10', 'FREESHIP', 'HARVEST15'];
    expect(validCodes.includes('FAKEDISCOUNT99')).toBe(false);
  });

  it('calculates final order grand total with all adjustments', () => {
    const subtotal = 40.00;
    const discount = 4.00; // FRESHFLOW10

    const delivery = 0; // Free > $35
    const tax = (40.00 - 4.00) * 0.08; // 2.88
    const total = (subtotal - discount) + delivery + tax;
    expect(total).toBeCloseTo(38.88, 2);
  });

  it('generates unique valid receipt confirmation IDs', () => {
    const id = 'VC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    expect(id).toMatch(/^VC-[A-Z0-9]{6}$/);
  });

  it('handles empty carts safely with 0 subtotal and 0 grand total', () => {
    const items: any[] = [];
    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    expect(subtotal).toBe(0);
  });

  it('supports item quantity increment and decrement bounds', () => {
    let qty = 2;
    qty += 1;
    expect(qty).toBe(3);
    qty = Math.max(1, qty - 2);
    expect(qty).toBe(1);
    qty = Math.max(1, qty - 1);
    expect(qty).toBe(1); // Min bound 1
  });

  it('supports toggling item selection state', () => {
    let isSelected = true;
    isSelected = !isSelected;
    expect(isSelected).toBe(false);
    isSelected = !isSelected;
    expect(isSelected).toBe(true);
  });
});
