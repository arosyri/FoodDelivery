const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [
            {
                name: String,
                quantity: Number,
                price: Number
            }
        ],
        totalPrice: {
            type: Number,
            default: 0
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'card'],
            required: true
        },
        discount: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cooking', 'delivering', 'delivered', 'cancelled'],
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Order', orderSchema);