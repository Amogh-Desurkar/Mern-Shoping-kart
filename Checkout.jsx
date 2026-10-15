import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: 'Test User',
    phone: '9876543210',
    addressLine1: 'Test Address Line 1',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560010'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!/^\d{10}$/.test(shippingAddress.phone.trim())) {
      newErrors.phone = 'Valid 10-digit Phone Number is required.';
    }
    if (!shippingAddress.addressLine1.trim()) newErrors.addressLine1 = 'Address line is required.';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required.';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required.';
    if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
      newErrors.pincode = 'Pincode must contain 6 digits.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Failed to load Razorpay SDK.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/orders/create-payment-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        credentials: 'include',
        body: JSON.stringify({
          shippingAddress,
          amount: calculateTotal()
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setApiError(data.message || 'Failed to create payment order.');
        setLoading(false);
        return;
      }

      const options = {
        key: data.key || 'rzp_test_To4UsFVFKLHoat',
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'ShopKart',
        description: 'ShopKart Checkout',
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('http://localhost:8000/orders/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : ''
              },
              credentials: 'include',
              body: JSON.stringify({
                shopKartOrderId: data.shopKartOrderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              if (fetchCart) await fetchCart();
              alert('Payment Successful!');
              navigate(`/orders/${data.shopKartOrderId}`);
            } else {
              alert(verifyData.message || 'Payment verification failed.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Error verifying payment.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
          email: 'test@example.com'
        },
        theme: { color: '#28a745' }
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on('payment.failed', function (response) {
        alert('Payment Failed: ' + response.error.description);
        setLoading(false);
      });

      paymentObject.open();
    } catch (err) {
      console.error('Checkout error:', err);
      setApiError('Something went wrong during checkout.');
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Your Cart is Empty 🛒</h2>
        <button onClick={() => navigate('/products')} style={btnStyle}>Browse Products</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px' }}>
      <h2>Checkout</h2>
      {apiError && <div style={{ color: 'red', marginBottom: '15px' }}>{apiError}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
        <div>
          <h3>Shipping Details</h3>
          <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label>Full Name</label>
              <input type="text" name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} style={inputStyle} />
              {errors.fullName && <span style={errorStyle}>{errors.fullName}</span>}
            </div>

            <div>
              <label>Phone Number</label>
              <input type="text" name="phone" value={shippingAddress.phone} onChange={handleInputChange} style={inputStyle} />
              {errors.phone && <span style={errorStyle}>{errors.phone}</span>}
            </div>

            <div>
              <label>Address Line</label>
              <input type="text" name="addressLine1" value={shippingAddress.addressLine1} onChange={handleInputChange} style={inputStyle} />
              {errors.addressLine1 && <span style={errorStyle}>{errors.addressLine1}</span>}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label>City</label>
                <input type="text" name="city" value={shippingAddress.city} onChange={handleInputChange} style={inputStyle} />
                {errors.city && <span style={errorStyle}>{errors.city}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <label>State</label>
                <input type="text" name="state" value={shippingAddress.state} onChange={handleInputChange} style={inputStyle} />
                {errors.state && <span style={errorStyle}>{errors.state}</span>}
              </div>
            </div>

            <div>
              <label>Pincode</label>
              <input type="text" name="pincode" value={shippingAddress.pincode} onChange={handleInputChange} style={inputStyle} />
              {errors.pincode && <span style={errorStyle}>{errors.pincode}</span>}
            </div>

            <button type="submit" disabled={loading} style={{ ...btnStyle, backgroundColor: '#28a745', marginTop: '15px' }}>
              {loading ? 'Processing Order...' : 'Pay & Place Order'}
            </button>
          </form>
        </div>

        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
          <h3>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '15px 0' }}>
            {cart.map((item, idx) => {
              const product = item.product || item;
              return (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{product.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 'bold' }}>₹{(product.price || 0) * item.quantity}</span>
                </div>
              );
            })}
          </div>
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginTop: '10px' }}>
            <span>Total</span>
            <span>₹{calculateTotal()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' };
const errorStyle = { color: 'red', fontSize: '12px' };
const btnStyle = { padding: '10px 20px', color: '#fff', backgroundColor: '#007bff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

export default Checkout;