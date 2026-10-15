import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import WishlistCard from '../components/WishlistCard';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchWishlist = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await API.get('/wishlist');
            setWishlist(res.data.wishlist || []);
        } catch (err) {
            setError("We couldn't load your wishlist.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        try {
            await API.delete(`/wishlist/${productId}`);
            setWishlist(prev => prev.filter(item => item._id !== productId));
        } catch (err) {
            alert('Failed to remove product from wishlist.');
        }
    };

    if (loading) {
        return (
            <div style={styles.centerText}>
                <h3>Loading your wishlist...</h3>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.centerText}>
                <h3>Something went wrong.</h3>
                <p style={{ color: 'red' }}>{error}</p>
                <button onClick={fetchWishlist} style={styles.retryBtn}>Try Again</button>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div style={styles.centerText}>
                <div style={{ fontSize: '48px' }}>❤️</div>
                <h2>Your wishlist is empty</h2>
                <p style={{ color: '#666' }}>Save products you love and find them here later.</p>
                <Link to="/products" style={styles.browseBtn}>Browse Products</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
            <h2>My Wishlist</h2>
            <p style={{ color: '#666' }}>{wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved</p>
            <div style={styles.grid}>
                {wishlist.map(product => (
                    <WishlistCard key={product._id} product={product} onRemove={handleRemove} />
                ))}
            </div>
        </div>
    );
};

const styles = {
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginTop: '20px' },
    centerText: { textAlign: 'center', padding: '60px 20px' },
    retryBtn: { padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    browseBtn: { display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', textDecoration: 'none', borderRadius: '4px' }
};

export default Wishlist;