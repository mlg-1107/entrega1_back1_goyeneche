const socket = io();

// Agregar producto
const form = document.getElementById('product-form');
form.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(form);
  const product = {};
  for (let [key, value] of formData.entries()) {
    if (key === 'price' || key === 'stock') {
      product[key] = Number(value);
    } else if (key === 'thumbnails') {
      product[key] = value ? value.split(',').map(url => url.trim()) : [];
    } else {
      product[key] = value;
    }
  }
  product.status = true;

  socket.emit('new-product', product);
  form.reset();
});

// Eliminar producto
function deleteProduct(id) {
  socket.emit('delete-product', id);
}

// Escuchar actualización de productos
socket.on('update-products', products => {
  const list = document.getElementById('product-list');
  list.innerHTML = ''; // limpiar

  products.forEach(prod => {
    const li = document.createElement('li');
    li.setAttribute('data-id', prod.id);
    li.style = 'margin-bottom:10px; padding:10px; border:1px solid #ccc';
    li.innerHTML = `
      <strong>${prod.title}</strong><br>
      ${prod.description}<br>
      <em>Precio: $${prod.price}</em><br>
      <button onclick="deleteProduct('${prod.id}')">Eliminar</button>
    `;
    list.appendChild(li);
  });
});
