import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from "./context/CartContext";
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';

function App() {
  const [user, setUser] = useState(null);

  return (
    <CartProvider>
      <Router>
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/home" element={<Home user={user} setUser={setUser} />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;