class BaseHandler {
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }

    async handle(order) {
        if (this.nextHandler) {
            return await this.nextHandler.handle(order);
        }
        return { success: true };
    }
}

class ItemValidator extends BaseHandler {
    async handle(order) {
        if (!order.items || order.items.length === 0) {
            return { success: false, error: 'Order must have at least one item' };
        }

        for (const item of order.items) {
            if (!item.name || item.quantity < 1 || item.price < 0) {
                return { success: false, error: `Invalid item: ${item.name}` };
            }
        }

        return super.handle(order);
    }
}

class PaymentValidator extends BaseHandler {
    async handle(order) {
        const validMethods = ['cash', 'card', 'crypto'];
        if (!validMethods.includes(order.paymentMethod)) {
            return { success: false, error: `Invalid payment method: ${order.paymentMethod}` };
        }
        return super.handle(order);
    }
}

class PriceValidator extends BaseHandler {
    async handle(order) {
        if (order.totalPrice <= 0) {
            return { success: false, error: 'Total price must be greater than 0' };
        }
        return super.handle(order);
    }
}

module.exports = { ItemValidator, PaymentValidator, PriceValidator, BaseHandler };