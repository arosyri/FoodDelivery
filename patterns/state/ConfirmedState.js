const OrderState = require('./OrderState');
const CookingState = require('./CookingState');
const CancelledState = require('./CancelledState');

class ConfirmedState extends OrderState {
    constructor(order) {
        super(order);
        console.log(`Order ${order._id} confirmed by restaurant`);
    }

    async cook() {
        console.log(`Starting cooking for order ${this.order._id}`);
        this.order.status = 'cooking';
        this.order.setState(new CookingState(this.order));
        await this.order.save();
        return { success: true, message: 'Order is being cooked', newStatus: 'cooking' };
    }

    async cancel() {
        console.log(`Cancelling order ${this.order._id}`);
        this.order.status = 'cancelled';
        this.order.setState(new CancelledState(this.order));
        await this.order.save();
        return { success: true, message: 'Order cancelled', newStatus: 'cancelled' };
    }
}

module.exports = ConfirmedState;