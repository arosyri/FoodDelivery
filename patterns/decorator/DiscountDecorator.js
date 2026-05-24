class DiscountDecorator {

    constructor(orderComponent) {

        this.orderComponent = orderComponent;
    }

    getTotalPrice() {

        return (
            this.orderComponent.getTotalPrice()
            * 0.9
        );
    }
}

module.exports = DiscountDecorator;