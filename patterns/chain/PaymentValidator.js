const BaseHandler = require('./BaseHandler');

class PaymentValidator extends BaseHandler {

    handle(request) {

        if (!request.paymentMethod) {

            throw new Error(
                'Payment method required'
            );
        }

        return super.handle(request);
    }
}

module.exports = PaymentValidator;