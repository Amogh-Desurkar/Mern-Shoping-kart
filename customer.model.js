import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: [1, 'Quantity cannot be less than 1']
    }
});

const customerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    cart: [cartItemSchema]
}, { timestamps: true });

const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
export default Customer;