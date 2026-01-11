const whatsappNumber = "543541387884";
let userCoordinates = null;

const restaurantLocation = {
    name: "Comidas AMICI",
    lat: -31.416668,  
    lng: -64.183334,  
    address: "Av. Roque Sáenz Peña 47, X5158 Córdoba"  
};

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

    // ... (el resto del código hasta el submit permanece IGUAL) ...

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
        let clienteAddress = "";

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
                    clienteAddress = `${calle} ${altura}, ${ciudad}`;
                    
                    inputLat.value = parseFloat(finalLat).toFixed(6);
                    inputLng.value = parseFloat(finalLng).toFixed(6);
                } else {
                    if (userCoordinates) {
                        finalLat = userCoordinates.lat;
                        finalLng = userCoordinates.lng;
                        tipoUbicacionText = "_📍 Ubicación GPS (Dirección no encontrada en mapa)_";
                        clienteAddress = `Coordenadas: ${finalLat}, ${finalLng}`;
                    } else {
                        tipoUbicacionText = "_📍 Dirección manual (Sin coordenadas)_";
                        clienteAddress = `${calle} ${altura}, ${ciudad}`;
                    }
                }
            } catch (error) {
                if (userCoordinates) {
                    finalLat = userCoordinates.lat;
                    finalLng = userCoordinates.lng;
                    clienteAddress = `Coordenadas: ${finalLat}, ${finalLng}`;
                } else {
                    clienteAddress = `${calle} ${altura}, ${ciudad}`;
                }
                tipoUbicacionText = "_📍 Dirección manual_";
            }
        } 
        else if (userCoordinates) {
            finalLat = userCoordinates.lat;
            finalLng = userCoordinates.lng;
            tipoUbicacionText = "_📍 Ubicación GPS actual_";
            clienteAddress = `Coordenadas: ${finalLat.toFixed(6)}, ${finalLng.toFixed(6)}`;
        }

        // 🔥 NUEVO: CALCULAR DISTANCIA Y RUTA
        let mapsURL = "";
        let routeURL = "";
        let distanceInfo = "";
        
        if (finalLat && finalLng) {
            // URL para ver SOLO la dirección del cliente
            mapsURL = `https://www.google.com/maps?q=${finalLat},${finalLng}`;
            
            // 🔥 URL con RUTA desde el restaurante hasta el cliente
            routeURL = `https://www.google.com/maps/dir/${restaurantLocation.lat},${restaurantLocation.lng}/${finalLat},${finalLng}`;
            
            // Intentar calcular distancia aproximada
            try {
                const distance = calculateDistance(
                    restaurantLocation.lat, 
                    restaurantLocation.lng,
                    finalLat,
                    finalLng
                );
                distanceInfo = `📏 Distancia aproximada: ${distance.km.toFixed(1)} km (${distance.min} min en auto)`;
            } catch (e) {
                distanceInfo = "📏 Distancia: No calculada";
            }
        } else {
            const cleanAddress = `${calle} ${altura}, ${ciudad}, Argentina`;
            mapsURL = `https://www.google.com/maps?q=${encodeURIComponent(cleanAddress)}`;
            routeURL = `https://www.google.com/maps/dir/${encodeURIComponent(restaurantLocation.address)}/${encodeURIComponent(cleanAddress)}`;
            distanceInfo = "📏 Distancia: Ver ruta completa";
        }

        // 🔥 MENSAJE MEJORADO CON AMBAS UBICACIONES
        let mensajeTexto = `*🍽️ NUEVO PEDIDO - ${restaurantLocation.name}*\n\n` +
                           `*👤 CLIENTE:* ${nombre}\n` +
                           `*📱 TELÉFONO:* ${telefono}\n\n` +
                           `*📍 DIRECCIÓN DE ENTREGA:*\n` +
                           `• ${clienteAddress}\n`;
        
        if (barrio) mensajeTexto += `• Barrio: ${barrio}\n`;
        mensajeTexto += `\n*🍔 PEDIDO:*\n${pedido}\n\n`;
        
        // 🔥 SECCIÓN DE MAPAS
        mensajeTexto += `*🗺️ MAPAS Y RUTAS:*\n`;
        mensajeTexto += `📍 Ver ubicación cliente: ${mapsURL}\n`;
        mensajeTexto += `🚗 Ruta desde restaurante: ${routeURL}\n`;
        mensajeTexto += `🏠 Restaurante: ${restaurantLocation.address}\n`;
        mensajeTexto += `${distanceInfo}\n\n`;
        
        mensajeTexto += `${tipoUbicacionText}\n`;
        mensajeTexto += `_Enviado desde formulario web_`;

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

// 🔥 FUNCIÓN PARA CALCULAR DISTANCIA APROXIMADA
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const km = R * c;
    
    // Estimación: 2 min por km en ciudad + 5 min base
    const min = Math.round((km * 2) + 5);
    
    return { km, min };
}

// 🔥 FUNCIÓN PARA OBTENER DIRECCIÓN DETALLADA (OPCIONAL)
async function getDetailedAddress(lat, lng) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        
        if (data.address) {
            return {
                calle: data.address.road || '',
                altura: data.address.house_number || '',
                barrio: data.address.suburb || data.address.neighbourhood || '',
                ciudad: data.address.city || data.address.town || ''
            };
        }
    } catch (error) {
        console.error("Error obteniendo dirección:", error);
    }
    return null;
}