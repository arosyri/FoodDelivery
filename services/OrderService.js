const Order = require('../models/Order');

const OrderBuilder = require(
    '../patterns/builder/OrderBuilder'
);

const PaymentContext = require(
    '../patterns/strategy/PaymentContext'
);

const OrderObserver = require(
    '../patterns/observer/OrderObserver'
);

const NotificationService = require(
    '../patterns/observer/NotificationService'
);
const CancelOrderCommand = require(
    '../patterns/command/CancelOrderCommand'
);
class OrderService {

    async createOrder(orderData, userId) {
        const paymentValidator =
            new PaymentValidator();

        const itemValidator =
            new ItemValidator();

        paymentValidator.setNext(
            itemValidator
        );

        paymentValidator.handle(orderData);

        const builder = new OrderBuilder();

        builder.setCustomer(userId);

        orderData.items.forEach(item => {

            builder.addItem(
                item.name,
                item.quantity,
                item.price
            );
        });

        builder.setPaymentMethod(
            orderData.paymentMethod
        );

        const builtOrder = builder.build();
        let decoratedOrder =
            new BaseOrder(builtOrder);

        if (orderData.discount) {

            decoratedOrder =
                new DiscountDecorator(
                    decoratedOrder
                );
        }

        if (orderData.premiumDelivery) {

            decoratedOrder =
                new PremiumDeliveryDecorator(
                    decoratedOrder
                );
        }

        builtOrder.totalPrice =
            decoratedOrder.getTotalPrice();

        const paymentContext = new PaymentContext();

        if (
            builtOrder.paymentMethod === 'cash'
        ) {

            paymentContext.setStrategy(
                new CashPayment()
            );

        } else {

            paymentContext.setStrategy(
                new CardPayment()
            );
        }

        paymentContext.execute(
            builtOrder.totalPrice
        );

        const order = await Order.create(
            builtOrder
        );

        const observer = new OrderObserver();

        observer.subscribe(
            new NotificationService()
        );

        observer.notify(
            `Order ${order._id} created`
        );

        return order;
    }
    async getOrders() {

        return Order.find()
            .populate('customer');
    }

    async updateStatus(orderId, status) {

        const order = await Order.findById(orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        order.status = status;

        await order.save();

        return order;
    }
    async cancelOrder(orderId) {

        const order = await Order.findById(
            orderId
        );

        if (!order) {
            throw new Error('Order not found');
        }

        const command =
            new CancelOrderCommand(order);

        return await command.execute();
    }
}

const BaseOrder = require(
    '../patterns/decorator/BaseOrder'
);

const PaymentValidator = require(
    '../patterns/chain/PaymentValidator'
);

const ItemValidator = require(
    '../patterns/chain/ItemValidator'
);

module.exports = new OrderService();