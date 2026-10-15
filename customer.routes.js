import express from 'express';
import { registerCustomer, loginCustomer, getUser, logoutCustomer } from '../controllers/customer.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.get('/me', authenticate, getUser);
router.post('/logout', logoutCustomer);

export { router as customerRoutes };