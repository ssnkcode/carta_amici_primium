document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('products-container');
    const tabs = document.querySelectorAll('.section-menu .container-tabs button');
    let allProducts = [];

    fetch('./products/products.json')
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            renderProducts(allProducts);
        })
        .catch(error => console.error(error));

    function renderProducts(products) {
        container.innerHTML = '';

        if (products.length === 0) {
            container.innerHTML = '<p style="text-align:center; width:100%;">No hay productos en esta categoría.</p>';
            return;
        }

        products.forEach(product => {
            const imageSrc = product.image ? product.image : 'images/logo.svg';
            const description = product.descripcion ? product.descripcion : '';

            const cardHTML = `
                <div class="container-dish">
                    <div class="container-img">
                        <img src="${imageSrc}" alt="${product.titulo}">
                    </div>
                    <div class="info-dish">
                        <div class="row">
                            <h3>${product.titulo}</h3>
                            <div class="divider"></div>
                            <span>$${product.precio.toLocaleString('es-AR')}</span>
                        </div>
                        <p>${description}</p>
                    </div>
                </div>
            `;
            
            container.innerHTML += cardHTML;
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.getAttribute('data-category');

            if (category === 'all') {
                renderProducts(allProducts);
            } else {
                const filtered = allProducts.filter(p => p.categoria === category);
                renderProducts(filtered);
            }
        });
    });
});

//

// Menú hamburguesa
document.querySelector('.btn-toggle').addEventListener('click', function() {
    // Crear el menú responsive si no existe
    let menu = document.querySelector('.menu-responsive');
    if (!menu) {
        menu = document.createElement('div');
        menu.className = 'menu-responsive';
        menu.innerHTML = `
            <ul>
                <li><a href="#menu_amici">VER MENU</a></li>
                <li><a href="#">CONTACTO</a></li>
                <li><a href="#">UBICACION</a></li>
            </ul>
        `;
        document.querySelector('header').appendChild(menu);
    }
    
    // Alternar la clase 'show'
    menu.classList.toggle('show');
    
    // Cambiar iconos
    const bars = this.querySelector('.fa-bars');
    const xmark = this.querySelector('.fa-xmark');
    bars.classList.toggle('active');
    xmark.classList.toggle('active');
});

