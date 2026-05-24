class PaymentStrategy {
    async pay(amount) {
        throw new Error('pay() must be implemented');
    }
}

class CashPayment extends PaymentStrategy {
    async pay(amount) {
        return {
            success: true,
            method: 'cash',
            message: `Pay ${amount} cash upon delivery`,
            amount
        };
    }
}

class CardPayment extends PaymentStrategy {
    async pay(amount) {
        return {
            success: true,
            method: 'card',
            message: `Payment of ${amount} processed via card`,
            amount,
            transactionId: `card_${Date.now()}`
        };
    }
}

class CryptoPayment extends PaymentStrategy {
    async pay(amount) {
        return {
            success: true,
            method: 'crypto',
            message: `Payment of ${amount} processed via cryptocurrency`,
            amount,
            transactionId: `crypto_${Date.now()}`
        };
    }
}

class PaymentContext {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    async executePayment(amount) {
        return await this.strategy.pay(amount);
    }
}

module.exports = { PaymentContext, CashPayment, CardPayment, CryptoPayment };