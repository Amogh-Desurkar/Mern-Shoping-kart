import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Home = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/me');
        setUser(res.data);
      } catch (err) {
        // Redirect to login if unauthenticated
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, setUser]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading profile...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px' }}>
      <h1>Welcome, {user?.fullName}!</h1>
      <div style={styles.card}>
        <h3>Customer Details</h3>
        <p><strong>Name:</strong> {user?.fullName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone:</strong> {user?.phone || 'N/A'}</p>
      </div>
    </div>
  );
};

const styles = {
  card: { padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '20px', backgroundColor: '#f9f9f9' }
};

export default Home;