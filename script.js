let carrito = [];

const carritoPanel = document.getElementById('carritoPanel');
const carritoOverlay = document.getElementById('carritoOverlay');
const carritoCount = document.getElementById('carritoCount');
const carritoItems = document.getElementById('carritoItems');
const carritoTotal = document.getElementById('carritoTotal');
const carritoBtn = document.getElementById('carritoBtn');
const carritoCerrar = document.getElementById('carritoCerrar');

function guardarCarrito() {
  localStorage.setItem('carritoKeyHero', JSON.stringify(carrito));
}

function cargarCarrito() {
  const guardado = localStorage.getItem('carritoKeyHero');
  if (guardado) {
    carrito = JSON.parse(guardado);
    actualizarCarritoUI();
  }
}

function actualizarCarritoUI() {
  let totalItems = 0;
  for (let i = 0; i < carrito.length; i++) {
    totalItems = totalItems + carrito[i].cantidad;
  }
  carritoCount.textContent = totalItems;

  if (carrito.length === 0) {
    carritoItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
    carritoTotal.textContent = '$0 ARS';
    return;
  }

  let html = '';
  for (let i = 0; i < carrito.length; i++) {
    const item = carrito[i];
    const subtotal = item.precio * item.cantidad;
    html = html + '<div class="carrito-item" data-index="' + i + '">';
    html = html + '<div class="carrito-item-info">';
    html = html + '<div class="carrito-item-nombre">' + item.nombre + (item.cantidad > 1 ? ' x' + item.cantidad : '') + '</div>';
    html = html + '<div class="carrito-item-precio">$' + item.precio + ' ARS</div>';
    html = html + '<div class="carrito-item-cantidad">';
    html = html + '<button class="cantidad-btn cantidad-menos" data-index="' + i + '">-</button>';
    html = html + '<span class="cantidad-num">' + item.cantidad + '</span>';
    html = html + '<button class="cantidad-btn cantidad-mas" data-index="' + i + '">+</button>';
    html = html + '</div></div>';
    html = html + '<div class="carrito-item-subtotal">$' + subtotal + ' ARS</div>';
    html = html + '<button class="carrito-item-quitar" data-index="' + i + '">✕</button>';
    html = html + '</div>';
  }
  carritoItems.innerHTML = html;

  // Eventos
  const menosBtns = document.querySelectorAll('.cantidad-menos');
  for (let i = 0; i < menosBtns.length; i++) {
    menosBtns[i].onclick = function(e) {
      const idx = parseInt(this.getAttribute('data-index'));
      if (carrito[idx].cantidad > 1) {
        carrito[idx].cantidad--;
      } else {
        carrito.splice(idx, 1);
      }
      guardarCarrito();
      actualizarCarritoUI();
      mostrarToast('Carrito actualizado');
      e.stopPropagation();
    };
  }

  const masBtns = document.querySelectorAll('.cantidad-mas');
  for (let i = 0; i < masBtns.length; i++) {
    masBtns[i].onclick = function(e) {
      const idx = parseInt(this.getAttribute('data-index'));
      carrito[idx].cantidad++;
      guardarCarrito();
      actualizarCarritoUI();
      mostrarToast('Carrito actualizado');
      e.stopPropagation();
    };
  }

  const quitarBtns = document.querySelectorAll('.carrito-item-quitar');
  for (let i = 0; i < quitarBtns.length; i++) {
    quitarBtns[i].onclick = function(e) {
      const idx = parseInt(this.getAttribute('data-index'));
      carrito.splice(idx, 1);
      guardarCarrito();
      actualizarCarritoUI();
      mostrarToast('Producto eliminado');
      e.stopPropagation();
    };
  }

  let total = 0;
  for (let i = 0; i < carrito.length; i++) {
    total = total + (carrito[i].precio * carrito[i].cantidad);
  }
  carritoTotal.textContent = '$' + total + ' ARS';
}

function mostrarToast(mensaje) {
  let toast = document.querySelector('.toast');
  if (toast) toast.remove();
  toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = mensaje;
  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 2000);
}

function cerrarCarrito() {
  carritoPanel.classList.remove('abierto');
  carritoOverlay.classList.remove('visible');
}

carritoBtn.onclick = function() {
  carritoPanel.classList.add('abierto');
  carritoOverlay.classList.add('visible');
};
carritoCerrar.onclick = cerrarCarrito;
carritoOverlay.onclick = cerrarCarrito;

document.getElementById('vaciarCarrito').onclick = function() {
  carrito = [];
  guardarCarrito();
  actualizarCarritoUI();
  mostrarToast('Carrito vaciado');
};

document.getElementById('finalizarPedidoBtn').onclick = function() {
  mostrarToast('¡Gracias por tu compra!');
  cerrarCarrito();
};

const botonesAgregar = document.querySelectorAll('.btn-agregar');
for (let i = 0; i < botonesAgregar.length; i++) {
  botonesAgregar[i].onclick = function(e) {
    const card = this.closest('.producto-card');
    const nombre = card.getAttribute('data-nombre');
    const precio = parseInt(card.getAttribute('data-precio'));
    
    let existente = null;
    for (let j = 0; j < carrito.length; j++) {
      if (carrito[j].nombre === nombre) {
        existente = carrito[j];
        break;
      }
    }
    
    if (existente) {
      existente.cantidad++;
      mostrarToast('➕ ' + nombre + ' ahora x' + existente.cantidad);
    } else {
      carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
      mostrarToast('✅ ' + nombre + ' agregado');
    }
    
    guardarCarrito();
    actualizarCarritoUI();
    e.stopPropagation();
  };
}

document.getElementById('btnEnviar').onclick = function(e) {
  e.preventDefault();
  const nombre = document.getElementById('inputNombre').value;
  const email = document.getElementById('inputEmail').value;
  if (!nombre) { mostrarToast('Completá tu nombre'); return; }
  if (!email) { mostrarToast('Completá tu email'); return; }
  mostrarToast('¡Mensaje enviado ' + nombre + '!');
  document.getElementById('inputNombre').value = '';
  document.getElementById('inputEmail').value = '';
};

const links = document.querySelectorAll('a[href^="#"]');
for (let i = 0; i < links.length; i++) {
  links[i].onclick = function(e) {
    e.preventDefault();
    const destino = document.querySelector(this.getAttribute('href'));
    if (destino) destino.scrollIntoView({ behavior: 'smooth' });
  };
}

cargarCarrito();