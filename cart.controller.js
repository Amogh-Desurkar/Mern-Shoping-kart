import Customer from '../models/customer.model.js';

// Get customer cart
export const getCart = async (req, res) => {
    try {
        const customerId = req.user.id || req.user._id;
        const customer = await Customer.findById(customerId).populate('cart.product');
        
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        res.status(200).json({ success: true, cart: customer.cart || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.user.id || req.user._id;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        if (!customer.cart) {
            customer.cart = [];
        }

        const existingItemIndex = customer.cart.findIndex(
            (item) => item.product && item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            customer.cart[existingItemIndex].quantity += 1;
        } else {
            customer.cart.push({ product: productId, quantity: 1 });
        }

        await customer.save();
        await customer.populate('cart.product');

        res.status(200).json({ success: true, cart: customer.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update item quantity
export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const customerId = req.user.id || req.user._id;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        const itemIndex = customer.cart.findIndex(
            (item) => item.product && item.product.toString() === productId
        );

        if (itemIndex > -1) {
            if (quantity <= 0) {
                customer.cart.splice(itemIndex, 1);
            } else {
                customer.cart[itemIndex].quantity = quantity;
            }
            await customer.save();
            await customer.populate('cart.product');
            return res.status(200).json({ success: true, cart: customer.cart });
        }

        res.status(404).json({ success: false, message: 'Item not found in cart' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.user.id || req.user._id;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        customer.cart = customer.cart.filter(
            (item) => item.product && item.product.toString() !== productId
        );

        await customer.save();
        await customer.populate('cart.product');

        res.status(200).json({ success: true, cart: customer.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};