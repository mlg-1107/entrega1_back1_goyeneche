import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

import ProductManager from './managers/ProductManager.js';

// Rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express y HTTP Server
const app = express();
const httpServer = http.createServer(app);

// WebSocket
const io = new Server(httpServer);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// WebSocket y lógica de productos
const productManager = new ProductManager(path.join(__dirname, 'data/products.json'));

io.on('connection', async socket => {
  console.log('🔌 Cliente conectado por WebSocket');

  const products = await productManager.getProducts();
  socket.emit('update-products', products);

  socket.on('new-product', async data => {
    await productManager.addProduct(data);
    const updated = await productManager.getProducts();
    io.emit('update-products', updated);
  });

  socket.on('delete-product', async id => {
    await productManager.deleteProduct(id);
    const updated = await productManager.getProducts();
    io.emit('update-products', updated);
  });
});

// Inicio del servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
