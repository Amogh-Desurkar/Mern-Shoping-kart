import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const { totalCount } = useCart();

    const handleLogout = async () => {
        try {
            await API.post('/customers/logout');
        } catch (err) {
            console.error(err);
        }
        setUser(null);
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <Link to="/products" style={styles.logo}>ShopKart</Link>
            <div style={styles.links}>
                <Link to="/products" style={styles.link}>Products</Link>
                {user ? (
                    <>
                        <Link to="/wishlist" style={styles.link}>Wishlist</Link>
                        <Link to="/cart" style={styles.link}>Cart ({totalCount})</Link>
                        <span style={{ color: '#fff' }}>Hi, {user.fullName || 'User'}</span>
                        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: '#333', color: '#fff' },
    logo: { fontSize: '20px', fontWeight: 'bold', color: '#fff', textDecoration: 'none' },
    links: { display: 'flex', gap: '20px', alignItems: 'center' },
    link: { color: '#fff', textDecoration: 'none' },
    logoutBtn: { padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Navbar;