import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // ✅ Updated to hit /customers/login
      const res = await API.post('/customers/login', credentials);
      if (res.data?.customer) {
        setUser(res.data.customer);
      }
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Credentials');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="email" type="email" placeholder="Email" value={credentials.email} onChange={handleChange} required style={styles.input} />
        <input name="password" type="password" placeholder="Password" value={credentials.password} onChange={handleChange} required style={styles.input} />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p style={{ marginTop: '10px' }}>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
};

const styles = {
  container: { maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '10px', fontSize: '16px' },
  button: { padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Login;