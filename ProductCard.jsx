import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, isWishlisted, onWishlistToggle }) => {
    const { addToCart } = useCart();
    const [adding, setAdding] = useState(false);

    const handleToggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const res = await API.patch(`/wishlist/${product._id}/toggle`);
            if (onWishlistToggle) {
                onWishlistToggle(product._id, res.data.isSaved);
            }
        } catch (err) {
            console.error("Failed to toggle wishlist:", err);
        }
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAdding(true);
        try {
            const res = await addToCart(product._id);
            if (res && !res.success) {
                alert(res.message);
            }
        } catch (err) {
            console.error("Add to cart error:", err);
            alert(err.response?.data?.message || err.message || "Failed to add to cart");
        } finally {
            setAdding(false); // ALWAYS resets button state back from "Adding..."
        }
    };

    const isOutOfStock = product.stock !== undefined && product.stock < 1;

    return (
        <div style={styles.card}>
            {/* Wishlist Heart Button */}
            <button 
                onClick={handleToggleWishlist} 
                style={styles.heartBtn}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
                {isWishlisted ? '❤️' : '🤍'}
            </button>

            <img 
                src={product.image || 'https://via.placeholder.com/200'} 
                alt={product.name} 
                style={styles.image} 
            />
            <h3 style={styles.title}>{product.name}</h3>
            {product.category && <span style={styles.category}>{product.category}</span>}
            <p style={styles.price}>₹{product.price}</p>
            {product.stock !== undefined && (
                <p style={{ ...styles.stock, color: isOutOfStock ? '#dc3545' : '#28a745' }}>
                    {isOutOfStock ? 'Out of Stock' : `${product.stock} units left`}
                </p>
            )}

            <div style={styles.actions}>
                <Link to={`/products/${product._id}`} style={{ flex: 1, textDecoration: 'none' }}>
                    <button style={styles.viewBtn}>View Details</button>
                </Link>
                <button 
                    onClick={handleAddToCart}
                    disabled={adding || isOutOfStock}
                    style={{
                        ...styles.cartBtn,
                        backgroundColor: isOutOfStock ? '#6c757d' : '#28a745',
                        cursor: (adding || isOutOfStock) ? 'not-allowed' : 'pointer'
                    }}
                >
                    {adding ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

const styles = {
    card: {
        position: 'relative',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    },
    heartBtn: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        cursor: 'pointer',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 2
    },
    image: { width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' },
    title: { fontSize: '18px', margin: '10px 0 5px', color: '#333' },
    category: { fontSize: '12px', background: '#f0f0f0', padding: '3px 8px', borderRadius: '4px', width: 'fit-content' },
    price: { fontSize: '20px', fontWeight: 'bold', margin: '10px 0 5px' },
    stock: { fontSize: '13px', marginBottom: '10px' },
    actions: { display: 'flex', gap: '10px', marginTop: '10px' },
    viewBtn: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    cartBtn: { flex: 1, padding: '10px', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }
};

export default ProductCard;