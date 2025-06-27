const API_URL = 'https://retoolapi.dev/bAyRhX/data'
const container = document.getElementById('cards-container')

async function CargarVehiculos(params) {
    try {
        const res = await fetch(API_URL)
        const data = await res.json();
        CargarTarjetas(data);
    } catch (error) {
        console.error('Error al cargar datos: ', error)
        container.innerHTML = '<p>Error al cargar los vehiculos.</p>'
    }
}

function CargarTarjetas(vehiculos){
    container.innerHTML = '';
    if(vehiculos.length == 0){
        container.innerHTML = "<p>No hay vehiculos registrados</p>";
        return;
    }
    vehiculos.forEach(vehiculos => {
        container.innerHTML += `
        <div class="card">
        <h2>${vehiculos.Marca}</h2>
        <h2>${vehiculos.Modelo}</h2>
        <img src="${vehiculos.Imagen}" alt= "Foto de perfil">
        <p>${vehiculos.Tipo}</p>
        <p>${vehiculos.Color}</p>
        <p>${vehiculos.Placa}</p>
        <p>${vehiculos.Anio}</p>
         <p>$${vehiculos.precio}</p>
        </div>
         `;
    });
}

window.addEventListener('DOMContentLoaded',CargarVehiculos);