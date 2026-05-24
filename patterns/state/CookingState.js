const OrderState = require('./OrderState');
const DeliveringState = require('./DeliveringState');
const CancelledState = require('./CancelledState');

class CookingState extends OrderState {
    constructor(order) {
        super(order);
        console.log(`Order ${order._id} is being cooked`);
        setTimeout(() => {
            if (this.order.status === 'cooking') {
                this.cook().catch(console.error);
            }
        }, 30000);
    }

    async cook() {
        console.log(`Cooking completed for order ${this.order._id}`);
        this.order.status = 'delivering';
        this.order.setState(new DeliveringState(this.order));
        await this.order.save();
        return { success: true, message: 'Order ready for delivery', newStatus: 'delivering' };
    }

    async cancel() {
        console.log(`Cancelling order ${this.order._id} during cooking`);
        this.order.status = 'cancelled';
        this.order.setState(new CancelledState(this.order));
        await this.order.save();
        return { success: true, message: 'Order cancelled', newStatus: 'cancelled' };
    }
}

module.exports = CookingState;