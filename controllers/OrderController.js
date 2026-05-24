const OrderService = require(
    '../services/OrderService'
)
const OrderFacade =
    require('../patterns/facade/OrderFacade');

class OrderController {

    async create(req, res) {

        try {

            const order =
                await OrderService.createOrder(
                    req.body,
                    req.user.id
                );

            res.status(201).json(order);

        } catch (error) {

            res.status(400).json({
                error: error.message
            });
        }
    }

    async getAll(req, res) {

        try {

            const orders =
                await OrderService.getOrders();

            res.json(orders);

        } catch (error) {

            res.status(400).json({
                error: error.message
            });
        }
    }

    async updateStatus(req, res) {

        try {

            const order =
                await OrderService.updateStatus(
                    req.params.id,
                    req.body.status
                );

            res.json(order);

        } catch (error) {

            res.status(400).json({
                error: error.message
            });
        }
    }
    async cancel(req, res) {

        try {

            const order =
                await OrderService.cancelOrder(
                    req.params.id
                );

            res.json(order);

        } catch (error) {

            res.status(400).json({
                error: error.message
            });
        }
    }
}

module.exports = new OrderController();