const { BaseOrder, DiscountDecorator, PremiumDeliveryDecorator, InsuranceDecorator } = require('../decorator/BaseOrder');
const Order = require('../../models/Order');
const { NotificationService, EmailNotifier, SMSNotifier } = require('../observer/NotificationService');
const { CancelOrderCommand, CommandInvoker } = require('../command/CancelOrderCommand');

class OrderFacade {
    constructor() {
        this.notificationService = new NotificationService();
        this.notificationService.subscribe(new EmailNotifier());
        this.notificationService.subscribe(new SMSNotifier());
        this.commandInvoker = new CommandInvoker();
    }

    async createSimpleOrder(userId, itemName, quantity, price, paymentMethod) {
        const orderData = {
            user: userId,
            items: [{ name: itemName, quantity, price }],
            totalPrice: price * quantity,
            paymentMethod: paymentMethod,
            status: 'created'
        };

        const order = await Order.create(orderData);
        this.notificationService.notify(order);

        return order;
    }

    async createEnhancedOrder(userId, items, options = {}) {
        let basePrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        let decoratedOrder = new BaseOrder({ totalPrice: basePrice });
        const appliedDecorators = [];

        if (options.discount) {
            decoratedOrder = new DiscountDecorator(decoratedOrder, options.discountPercent || 10);
            appliedDecorators.push(`${options.discountPercent || 10}% Discount`);
        }

        if (options.premiumDelivery) {
            decoratedOrder = new PremiumDeliveryDecorator(decoratedOrder);
            appliedDecorators.push('Premium Delivery');
        }

        if (options.insurance) {
            decoratedOrder = new InsuranceDecorator(decoratedOrder);
            appliedDecorators.push('Insurance');
        }

        const finalPrice = decoratedOrder.getPrice();

        const orderData = {
            user: userId,
            items: items,
            totalPrice: finalPrice,
            paymentMethod: options.paymentMethod || 'cash',
            discount: options.discount || false,
            status: 'pending'
        };

        const order = await Order.create(orderData);

        console.log('Order saved with status:', order.status);

        this.notificationService.notify(order);

        return {
            order,
            appliedDecorators: appliedDecorators,
            description: decoratedOrder.getDescription(),
            originalPrice: basePrice,
            finalPrice: finalPrice
        };
    }
    async cancelOrder(orderId, userId) {
        const cancelCommand = new CancelOrderCommand(Order, orderId, userId);
        const result = await this.commandInvoker.executeCommand(cancelCommand);

        if (result.success) {
            this.notificationService.notify(result.order);
        }

        return result;
    }

    async undoLastCancel() {
        return await this.commandInvoker.undoLastCommand();
    }

    async getOrderDetails(orderId, userId) {
        const order = await Order.findOne({ _id: orderId, user: userId })
            .populate('user', 'name email');

        if (!order) {
            throw new Error('Order not found');
        }

        let deliveryInfo = {};

        if (order.status === 'delivering') {
            deliveryInfo = {
                estimatedTime: '45 minutes',
                courier: 'Assigned courier',
                tracking: 'https://tracking.example.com/' + order._id
            };
        }

        return {
            ...order.toObject(),
            deliveryInfo,
            canCancel: ['created', 'confirmed', 'cooking'].includes(order.status),
            canReorder: order.status === 'delivered'
        };
    }

    async getUserOrderStats(userId) {
        const orders = await Order.find({ user: userId });

        const stats = {
            totalOrders: orders.length,
            totalSpent: orders.reduce((sum, order) => sum + order.totalPrice, 0),
            cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
            completedOrders: orders.filter(o => o.status === 'delivered').length,
            averageOrderValue: orders.length > 0
                ? orders.reduce((sum, order) => sum + order.totalPrice, 0) / orders.length
                : 0
        };

        return stats;
    }
}

module.exports = OrderFacade;