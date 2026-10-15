import Customer from '../models/customer.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// POST /customers/register
export const registerCustomer = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: "Customer already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Customer.create({
            fullName,
            email,
            password: hashedPassword,
            phone
        });

        return res.status(201).json({ message: "Customer registered successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// POST /customers/login
export const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: customer._id, email: customer.email },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1d' }
        );

        res.cookie('token', token, { httpOnly: true });

        return res.status(200).json({
            message: "Login successful",
            customer: {
                _id: customer._id,
                fullName: customer.fullName,
                email: customer.email
            },
            token
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET /customers/me
export const getUser = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user.id || req.user._id).select('-password');
        if (!customer) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(customer);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// POST /customers/logout
export const logoutCustomer = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};