document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('#checkout-table tbody');
    const totalEl = document.querySelector('#checkout-total');
    const placeOrderBtn = document.querySelector('#place-order');

    function getCart() {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    }

    function render() {
        const cart = getCart();
        tbody.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const tr = document.createElement('tr');
            const subtotal = (item.precio || 0) * (item.cantidad || 1);
            total += subtotal;

            tr.innerHTML = `
                <td>${item.titulo}</td>
                <td>${item.cantidad}</td>
                <td>$${(item.precio||0).toFixed(2)}</td>
                <td>$${subtotal.toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });

        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    placeOrderBtn.addEventListener('click', () => {
        localStorage.removeItem('carrito');
        render();
        alert('Gracias — tu pedido ha sido registrado (simulación).');
        window.location.href = 'index.html';
    });

    render();
});
