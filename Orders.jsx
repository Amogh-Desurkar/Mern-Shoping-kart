import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/orders', {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || 'Failed to fetch orders.');
        }
      } catch (err) {
        setError('Error connecting to server.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <h3 style={{ textAlign: 'center', marginTop: '40px' }}>Loading your orders...</h3>;
  if (error) return <h3 style={{ textAlign: 'center', color: 'red', marginTop: '40px' }}>{error}</h3>;

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>You have not placed any orders yet.</h2>
        <button onClick={() => navigate('/products')} style={btnStyle}>Start Shopping</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
      <h2>My Orders</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        {orders.map((order) => (
          <div key={order._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <span>Order #{order._id}</span>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>

            <div style={{ margin: '15px 0' }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <div>
                <strong>Total: ₹{order.totalAmount}</strong> | Status: <span style={{ color: order.paymentStatus === 'PAID' ? 'green' : 'orange', fontWeight: 'bold' }}>{order.status}</span>
              </div>
              <button onClick={() => navigate(`/orders/${order._id}`)} style={btnStyle}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const btnStyle = { padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' };

export default Orders;