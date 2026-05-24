class OrderBuilder {
    constructor() {
        this.reset();
    }

    reset() {
        this.order = {
            items: [],
            totalPrice: 0,
            paymentMethod: 'cash',
            discount: false,
            specialInstructions: '',
            deliveryTime: null
        };
        return this;
    }

    addItem(name, quantity, price) {
        this.order.items.push({ name, quantity, price });
        this.order.totalPrice += price * quantity;
        return this;
    }

    setPaymentMethod(method) {
        this.order.paymentMethod = method;
        return this;
    }

    applyDiscount(percent) {
        this.order.discount = true;
        this.order.totalPrice = this.order.totalPrice * (1 - percent / 100);
        return this;
    }

    setSpecialInstructions(instructions) {
        this.order.specialInstructions = instructions;
        return this;
    }

    setDeliveryTime(time) {
        this.order.deliveryTime = time;
        return this;
    }

    build() {
        const result = { ...this.order };
        this.reset();
        return result;
    }
}

module.exports = OrderBuilder;