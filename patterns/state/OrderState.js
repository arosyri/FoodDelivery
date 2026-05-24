class OrderState {
    constructor(order) {
        this.order = order;
    }

    async confirm() {
        throw new Error(`Cannot confirm order in ${this.order.status} state`);
    }

    async cook() {
        throw new Error(`Cannot cook order in ${this.order.status} state`);
    }

    async deliver() {
        throw new Error(`Cannot deliver order in ${this.order.status} state`);
    }

    async complete() {
        throw new Error(`Cannot complete order in ${this.order.status} state`);
    }

    async cancel() {
        throw new Error(`Cannot cancel order in ${this.order.status} state`);
    }

    getStatus() {
        return this.order.status;
    }
}

module.exports = OrderState;