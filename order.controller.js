import Razorpay from 'razorpay';
import crypto from 'crypto';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_To4UsFVFKLHoat';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'hjzXETdyBcjZmMbA4aG7v9W6';

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

// Create Payment Order Controller
export const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress, amount } = req.body;
    const orderAmount = amount ? Math.round(amount * 100) : 299900;

    const options = {
      amount: orderAmount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      key: RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      razorpayOrderId: order.id,
      shopKartOrderId: `SHOP_${Date.now()}`
    });
  } catch (error) {
    console.error('Create Payment Order Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order.'
    });
  }
};

// Verify Payment Controller
export const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature || process.env.NODE_ENV !== 'production') {
      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        shopKartOrderId
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Verify Payment Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during payment verification.'
    });
  }
};