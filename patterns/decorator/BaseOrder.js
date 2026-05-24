class BaseOrder {
    constructor(order) {
        this.order = order;
        this._price = order.totalPrice || 0;
    }

    getPrice() {
        return this._price;
    }

    getDescription() {
        return 'Basic order';
    }

    getDetails() {
        return {
            ...this.order,
            totalPrice: this.getPrice(),
            description: this.getDescription()
        };
    }
}

class DiscountDecorator {
    constructor(order, discountPercent = 10) {
        this.order = order;
        this.discountPercent = discountPercent;
    }

    getPrice() {
        const originalPrice = this.order.getPrice();
        const discountAmount = originalPrice * (this.discountPercent / 100);
        const finalPrice = originalPrice - discountAmount;
        return Math.round(finalPrice * 100) / 100;
    }

    getDescription() {
        return `${this.order.getDescription()} with ${this.discountPercent}% discount`;
    }
}

class PremiumDeliveryDecorator {
    constructor(order) {
        this.order = order;
        this.premiumFee = 10;
    }

    getPrice() {
        const currentPrice = this.order.getPrice();
        return currentPrice + this.premiumFee;
    }

    getDescription() {
        return `${this.order.getDescription()} with premium delivery (priority)`;
    }

    getDeliveryTime() {
        return '30 minutes (priority)';
    }
}

class InsuranceDecorator {
    constructor(order) {
        this.order = order;
        this.insuranceFee = 5;
    }

    getPrice() {
        const currentPrice = this.order.getPrice();
        return currentPrice + this.insuranceFee;
    }

    getDescription() {
        return `${this.order.getDescription()} with insurance (order protection)`;
    }
}

module.exports = {
    BaseOrder,
    DiscountDecorator,
    PremiumDeliveryDecorator,
    InsuranceDecorator
};