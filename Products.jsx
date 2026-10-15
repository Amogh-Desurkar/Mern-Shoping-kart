import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [wishlistIds, setWishlistIds] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (category !== 'All') params.append('category', category);
            if (sort) params.append('sort', sort);

            const res = await API.get(`/products?${params.toString()}`);
            setProducts(res.data.products || res.data || []);
        } catch (err) {
            setError('Something went wrong while loading products.');
        } finally {
            setLoading(false);
        }
    };

    const fetchWishlist = async () => {
        try {
            const res = await API.get('/wishlist');
            const items = res.data.wishlist || res.data || [];
            setWishlistIds(items.map(item => item._id || item));
        } catch (err) {
            // Not logged in or no wishlist found
            setWishlistIds([]);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, category, sort]);

    const handleWishlistToggle = (productId, isSaved) => {
        if (isSaved) {
            setWishlistIds(prev => [...prev, productId]);
        } else {
            setWishlistIds(prev => prev.filter(id => id !== productId));
        }
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
            <h2>Product Catalog</h2>

            <div style={styles.filterBar}>
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    style={styles.input}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
                    <option value="All">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Books">Books</option>
                    <option value="Home">Home</option>
                </select>
                <select value={sort} onChange={(e) => setSort(e.target.value)} style={styles.select}>
                    <option value="">Sort By</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
            </div>

            {loading && <p style={styles.centerText}>Loading products...</p>}
            {error && <p style={{ ...styles.centerText, color: 'red' }}>{error}</p>}
            {!loading && !error && products.length === 0 && (
                <p style={styles.centerText}>No products found.</p>
            )}

            {!loading && !error && products.length > 0 && (
                <div style={styles.grid}>
                    {products.map(product => (
                        <ProductCard 
                            key={product._id} 
                            product={product} 
                            isWishlisted={wishlistIds.includes(product._id)}
                            onWishlistToggle={handleWishlistToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    filterBar: { display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' },
    input: { flex: '1 1 200px', padding: '10px', fontSize: '16px' },
    select: { padding: '10px', fontSize: '16px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' },
    centerText: { textAlign: 'center', fontSize: '18px', margin: '40px 0' }
};

export default Products;