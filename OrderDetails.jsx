import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8000/orders/${id}`, {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setOrder(data.order);
        } else {
          setError(data.message || 'Order not found.');
        }
      } catch (err) {
        setError('Error fetching order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <h3 style={{ textAlign: 'center', marginTop: '40px' }}>Loading order details...</h3>;
  if (error) return <h3 style={{ textAlign: 'center', color: 'red', marginTop: '40px' }}>{error}</h3>;

  return (
    <div style={{ maxWidth: '700px', margin: '30px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ color: '#28a745', textAlign: 'center' }}>✅ Order Placed Successfully!</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>Your payment has been verified and your order is confirmed.</p>

      <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
        <p><strong>Order Status:</strong> {order.status}</p>
        <p><strong>Razorpay Payment ID:</strong> {order.razorpayPaymentId || 'N/A'}</p>
      </div>

      <h4>Shipping Address</h4>
      <p style={{ margin: '5px 0' }}>{order.shippingAddress.fullName}</p>
      <p style={{ margin: '5px 0' }}>{order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
      <p style={{ margin: '5px 0' }}>Phone: {order.shippingAddress.phone}</p>

      <h4 style={{ marginTop: '20px' }}>Purchased Items</h4>
      {order.items.map((item, idx) => (
        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
          <span>{item.name} × {item.quantity}</span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}

      <h3 style={{ textAlign: 'right', marginTop: '15px' }}>Total Amount: ₹{order.totalAmount}</h3>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
        <button onClick={() => navigate('/orders')} style={btnStyle}>View My Orders</button>
        <button onClick={() => navigate('/products')} style={{ ...btnStyle, backgroundColor: '#28a745' }}>Continue Shopping</button>
      </div>
    </div>
  );
};

const btnStyle = { padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

export default OrderDetails;