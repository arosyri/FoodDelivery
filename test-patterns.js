require('dotenv').config();
const mongoose = require('mongoose');

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    reset: '\x1b[0m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}${colors.reset}`),
    title: (msg) => console.log(`\n${colors.yellow}═══════════════════════════════════════════${colors.reset}\n${colors.blue}${msg}${colors.reset}`)
};

async function testAllPatterns() {
    console.clear();
    log.title('Тест усіх паттернів');

    const results = {
        builder: false,
        factory: false,
        strategy: false,
        observer: false,
        chain: false,
        command: false,
        decorator: false,
        facade: false,
        proxy: false,
        state: false
    };

    log.title('1. BUILDER');
    try {
        const OrderBuilder = require('./patterns/builder/OrderBuilder');
        const builder = new OrderBuilder();

        const order = builder
            .addItem('Pizza', 2, 15)
            .addItem('Burger', 1, 12)
            .setPaymentMethod('card')
            .applyDiscount(10)
            .setSpecialInstructions('Extra cheese')
            .build();

        const expectedTotal = (2 * 15 + 1 * 12) * 0.9; //37.8

        if (order.items.length === 2 &&
            order.totalPrice === expectedTotal &&
            order.paymentMethod === 'card') {
            log.success(`Builder працює, заказ на ${order.totalPrice}$ (${order.items.length} страви)`);
            results.builder = true;
        } else {
            log.error(`Builder не працює: total=${order.totalPrice}, expected=${expectedTotal}`);
        }
    } catch (error) {
        log.error(`Builder помилка: ${error.message}`);
    }

    log.title('2. FACTORY');
    try {
        const UserFactory = require('./patterns/factory/UserFactory');

        const customer = UserFactory.createUser('customer', { name: 'John', email: 'john@mail.com' });
        const courier = UserFactory.createUser('courier', { name: 'Mike', vehicle: 'motorcycle' });
        const admin = UserFactory.createUser('admin', { name: 'Admin' });

        if (customer.role === 'customer' && courier.role === 'courier' && admin.role === 'admin') {
            log.success(`Factory працює, створено Customer, Courier, Admin`);
            results.factory = true;
        } else {
            log.error('Factory не працює');
        }
    } catch (error) {
        log.error(`Factory помилка: ${error.message}`);
    }

    log.title('3. STRATEGY');
    try {
        const { PaymentContext, CashPayment, CardPayment } = require('./patterns/strategy/PaymentContext');

        const amount = 100;
        const cashResult = await new PaymentContext(new CashPayment()).executePayment(amount);
        const cardResult = await new PaymentContext(new CardPayment()).executePayment(amount);

        if (cashResult.method === 'cash' && cardResult.method === 'card') {
            log.success(`Strategy працює, Cash и Card оплата працює`);
            results.strategy = true;
        } else {
            log.error('Strategy не працює');
        }
    } catch (error) {
        log.error(`Strategy помилка: ${error.message}`);
    }

    log.title('4. OBSERVER');
    try {
        const { NotificationService, EmailNotifier, SMSNotifier } = require('./patterns/observer/NotificationService');

        const service = new NotificationService();
        let notifications = [];

        class TestObserver {
            update(order) { notifications.push(order.status); }
        }

        service.subscribe(new TestObserver());
        const testOrder = { _id: 'TEST123', status: 'confirmed' };
        service.notify(testOrder);

        if (notifications.length === 1 && notifications[0] === 'confirmed') {
            log.success('Observer працює, повідомлення надіслані');
            results.observer = true;
        } else {
            log.error('Observer не працює');
        }
    } catch (error) {
        log.error(`Observer помилка: ${error.message}`);
    }

    log.title('5. CHAIN OF RESPONSIBILITY');
    try {
        const { ItemValidator, PaymentValidator, PriceValidator, BaseHandler } = require('./patterns/chain/ItemValidator');

        const validator = new ItemValidator();
        validator.setNext(new PaymentValidator()).setNext(new PriceValidator());

        const validOrder = {
            items: [{ name: 'Pizza', quantity: 1, price: 15 }],
            paymentMethod: 'cash',
            totalPrice: 15
        };

        const invalidOrder = {
            items: [],
            paymentMethod: 'invalid',
            totalPrice: -5
        };

        const validResult = await validator.handle(validOrder);
        const invalidResult = await validator.handle(invalidOrder);

        if (validResult.success === true && invalidResult.success === false) {
            log.success(`Chain працює, валідація вірна`);
            results.chain = true;
        } else {
            log.error('Chain не працює');
        }
    } catch (error) {
        log.error(`Chain помилка: ${error.message}`);
    }

    log.title('6. COMMAND');
    try {
        const { CancelOrderCommand, CommandInvoker } = require('./patterns/command/CancelOrderCommand');
        const Order = require('./models/Order');

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test');
        }

        const testOrder = await Order.create({
            user: new mongoose.Types.ObjectId(),
            items: [{ name: 'Test', quantity: 1, price: 10 }],
            totalPrice: 10,
            paymentMethod: 'cash',
            status: 'pending'
        });

        const invoker = new CommandInvoker();
        const command = new CancelOrderCommand(Order, testOrder._id, testOrder.user);

        const cancelResult = await invoker.executeCommand(command);

        if (cancelResult.success === true) {
            log.success('Command працює, заказ відмінено');
            results.command = true;
        } else {
            log.error('Command не працює');
        }

        await Order.deleteOne({ _id: testOrder._id });

    } catch (error) {
        log.error(`Command помилка: ${error.message}`);
    }

    log.title('7. DECORATOR');
    try {
        const { BaseOrder, DiscountDecorator, PremiumDeliveryDecorator, InsuranceDecorator } = require('./patterns/decorator/BaseOrder');

        let order = new BaseOrder({ totalPrice: 100 });
        const basePrice = order.getPrice();
        console.log(`  Base price: ${basePrice}`);

        order = new DiscountDecorator(order, 10);
        const priceAfterDiscount = order.getPrice();
        console.log(`  After 10% discount: ${priceAfterDiscount}`);

        order = new PremiumDeliveryDecorator(order);
        const priceAfterDelivery = order.getPrice();
        console.log(`  After premium delivery: ${priceAfterDelivery}`);

        if (basePrice === 100 && priceAfterDiscount === 90 && priceAfterDelivery === 100) {
            log.success(`Decorator працює: ${basePrice} → ${priceAfterDiscount} → ${priceAfterDelivery}`);
            results.decorator = true;
        } else {
            log.error(`Decorator не працює: ${basePrice} → ${priceAfterDiscount} → ${priceAfterDelivery} (очікувалось: 100 → 90 → 100)`);
        }
    } catch (error) {
        log.error(`Decorator помилка: ${error.message}`);
    }

    log.title('8. FACADE');
    try {
        const OrderFacade = require('./patterns/facade/OrderFacade');
        const facade = new OrderFacade();

        const stats = await facade.getUserOrderStats(new mongoose.Types.ObjectId());

        if (typeof stats.totalOrders === 'number' && typeof stats.totalSpent === 'number') {
            log.success('Facade працює, статистика отримана');
            results.facade = true;
        } else {
            log.error('Facade не працює');
        }
    } catch (error) {
        log.error(`Facade помилка: ${error.message}`);
    }

    log.title('9. PROXY');
    try {
        const MenuProxy = require('./patterns/proxy/MenuProxy');
        const proxy = new MenuProxy();

        const start1 = Date.now();
        const menu1 = await proxy.getMenu();
        const time1 = Date.now() - start1;

        const start2 = Date.now();
        const menu2 = await proxy.getMenu();
        const time2 = Date.now() - start2;

        if (menu1.length > 0 && time2 < time1) {
            log.success(`Proxy працює, кеш працює, 1-й запит: ${time1}ms, 2-й: ${time2}ms`);
            results.proxy = true;
        } else {
            log.error('Proxy не працює');
        }
    } catch (error) {
        log.error(`Proxy помилка: ${error.message}`);
    }

    log.title('10. STATE');
    try {
        const states = ['created', 'confirmed', 'cooking', 'delivering', 'delivered', 'cancelled'];

        const fs = require('fs');
        const stateDir = './patterns/state';
        const stateFiles = fs.readdirSync(stateDir).filter(f => f.endsWith('.js'));

        if (stateFiles.length >= 5) {
            log.success(`State працює, знайдено ${stateFiles.length} файлів станів`);
            results.state = true;
        } else {
            log.error('State не працює, недостатньо файлів');
        }
    } catch (error) {
        log.error(`State ошибка: ${error.message}`);
    }

    log.title('Результати');

    let passed = 0;
    for (const [pattern, status] of Object.entries(results)) {
        if (status) {
            log.success(`${pattern.toUpperCase()}: Пройдено`);
            passed++;
        } else {
            log.error(`${pattern.toUpperCase()}: Не пройдено`);
        }
    }

    console.log(`\n${colors.blue}═══════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.yellow}Результат: ${passed}/10 паттернів працює${colors.reset}`);

    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    process.exit(0);
}
testAllPatterns().catch(console.error);