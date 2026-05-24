class Command {
    async execute() {
        throw new Error('execute() must be implemented');
    }

    async undo() {
        throw new Error('undo() must be implemented');
    }
}

class CancelOrderCommand extends Command {
    constructor(orderModel, orderId, userId) {
        super();
        this.orderModel = orderModel;
        this.orderId = orderId;
        this.userId = userId;
        this.previousStatus = null;
    }

    async execute() {
        const order = await this.orderModel.findOne({
            _id: this.orderId,
            user: this.userId
        });

        if (!order) {
            throw new Error('Order not found');
        }

        if (order.status !== 'pending') {
            throw new Error('Cannot cancel order that is already being processed');
        }

        this.previousStatus = order.status;

        order.status = 'cancelled';
        await order.save();

        return {
            success: true,
            message: 'Order cancelled successfully',
            order: order
        };
    }

    async undo() {
        if (!this.previousStatus) {
            throw new Error('Nothing to undo');
        }

        const order = await this.orderModel.findOne({
            _id: this.orderId,
            user: this.userId
        });

        if (!order) {
            throw new Error('Order not found');
        }

        order.status = this.previousStatus;
        await order.save();

        return {
            success: true,
            message: 'Order restoration successful',
            order: order
        };
    }
}

class CommandInvoker {
    constructor() {
        this.commandHistory = [];
    }

    async executeCommand(command) {
        const result = await command.execute();
        this.commandHistory.push(command);
        return result;
    }

    async undoLastCommand() {
        const command = this.commandHistory.pop();
        if (command) {
            return await command.undo();
        }
        throw new Error('No commands to undo');
    }
}

module.exports = { CancelOrderCommand, CommandInvoker };