/* ********************************** */
/*               HEADER               */
/* ********************************** */
const btnToggleResponsive = document.querySelector('.btn-toggle');
const menuResponsive = document.querySelector('.menu-responsive');
const header = document.querySelector('header')

btnToggleResponsive.addEventListener('click', () => {
	const iconBars = document.querySelector('.fa-bars');
	const iconClose = document.querySelector('.fa-xmark');

	console.log(header.clientHeight);


	if (iconBars.classList.contains('active')) {
		iconBars.classList.remove('active');
		iconClose.classList.add('active');
		menuResponsive.classList.add('show');
		menuResponsive.style.top = `${header.clientHeight}px`;
	} else {
		iconBars.classList.add('active');
		iconClose.classList.remove('active');
		menuResponsive.classList.remove('show');
	}
});

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
