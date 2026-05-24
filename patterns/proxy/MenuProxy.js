class MenuService {
    async getMenu() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 1, name: 'Pizza', price: 15, category: 'Italian', available: true },
                    { id: 2, name: 'Burger', price: 12, category: 'Fast Food', available: true },
                    { id: 3, name: 'Sushi', price: 20, category: 'Japanese', available: true },
                    { id: 4, name: 'Pasta', price: 14, category: 'Italian', available: false },
                    { id: 5, name: 'Salad', price: 8, category: 'Healthy', available: true }
                ]);
            }, 1000);
        });
    }
}

class MenuProxy {
    constructor() {
        this.menuService = new MenuService();
        this.cache = null;
        this.cacheExpiry = null;
        this.cacheDuration = 5 * 60 * 1000;
    }

    async getMenu(forceRefresh = false) {
        if (!forceRefresh && this.cache && this.cacheExpiry > Date.now()) {
            console.log('Returning cached menu');
            return this.cache;
        }

        console.log('Fetching fresh menu from database');
        this.cache = await this.menuService.getMenu();
        this.cacheExpiry = Date.now() + this.cacheDuration;

        return this.cache;
    }

    async getAvailableItems() {
        const menu = await this.getMenu();
        return menu.filter(item => item.available);
    }

    async getItemById(id) {
        const menu = await this.getMenu();
        return menu.find(item => item.id === id);
    }

    async searchItems(query) {
        const menu = await this.getMenu();
        return menu.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );
    }

    invalidateCache() {
        this.cache = null;
        this.cacheExpiry = null;
        console.log('Cache invalidated');
    }
}

module.exports = MenuProxy;