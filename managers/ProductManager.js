import fs from 'fs/promises';
import path from 'path';

const PRODUCTS_FILE = path.resolve('data/products.json');

export default class ProductManager {
  constructor() {
    this.path = PRODUCTS_FILE;
  }

  async getProducts() {
    const data = await fs.readFile(this.path, 'utf-8');
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newId = products.length ? (parseInt(products[products.length - 1].id) + 1).toString() : "1";
    const newProduct = { id: newId, ...product };
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2)); // Guarda los productos actualizados
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;


    delete updates.id;

    products[index] = { ...products[index], ...updates };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id.toString());

    
    if (products.length === filtered.length) {
      // No se elimina nada porque no se enccuentra el id
      return false;
    }

    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
  }
}
