import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dns from 'node:dns';

import { cartRoutes } from './routes/cart.routes.js';
import { customerRoutes } from './routes/customer.routes.js';
import { productRoutes } from './routes/product.routes.js';
import { wishlistRoutes } from './routes/wishlist.routes.js';
import orderRoutes from './routes/order.routes.js';

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '1.0.0.1', '8.8.8.8']);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const mongoURI = process.env.DBURL || process.env.MONGO_URI;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/ping', (req, res) => res.send('pong'));
app.use('/', customerRoutes); // Added for GET /me
app.use('/customers', customerRoutes);
app.use('/cart', cartRoutes);
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/orders', orderRoutes);

const startServer = async () => {
    try {
        if (!mongoURI) {
            throw new Error("No MongoDB URI found in .env file! Check your DBURL or MONGO_URI key.");
        }
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 10000 });
        console.log("DB Connected Successfully!");

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}!`);
        });
    } catch (err) {
        console.error("MONGODB CONNECTION FAILED:", err.message);
        process.exit(1);
    }
};

startServer();