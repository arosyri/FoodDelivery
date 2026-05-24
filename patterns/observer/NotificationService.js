class Observer {
    update(order) {
        throw new Error('update() must be implemented');
    }
}

class EmailNotifier extends Observer {
    update(order) {
        console.log(`Email: Order ${order._id} status changed to ${order.status}`);
        return { sent: true, type: 'email', orderId: order._id, status: order.status };
    }
}

class SMSNotifier extends Observer {
    update(order) {
        console.log(`📱 SMS: Order ${order._id} is now ${order.status}`);
        return { sent: true, type: 'sms', orderId: order._id, status: order.status };
    }
}

class PushNotifier extends Observer {
    update(order) {
        console.log(`🔔 Push: Your order ${order._id} status: ${order.status}`);
        return { sent: true, type: 'push', orderId: order._id, status: order.status };
    }
}

class NotificationService {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(order) {
        this.observers.forEach(observer => observer.update(order));
    }
}

module.exports = { NotificationService, EmailNotifier, SMSNotifier, PushNotifier };