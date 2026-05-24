const OrderState = require('./OrderState');

class CancelledState extends OrderState {
    constructor(order) {
        super(order);
        console.log(`Order ${order._id} was cancelled`);
    }

    async confirm() {
        return { success: false, message: 'Cannot confirm cancelled order', newStatus: 'cancelled' };
    }

    async cook() {
        return { success: false, message: 'Cannot cook cancelled order', newStatus: 'cancelled' };
    }

    async deliver() {
        return { success: false, message: 'Cannot deliver cancelled order', newStatus: 'cancelled' };
    }

    async complete() {
        return { success: false, message: 'Cancelled order cannot be completed', newStatus: 'cancelled' };
    }

    async cancel() {
        return { success: false, message: 'Order already cancelled', newStatus: 'cancelled' };
    }
}

module.exports = CancelledState;