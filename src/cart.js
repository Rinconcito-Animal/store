export class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart_items')) || [];
        this.listeners = [];
    }

    save() {
        localStorage.setItem('cart_items', JSON.stringify(this.items));
        this.notify();
    }

    addItem(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.save();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.save();
        }
    }

    clear() {
        this.items = [];
        this.save();
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    subscribe(callback) {
        this.listeners.push(callback);
    }

    notify() {
        this.listeners.forEach(callback => callback(this.items));
    }
}

export const cart = new Cart();
