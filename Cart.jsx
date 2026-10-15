import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQty);
    }
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    return cart.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  if (!cart || cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Your Cart is Empty 🛒</h2>
        <button 
          onClick={() => navigate('/products')}
          style={btnStyle}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
      <h2>Your Shopping Cart</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        {cart.map((item, index) => {
          const product = item.product || item;
          const productId = product._id || item.productId || item._id;

          return (
            <div 
              key={productId || index} 
              style={{
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '15px', 
                border: '1px solid #ddd', 
                borderRadius: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img 
                  src={product.image || 'https://via.placeholder.com/80'} 
                  alt={product.name || 'Product'} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} 
                />
                <div>
                  <h4>{product.name || 'Unnamed Product'}</h4>
                  <p style={{ fontWeight: 'bold' }}>₹{product.price || 0}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={() => handleQuantityChange(productId, item.quantity, -1)}
                  style={btnStyle}
                >
                  -
                </button>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.quantity}</span>
                <button 
                  type="button"
                  onClick={() => handleQuantityChange(productId, item.quantity, 1)}
                  style={btnStyle}
                >
                  +
                </button>
                <button 
                  type="button"
                  onClick={() => handleRemove(productId)}
                  style={{ ...btnStyle, backgroundColor: '#dc3545', color: '#fff', marginLeft: '10px', border: 'none' }}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '30px', textAlign: 'right', borderTop: '2px solid #ddd', paddingTop: '20px' }}>
        <h3>Total: ₹{calculateTotal()}</h3>
        <button 
          type="button"
          onClick={() => navigate('/checkout')} 
          style={{
            backgroundColor: '#28a745',
            color: '#fff',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '15px'
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

const btnStyle = {
  padding: '6px 14px',
  fontSize: '16px',
  cursor: 'pointer',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#f8f9fa'
};

export default Cart;