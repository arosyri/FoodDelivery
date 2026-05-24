class UserFactory {
    static createUser(type, userData) {
        const userTypes = {
            customer: () => ({
                ...userData,
                role: 'customer',
                discount: 0,
                deliveryFee: 5
            }),
            courier: () => ({
                ...userData,
                role: 'courier',
                vehicle: userData.vehicle || 'bike',
                maxOrders: 3
            }),
            restaurant: () => ({
                ...userData,
                role: 'restaurant',
                commission: 0.15,
                preparationTime: 30
            }),
            admin: () => ({
                ...userData,
                role: 'admin',
                permissions: ['all']
            })
        };

        const create = userTypes[type];
        if (!create) throw new Error(`Unknown user type: ${type}`);

        return create();
    }
}

module.exports = UserFactory;