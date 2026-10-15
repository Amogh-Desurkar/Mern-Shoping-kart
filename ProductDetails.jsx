import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await API.get(`/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <p style={styles.centerText}>Loading product details...</p>;
    if (error) return <p style={{ ...styles.centerText, color: 'red' }}>{error}</p>;
    if (!product) return <p style={styles.centerText}>Product not found.</p>;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <Link to="/products" style={{ textDecoration: 'none', color: '#007bff' }}>← Back to Products</Link>
            <div style={styles.container}>
                <img src={product.image} alt={product.name} style={styles.image} />
                <div style={styles.details}>
                    <h2>{product.name}</h2>
                    <span style={styles.badge}>{product.category}</span>
                    <p style={styles.description}>{product.description}</p>
                    <h3 style={styles.price}>₹{product.price.toLocaleString('en-IN')}</h3>
                    <p style={{ color: product.stock > 0 ? 'green' : 'red' }}>
                        {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                    </p>
                    <button style={styles.button} disabled={product.stock <= 0}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', gap: '30px', marginTop: '20px', flexWrap: 'wrap' },
    image: { width: '350px', height: '300px', objectFit: 'cover', borderRadius: '8px' },
    details: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
    badge: { background: '#eef', color: '#33f', padding: '4px 10px', borderRadius: '4px', width: 'fit-content' },
    description: { fontSize: '16px', color: '#555' },
    price: { fontSize: '24px', margin: '5px 0' },
    button: { padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
    centerText: { textAlign: 'center', fontSize: '18px', margin: '40px 0' }
};

export default ProductDetails;