const OrderState = require('./OrderState');

class DeliveredState extends OrderState {
    constructor(order) {
        super(order);
        console.log(`Order ${order._id} completed - Thank you!`);
    }

    async complete() {
        return { success: false, message: 'Order already delivered', newStatus: 'delivered' };
    }

    async cancel() {
        return { success: false, message: 'Cannot cancel delivered order', newStatus: 'delivered' };
    }
}

module.exports = DeliveredState;