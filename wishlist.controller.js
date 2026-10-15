import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';

// POST /wishlist/:productId - Add to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id || req.user._id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const user = await Customer.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.wishlist.includes(productId)) {
            return res.status(409).json({ message: "Product already in wishlist" });
        }

        user.wishlist.push(productId);
        await user.save();

        return res.status(200).json({ success: true, message: "Product added to wishlist" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET /wishlist - Get current user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        const user = await Customer.findById(userId).populate({
            path: 'wishlist',
            select: 'name price category image stock description'
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            count: user.wishlist.length,
            wishlist: user.wishlist
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// DELETE /wishlist/:productId - Remove from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id || req.user._id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        const user = await Customer.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.wishlist.includes(productId)) {
            return res.status(404).json({ message: "Product not in wishlist" });
        }

        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();

        return res.status(200).json({ success: true, message: "Product removed from wishlist" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// PATCH /wishlist/:productId/toggle - Bonus: Toggle Wishlist
export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id || req.user._id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        const user = await Customer.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isSaved = user.wishlist.includes(productId);
        if (isSaved) {
            user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        } else {
            user.wishlist.push(productId);
        }

        await user.save();
        return res.status(200).json({
            success: true,
            isSaved: !isSaved,
            message: !isSaved ? "Added to wishlist" : "Removed from wishlist"
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};