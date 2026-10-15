import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to get auth header
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    };
  };

  // 1. Fetch Cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/cart', {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.cart) {
        setCart(data.cart);
      } else if (data.items) {
        setCart(data.items);
      }
    } catch (err) {
      console.error('Fetch Cart Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Add to Cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await fetch(`http://localhost:8000/cart/${productId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ quantity })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchCart();
      } else {
        alert(data.message || 'Failed to add item to cart');
      }
    } catch (err) {
      console.error('Add to Cart Error:', err);
    }
  };

  // 3. Update Quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await fetch(`http://localhost:8000/cart/${productId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ quantity })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchCart();
      } else {
        console.error('Update Quantity Error:', data.message);
      }
    } catch (err) {
      console.error('Update Quantity Server Error:', err);
    }
  };

  // 4. Remove Item from Cart
  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`http://localhost:8000/cart/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        await fetchCart();
      } else {
        console.error('Remove Item Error:', data.message);
      }
    } catch (err) {
      console.error('Remove Item Server Error:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);