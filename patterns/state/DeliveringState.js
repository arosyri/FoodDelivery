const OrderState = require('./OrderState');
const DeliveredState = require('./DeliveredState');
const CancelledState = require('./CancelledState');

class DeliveringState extends OrderState {
    constructor(order) {
        super(order);
        console.log(`Order ${order._id} is out for delivery`);
        setTimeout(() => {
            if (this.order.status === 'delivering') {
                this.complete().catch(console.error);
            }
        }, 45000);
    }

    async complete() {
        console.log(`Order ${this.order._id} delivered successfully`);
        this.order.status = 'delivered';
        this.order.setState(new DeliveredState(this.order));
        await this.order.save();
        return { success: true, message: 'Order delivered', newStatus: 'delivered' };
    }

    async cancel() {
        console.log(`Cannot cancel order ${this.order._id} - already delivering`);
        return { success: false, message: 'Cannot cancel order while delivering', newStatus: 'delivering' };
    }
}

module.exports = DeliveringState;