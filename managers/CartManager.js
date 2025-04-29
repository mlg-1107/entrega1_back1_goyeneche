import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CartManager {
  constructor() {
    this.cartsFilePath = path.join(__dirname, '../data/carts.json');
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.cartsFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading carts file', error);
      return [];
    }
  }

  async getCartById(cartId) {
    const carts = await this.getCarts();
    return carts.find(cart => cart.id === cartId);
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: (carts.length + 1).toString(),
      products: []
    };
    carts.push(newCart);
    await fs.writeFile(this.cartsFilePath, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cartId, productId, quantity) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === cartId);
    if (cart) {
      const productIndex = cart.products.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ id: productId, quantity });
      }
      await fs.writeFile(this.cartsFilePath, JSON.stringify(carts, null, 2));
      return cart;
    }
    return null;
  }
}

export default CartManager;
