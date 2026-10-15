import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // FIXED: Added /customers prefix to match Express backend routes
      await API.post('/customers/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register for ShopKart</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="fullName" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required style={styles.input} />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={styles.input} />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={styles.input} />
        <input name="phone" type="text" placeholder="Phone Number" value={formData.phone} onChange={handleChange} style={styles.input} />
        <button type="submit" style={styles.button}>Create Account</button>
      </form>
      <p style={{ marginTop: '10px' }}>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

const styles = {
  container: { maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '10px', fontSize: '16px' },
  button: { padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Register;