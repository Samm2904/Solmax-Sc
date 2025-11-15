document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.querySelector("#productos-container");
    if (!contenedor) {
        console.error('No se encontró #productos-container en la página.');
        return;
    }

    const API_URL = contenedor.getAttribute('data-api') || 'https://fakestoreapi.com/products';

    contenedor.innerHTML = '<p class="loading">Cargando productos...</p>';

    fetch(API_URL)
        .then(resp => {
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            return resp.json();
        })
        .then(data => {
            const filtered = filterProducts(data || [], contenedor);
            renderProductos(contenedor, filtered);
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
            contenedor.innerHTML = `<p style="color:red;">Error al cargar productos. Intente más tarde.</p>`;
        })
        .finally(() => {
            actualizarContadorCarrito();
            setupCartPanel();
        });
});

function filterProducts(products, container) {
    if (!Array.isArray(products)) return [];
    const category = (container.getAttribute && container.getAttribute('data-category')) || '';
    const keywordsAttr = (container.getAttribute && container.getAttribute('data-keywords')) || '';

    if (category) {
        const cat = category.toString().toLowerCase().trim();
        return products.filter(p => (p.category || '').toString().toLowerCase() === cat);
    }

    if (keywordsAttr) {
        const kws = keywordsAttr.toString().toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        if (kws.length === 0) return products;
        return products.filter(p => {
            const hay = `${(p.title||'') + ' ' + (p.description||'')}`.toLowerCase();
            return kws.some(k => hay.includes(k));
        });
    }

    return products;
}

        function renderProductos(container, productos) {
            container.innerHTML = '';

            if (!Array.isArray(productos) || productos.length === 0) {
                container.innerHTML = '<p>No hay productos disponibles en este momento.</p>';
                return;
            }

            const row = document.createElement('div');
            row.className = 'row g-3';

            productos.forEach(producto => {
                const col = document.createElement('div');
                col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';

                const card = document.createElement('div');
                card.className = 'card h-100';

                const img = document.createElement('img');
                img.src = producto.image || '';
                img.alt = producto.title || 'Producto';
                img.className = 'card-img-top';
                img.style.objectFit = 'contain';
                img.style.height = '180px';

                const cardBody = document.createElement('div');
                cardBody.className = 'card-body d-flex flex-column';

                const title = document.createElement('h5');
                title.className = 'card-title';
                title.textContent = producto.title || 'Sin título';

                const price = document.createElement('div');
                price.className = 'card-text mt-auto';
                const pricePill = document.createElement('span');
                pricePill.className = 'price-pill';
                pricePill.textContent = `$${(producto.price || 0).toFixed(2)}`;
                price.appendChild(pricePill);

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'btn btn-primary mt-2';
                btn.textContent = 'Añadir al carrito';
                btn.addEventListener('click', () => {
                    agregarAlCarrito(producto.id, producto.title, producto.price, producto.image);
                });

                cardBody.appendChild(title);
                cardBody.appendChild(price);
                cardBody.appendChild(btn);

                card.appendChild(img);
                card.appendChild(cardBody);

                col.appendChild(card);
                row.appendChild(col);
            });

            container.appendChild(row);
        }

        function getCart() {
            return JSON.parse(localStorage.getItem('carrito')) || [];
        }

        function saveCart(cart) {
            localStorage.setItem('carrito', JSON.stringify(cart));
        }

        function agregarAlCarrito(id, titulo, precio, imagen) {
            let carrito = getCart();
            const productoExistente = carrito.find(item => item.id === id);

            if (productoExistente) {
                productoExistente.cantidad += 1;
            } else {
                carrito.push({ id, titulo, precio, image: imagen || '', cantidad: 1 });
            }

            saveCart(carrito);
            actualizarContadorCarrito();
            renderCartPanel();
            setTimeout(() => { flashCartItem(id); }, 120);

            const toast = document.createElement('div');
            toast.className = 'product-toast';
            toast.textContent = `"${titulo}" agregado al carrito.`;
            document.body.appendChild(toast);
            setTimeout(() => document.body.removeChild(toast), 1400);
        }

        function actualizarContadorCarrito() {
            const carrito = getCart();
            const totalProductos = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
            const contador = document.querySelector('#contador-carrito');
            if (contador) contador.textContent = totalProductos;
        }

        function setupCartPanel() {
            const abrirBtn = document.querySelector('#abrir-carrito');
            const cerrarBtn = document.querySelector('#cerrar-carrito');
            const vaciarBtn = document.querySelector('#vaciar-carrito');

            if (abrirBtn) abrirBtn.addEventListener('click', openCartPanel);
            if (cerrarBtn) cerrarBtn.addEventListener('click', closeCartPanel);
            if (vaciarBtn) vaciarBtn.addEventListener('click', () => {
                saveCart([]);
                renderCartPanel();
                actualizarContadorCarrito();
            });
            renderCartPanel();
        }

        function openCartPanel() {
            const panel = document.querySelector('#cart-panel');
            if (!panel) return;
            panel.classList.remove('hidden');
            panel.setAttribute('aria-hidden','false');
        }

        function closeCartPanel() {
            const panel = document.querySelector('#cart-panel');
            if (!panel) return;
            panel.classList.add('hidden');
            panel.setAttribute('aria-hidden','true');
        }

        function renderCartPanel() {
            const lista = document.querySelector('#lista-carrito');
            const subtotalEl = document.querySelector('#cart-subtotal');
            const totalEl = document.querySelector('#cart-total');
            if (!lista) return;

            const cart = getCart();
            lista.innerHTML = '';

            if (cart.length === 0) {
                lista.innerHTML = '<li class="empty">Tu carrito está vacío.</li>';
                if (subtotalEl) subtotalEl.textContent = '$0.00';
                if (totalEl) totalEl.textContent = '$0.00';
                return;
            }

            let subtotal = 0;

            cart.forEach(item => {
                const li = document.createElement('li');
                li.className = 'cart-item d-flex justify-content-between align-items-center';
                li.dataset.id = String(item.id);

                const thumb = document.createElement('img');
                thumb.src = item.image || '';
                thumb.alt = item.titulo || 'Producto';
                thumb.className = 'cart-item-thumb rounded';
                thumb.style.width = '56px';
                thumb.style.height = '56px';
                thumb.style.objectFit = 'cover';

                const info = document.createElement('div');
                info.className = 'cart-item-info ms-2';
                info.innerHTML = `<strong style="display:block;">${item.titulo}</strong><small>$${(item.precio||0).toFixed(2)}</small>`;

                const leftWrap = document.createElement('div');
                leftWrap.className = 'd-flex align-items-center';
                leftWrap.appendChild(thumb);
                leftWrap.appendChild(info);
                
                const controls = document.createElement('div');
                controls.className = 'cart-item-controls d-flex align-items-center gap-2';

                const minusBtn = document.createElement('button');
                minusBtn.className = 'btn btn-sm btn-outline-secondary';
                minusBtn.textContent = '-';
                minusBtn.addEventListener('click', () => {
                    const newQty = Math.max(1, (item.cantidad || 1) - 1);
                    updateItemQuantity(item.id, newQty);
                });

                const qtySpan = document.createElement('span');
                qtySpan.className = 'px-2 qty-span';
                qtySpan.textContent = item.cantidad || 1;

                const plusBtn = document.createElement('button');
                plusBtn.className = 'btn btn-sm btn-outline-secondary';
                plusBtn.textContent = '+';
                plusBtn.addEventListener('click', () => {
                    const newQty = (item.cantidad || 1) + 1;
                    updateItemQuantity(item.id, newQty);
                });

                const removeBtn = document.createElement('button');
                removeBtn.className = 'btn btn-sm btn-outline-danger';
                removeBtn.textContent = 'Eliminar';
                removeBtn.addEventListener('click', () => {
                    removeItemFromCart(item.id);
                });

                controls.appendChild(minusBtn);
                controls.appendChild(qtySpan);
                controls.appendChild(plusBtn);
                controls.appendChild(removeBtn);

                li.appendChild(leftWrap);
                li.appendChild(controls);

                lista.appendChild(li);

                subtotal += (item.precio || 0) * (item.cantidad || 1);
            });

            if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
            if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
        }

        function updateItemQuantity(id, cantidad) {
            const cart = getCart();
            const item = cart.find(i => i.id === id);
            if (!item) return;
            item.cantidad = cantidad;
            saveCart(cart);
            renderCartPanel();
            setTimeout(() => { flashCartItem(id); }, 80);
            actualizarContadorCarrito();
        }

        function removeItemFromCart(id) {
            let cart = getCart();
            cart = cart.filter(i => i.id !== id);
            saveCart(cart);
            renderCartPanel();
            actualizarContadorCarrito();
        }

        function flashCartItem(id) {
            try {
                const lista = document.querySelector('#lista-carrito');
                if (!lista) return;
                const li = lista.querySelector(`li[data-id="${id}"]`);
                if (!li) return;
                li.classList.add('item-changed');
                setTimeout(() => li.classList.remove('item-changed'), 900);
            } catch (err) {
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const irCheckout = document.querySelector('#ir-checkout');
            if (!irCheckout) return;

            irCheckout.addEventListener('click', (e) => {
                const cart = getCart();
                if (!Array.isArray(cart) || cart.length === 0) {
                    e.preventDefault();
                    const toast = document.createElement('div');
                    toast.className = 'product-toast';
                    toast.textContent = 'Tu carrito está vacío. Agrega productos antes de ir a pagar.';
                    document.body.appendChild(toast);
                    openCartPanel();
                    setTimeout(() => {
                        try { document.body.removeChild(toast); } catch (err) { /* noop */ }
                    }, 2000);
                }
            });
        });
