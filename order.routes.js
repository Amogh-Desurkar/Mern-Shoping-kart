import express from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/create-payment-order', createPaymentOrder);
router.post('/verify-payment', verifyPayment);

export default router;