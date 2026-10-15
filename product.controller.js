import Product from '../models/product.model.js';
import mongoose from 'mongoose';

// POST /products - Create Product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;

        if (!name || !description || price === undefined || !category || !image || stock === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        if (price <= 0) {
            return res.status(400).json({ message: "Invalid price: Must be greater than 0" });
        }

        if (stock < 0) {
            return res.status(400).json({ message: "Invalid stock: Cannot be negative" });
        }

        const newProduct = await Product.create({ name, description, price, category, image, stock });
        return res.status(201).json(newProduct);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// GET /products - Fetch All (with Search, Category, and Price Sort)
export const getProducts = async (req, res) => {
    try {
        const { search, category, sort } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        let sortOption = {};
        if (sort === 'price_asc') sortOption.price = 1;
        else if (sort === 'price_desc') sortOption.price = -1;
        else sortOption.createdAt = -1;

        const products = await Product.find(query).sort(sortOption);

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET /products/:id - Fetch Single Product
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json(product);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};