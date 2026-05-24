class PremiumDeliveryDecorator {

    constructor(orderComponent) {

        this.orderComponent = orderComponent;
    }

    getTotalPrice() {

        return (
            this.orderComponent.getTotalPrice()
            + 10
        );
    }
}

module.exports = PremiumDeliveryDecorator;