import express from 'express';
import CartManager from '../managers/CartManager.js';

const router = express.Router();
const manager = new CartManager();

router.post('/', async (req, res) => {
  try {
    const cart = await manager.createCart();
    res.status(201).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creando el carrito');
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error obteniendo el carrito');
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const updatedCart = await manager.addProductToCart(cid, pid, quantity);
    if (updatedCart) {
      res.json(updatedCart);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error agregando el producto al carrito');
  }
});

export default router;
