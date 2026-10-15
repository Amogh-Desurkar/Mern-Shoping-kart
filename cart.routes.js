import express from 'express';
import { getCart, addToCart, updateCartQuantity, removeFromCart } from '../controllers/cart.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/:productId', addToCart);
router.patch('/:productId', updateCartQuantity);
router.delete('/:productId', removeFromCart);

export { router as cartRoutes };