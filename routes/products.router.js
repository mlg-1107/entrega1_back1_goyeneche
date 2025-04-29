import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager();


router.get('/', async (req, res) => {
    const products = await manager.getProducts();
    res.json(products);
});

router.get('/:pid', async (req, res) => {
    const product = await manager.getProductById(req.params.pid);
    product ? res.json(product) : res.status(404).send({ error: 'Producto no encontrado' });
});

router.post('/', async (req, res) => {
    const productos = Array.isArray(req.body) ? req.body : [req.body];

    const requiredFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
    const created = [];

    for (const product of productos) {

        const tieneCampos = requiredFields.every(f => f in product);
        if (!tieneCampos) {
            return res.status(400).json({ error: 'Uno o más productos tienen campos faltantes' });
        }

        const nuevo = await manager.addProduct(product);
        created.push(nuevo);
        }

    res.status(201).json(created.length === 1 ? created[0] : created);
});


router.put('/:pid', async (req, res) => {
    const updated = await manager.updateProduct(req.params.pid, req.body);
    updated ? res.json(updated) : res.status(404).send({ error: 'Producto no encontrado' });
});

router.delete('/:pid', async (req, res) => {
    const deleted = await manager.deleteProduct(req.params.pid);
    if (!deleted) {
        return res.status(404).send({ error: 'Producto no encontrado' });
    }
    res.status(204).send();
});

export default router;
