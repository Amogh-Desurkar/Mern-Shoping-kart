import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        try {
            const res = await API.get('/wishlist');
            setWishlist(res.data.wishlist || res.data || []);
        } catch (err) {
            console.error("Error loading wishlist:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    // Function to remove an item from the Wishlist page
    const handleRemove = async (productId) => {
        try {
            await API.patch(`/wishlist/${productId}/toggle`);
            // Update local state to immediately remove the product card
            setWishlist(prev => prev.filter(item => item._id !== productId));
        } catch (err) {
            console.error("Failed to remove item:", err);
        }
    };

    if (loading) return <div style={styles.centerText}>Loading your wishlist...</div>;

    if (wishlist.length === 0) {
        return (
            <div style={styles.emptyContainer}>
                <h2>Your Wishlist is Empty</h2>
                <p>Looks like you haven't saved any items yet.</p>
                <Link to="/products">
                    <button style={styles.browseBtn}>Browse Products</button>
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
            <h2>My Wishlist ({wishlist.length})</h2>
            <div style={styles.grid}>
                {wishlist.map(product => (
                    <div key={product._id} style={styles.card}>
                        <img 
                            src={product.image || 'https://via.placeholder.com/200'} 
                            alt={product.name} 
                            style={styles.image} 
                        />
                        <h3>{product.name}</h3>
                        <p style={styles.price}>₹{product.price}</p>
                        
                        <div style={styles.actions}>
                            <Link to={`/products/${product._id}`} style={{ flex: 1, textDecoration: 'none' }}>
                                <button style={styles.viewBtn}>View</button>
                            </Link>
                            
                            {/* Remove Button */}
                            <button 
                                onClick={() => handleRemove(product._id)} 
                                style={styles.removeBtn}
                            >
                                Remove ❤️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginTop: '20px' },
    card: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    image: { width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' },
    price: { fontSize: '18px', fontWeight: 'bold', margin: '10px 0' },
    actions: { display: 'flex', gap: '10px', marginTop: '10px' },
    viewBtn: { width: '100%', padding: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    removeBtn: { padding: '8px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    emptyContainer: { textAlign: 'center', marginTop: '60px' },
    browseBtn: { padding: '12px 24px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', marginTop: '15px' },
    centerText: { textAlign: 'center', fontSize: '18px', margin: '40px 0' }
};

export default Wishlist;