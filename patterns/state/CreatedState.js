const OrderState = require('./OrderState');
const ConfirmedState = require('./ConfirmedState');
const CancelledState = require('./CancelledState');

class CreatedState extends OrderState {
    constructor(order) {
        super(order);
        console.log(`Order ${order._id} created`);
    }

    async confirm() {
        console.log(`Confirming order ${this.order._id}`);
        this.order.status = 'confirmed';
        this.order.setState(new ConfirmedState(this.order));
        await this.order.save();
        return { success: true, message: 'Order confirmed', newStatus: 'confirmed' };
    }

    async cancel() {
        console.log(`Cancelling order ${this.order._id}`);
        this.order.status = 'cancelled';
        this.order.setState(new CancelledState(this.order));
        await this.order.save();
        return { success: true, message: 'Order cancelled', newStatus: 'cancelled' };
    }
}

module.exports = CreatedState;