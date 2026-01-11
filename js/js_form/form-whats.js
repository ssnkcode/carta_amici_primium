const whatsappNumber = "543541387884";
let userCoordinates = null;

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('pedidoForm');
    const successMessage = document.getElementById('successMessage');
    const loadingMessage = document.getElementById('loadingMessage');
    const locationMessage = document.getElementById('locationMessage');
    const locationText = document.getElementById('locationText');
    const enviarBtn = document.getElementById('enviarBtn');
    const locationToggle = document.getElementById('locationToggle');
    const autoLocationBtn = document.getElementById('autoLocationBtn');
    
    const inputCalle = document.getElementById('calle');
    const inputAltura = document.getElementById('altura');
    const inputBarrio = document.getElementById('barrio');
    const inputCiudad = document.getElementById('ciudad');
    const inputLat = document.getElementById('latitud');
    const inputLng = document.getElementById('longitud');

    const telefonoInput = document.getElementById('telefono');
    telefonoInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
    });

    function resetCoordsOnManualInput() {
        if (userCoordinates) {
            userCoordinates = null;
            inputLat.value = '';
            inputLng.value = '';
            locationText.textContent = "Ubicación: Se calculará basada en la dirección escrita.";
            locationMessage.style.display = 'block';
        }
    }

    [inputCalle, inputAltura, inputBarrio, inputCiudad].forEach(input => {
        input.addEventListener('input', resetCoordsOnManualInput);
    });

    function handlePositionSuccess(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        userCoordinates = { lat, lng };

        inputLat.value = lat.toFixed(6);
        inputLng.value = lng.toFixed(6);

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
            .then(response => response.json())
            .then(data => {
                if (data.address) {
                    inputCalle.value = data.address.road || inputCalle.value;
                    inputAltura.value = data.address.house_number || inputAltura.value;
                    inputBarrio.value = data.address.suburb || data.address.neighbourhood || inputBarrio.value;
                    inputCiudad.value = data.address.city || data.address.town || inputCiudad.value;
                    
                    locationText.textContent = `📍 GPS Detectado: ${data.address.road || ''} ${data.address.house_number || ''}`;
                } else {
                    locationText.textContent = `📍 Coordenadas GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                }
                locationMessage.style.display = 'block';
            })
            .catch(() => {
                locationText.textContent = `📍 Coordenadas GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                locationMessage.style.display = 'block';
            });
    }

    function handlePositionError(error) {
        let errorMessage = "No se pudo obtener ubicación GPS.";
        if (error.code === error.TIMEOUT) errorMessage = "Tiempo de GPS agotado.";
        locationText.textContent = errorMessage;
        locationMessage.style.display = 'block';
    }

    function getCurrentLocation() {
        if (!navigator.geolocation) {
            locationText.textContent = "Navegador no soporta GPS";
            return;
        }

        locationText.textContent = "Obteniendo ubicación...";
        locationMessage.style.display = 'block';

        navigator.geolocation.getCurrentPosition(
            handlePositionSuccess,
            function(error) {
                navigator.geolocation.getCurrentPosition(
                    handlePositionSuccess,
                    handlePositionError,
                    { enableHighAccuracy: false, timeout: 10000 }
                );
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    }

    locationToggle.addEventListener('click', getCurrentLocation);
    autoLocationBtn.addEventListener('click', getCurrentLocation);

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const calle = inputCalle.value.trim();
        const altura = inputAltura.value.trim();
        const barrio = inputBarrio.value.trim();
        const ciudad = inputCiudad.value.trim();
        const pedido = document.getElementById('pedido').value.trim();
        
        if (!nombre || !telefono || !pedido) {
            alert("Por favor completa: Nombre, Teléfono y el Pedido.");
            return;
        }

        const hasManualAddress = calle && altura && ciudad;
        
        if (!userCoordinates && !hasManualAddress) {
            alert("Ingresa una dirección (Calle, Altura, Ciudad) o usa el botón de ubicación.");
            return;
        }

        loadingMessage.style.display = 'block';
        successMessage.style.display = 'none';
        enviarBtn.disabled = true;
        enviarBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando datos...';

        let finalLat = "";
        let finalLng = "";
        let tipoUbicacionText = "";

        if (hasManualAddress) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 4000);

                const query = `${calle} ${altura}, ${barrio}, ${ciudad}, Argentina`;
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                const data = await response.json();
                
                if (data && data.length > 0) {
                    finalLat = data[0].lat;
                    finalLng = data[0].lon;
                    tipoUbicacionText = "_📍 Ubicación basada en dirección ingresada_";
                    
                    inputLat.value = parseFloat(finalLat).toFixed(6);
                    inputLng.value = parseFloat(finalLng).toFixed(6);
                } else {
                    if (userCoordinates) {
                        finalLat = userCoordinates.lat;
                        finalLng = userCoordinates.lng;
                        tipoUbicacionText = "_📍 Ubicación GPS (Dirección no encontrada en mapa)_";
                    } else {
                        tipoUbicacionText = "_📍 Dirección manual (Sin coordenadas)_";
                    }
                }
            } catch (error) {
                if (userCoordinates) {
                    finalLat = userCoordinates.lat;
                    finalLng = userCoordinates.lng;
                }
                tipoUbicacionText = "_📍 Dirección manual_";
            }
        } 
        else if (userCoordinates) {
            finalLat = userCoordinates.lat;
            finalLng = userCoordinates.lng;
            tipoUbicacionText = "_📍 Ubicación GPS actual_";
        }

        let mapsURL = "";
        if (finalLat && finalLng) {
            mapsURL = `https://maps.google.com/?q=${finalLat},${finalLng}`;
        } else {
            const cleanAddress = `${calle} ${altura}, ${ciudad}, Argentina`;
            mapsURL = `https://maps.google.com/?q=${encodeURIComponent(cleanAddress)}`;
        }

        let mensajeTexto = `*NUEVO PEDIDO WEB*\n\n` +
                           `*👤 Cliente:* ${nombre}\n` +
                           `*📱 Tel:* ${telefono}\n\n` +
                           `*📍 Dirección de Entrega:*\n`;

        if (calle) mensajeTexto += `• ${calle} ${altura}\n`;
        if (barrio) mensajeTexto += `• Barrio: ${barrio}\n`;
        if (ciudad) mensajeTexto += `• Ciudad: ${ciudad}\n`;

        mensajeTexto += `\n*🛒 Pedido:*\n${pedido}\n\n` +
                        `*🗺 Ver en Mapa:*\n${mapsURL}\n\n` +
                        `${tipoUbicacionText}`;

        const mensajeCodificado = encodeURIComponent(mensajeTexto);
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${mensajeCodificado}`;

        loadingMessage.style.display = 'none';
        successMessage.style.display = 'block';

        setTimeout(function() {
            window.location.href = whatsappURL;
            
            setTimeout(() => {
                enviarBtn.disabled = false;
                enviarBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar Pedido';
            }, 1000);
        }, 1500);
    });
});