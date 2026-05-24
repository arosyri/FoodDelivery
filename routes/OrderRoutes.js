const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/AuthMiddleware');
const OrderFacade = require('../patterns/facade/OrderFacade');
const MenuProxy = require('../patterns/proxy/MenuProxy');
const { BaseOrder, DiscountDecorator, PremiumDeliveryDecorator, InsuranceDecorator } = require('../patterns/decorator/BaseOrder');

const router = express.Router();
const orderFacade = new OrderFacade();
const menuProxy = new MenuProxy();

router.post('/', auth, async (req, res) => {
    try {
        console.log('Creating order for user:', req.user.id);
        console.log('Order data:', req.body);

        const { items, paymentMethod, discount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must have at least one item' });
        }

        let originalTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        console.log('Original total (before discount):', originalTotal);

        let finalTotal = originalTotal;

        if (discount === true) {
            const discountAmount = originalTotal * 0.1;
            finalTotal = originalTotal - discountAmount;
            console.log(`Discount applied: -$${discountAmount.toFixed(2)}`);
            console.log(`Final total after discount: $${finalTotal.toFixed(2)}`);
        }

        finalTotal = Math.round(finalTotal * 100) / 100;

        const order = await Order.create({
            user: req.user.id,
            items: items,
            totalPrice: finalTotal,
            paymentMethod: paymentMethod,
            discount: discount === true,
            status: 'pending'
        });

        console.log('Order created. Total:', order.totalPrice);

        res.status(201).json({
            success: true,
            order: order,
            originalPrice: originalTotal,
            discountAmount: discount === true ? originalTotal * 0.1 : 0,
            finalPrice: finalTotal,
            message: 'Order created successfully'
        });

    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        console.log('Fetching orders for user:', req.user.id);

        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

        console.log(`Found ${orders.length} orders`);
        res.json(orders);

    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/menu', async (req, res) => {
    try {
        const forceRefresh = req.query.refresh === 'true';
        const menu = await menuProxy.getMenu(forceRefresh);
        res.json(menu);
    } catch (error) {
        console.error('Get menu error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.patch('/:id/cancel', auth, async (req, res) => {
    try {
        console.log('Cancelling order:', req.params.id);

        const result = await orderFacade.cancelOrder(req.params.id, req.user.id);

        console.log('Cancel result:', result);
        res.json(result);

    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const orderDetails = await orderFacade.getOrderDetails(req.params.id, req.user.id);
        res.json(orderDetails);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/stats/summary', auth, async (req, res) => {
    try {
        const stats = await orderFacade.getUserOrderStats(req.user.id);
        res.json(stats);
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/demo/decorators', auth, async (req, res) => {
    try {
        const { items, applyDiscount, applyPremium, applyInsurance } = req.body;

        let basePrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        let order = new BaseOrder({ totalPrice: basePrice });
        const applied = [];

        if (applyDiscount) {
            order = new DiscountDecorator(order, 10);
            applied.push('10% Discount');
        }

        if (applyPremium) {
            order = new PremiumDeliveryDecorator(order);
            applied.push('Premium Delivery');
        }

        if (applyInsurance) {
            order = new InsuranceDecorator(order);
            applied.push('Insurance');
        }

        res.json({
            originalPrice: basePrice,
            finalPrice: order.getPrice(),
            appliedDecorators: applied,
            description: order.getDescription(),
            deliveryTime: order.getDeliveryTime ? order.getDeliveryTime() : 'Standard (60 minutes)'
        });

    } catch (error) {
        console.error('Decorator demo error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;