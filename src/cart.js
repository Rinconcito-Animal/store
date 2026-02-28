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
        const existing = this.items.find(item => String(item.id) === String(product.id));
        const stock = product.stock !== undefined ? product.stock : 999;

        if (existing) {
            if (existing.quantity < stock) {
                existing.quantity += 1;
            } else {
                return { success: false, message: 'No hay más stock disponible' };
            }
        } else {
            if (stock > 0) {
                this.items.push({ ...product, quantity: 1 });
            } else {
                return { success: false, message: 'Producto sin stock' };
            }
        }
        this.save();
        return { success: true };
    }

    removeItem(productId) {
        this.items = this.items.filter(item => String(item.id) !== String(productId));
        this.save();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => String(item.id) === String(productId));
        if (item) {
            const stock = item.stock !== undefined ? item.stock : 999;
            item.quantity = Math.max(1, Math.min(quantity, stock));
            this.save();
            return { success: item.quantity === quantity, current: item.quantity };
        }
        return { success: false };
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
