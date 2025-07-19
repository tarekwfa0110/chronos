import React from 'react';
import { render, act } from '@testing-library/react';
import { CartProvider, useCart } from '../app/cart-context';

function TestComponent() {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  return (
    <div>
      <button onClick={() => addToCart({ id: '1', name: 'Watch', price: 100 })}>Add</button>
      <button onClick={() => removeFromCart('1')}>Remove</button>
      <button onClick={() => updateQuantity('1', 5)}>Update</button>
      <button onClick={clearCart}>Clear</button>
      <div data-testid="cart-length">{cart.length}</div>
      <div data-testid="cart-quantity">{cart[0]?.quantity || 0}</div>
    </div>
  );
}

describe('CartContext', () => {
  it('should add, update, and remove items from the cart', () => {
    const { getByText, getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    act(() => {
      getByText('Add').click();
    });
    expect(getByTestId('cart-length').textContent).toBe('1');
    act(() => {
      getByText('Update').click();
    });
    expect(getByTestId('cart-quantity').textContent).toBe('5');
    act(() => {
      getByText('Remove').click();
    });
    expect(getByTestId('cart-length').textContent).toBe('0');
  });
}); 