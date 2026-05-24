class OrderObserver {

    constructor() {

        this.observers = [];
    }

    subscribe(observer) {

        this.observers.push(observer);
    }

    notify(message) {

        this.observers.forEach(observer => {
            observer.update(message);
        });
    }
}

module.exports = OrderObserver;